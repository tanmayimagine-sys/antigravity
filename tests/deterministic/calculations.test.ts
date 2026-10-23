import { describe, it, expect } from "vitest";
import { reconcileSettlements, detectDuplicates } from "@/lib/deterministic/reconciliation";
import { calculateSimulatedRepayments } from "@/lib/deterministic/fundingCap";
import { calculateBusinessHealthProfile } from "@/lib/deterministic/healthProfile";
import { FinancialRecord, SalesOrder, FundingOffer } from "@/lib/types";

describe("Deterministic Reconciliation Engine", () => {
  const sampleOrders: SalesOrder[] = [
    {
      id: "ord_101",
      businessId: "biz_stationery",
      orderNumber: "INV-101",
      date: "2026-10-01",
      time: "10:30",
      channel: "upi",
      totalPaise: 45000, // ₹450.00
      taxPaise: 2250,
      status: "completed",
      linesCount: 2,
    },
    {
      id: "ord_102",
      businessId: "biz_stationery",
      orderNumber: "INV-102",
      date: "2026-10-01",
      time: "11:15",
      channel: "counter_cash",
      totalPaise: 12000, // ₹120.00
      taxPaise: 600,
      status: "completed",
      linesCount: 1,
    },
  ];

  const sampleSettlements: FinancialRecord[] = [
    {
      id: "set_201",
      businessId: "biz_stationery",
      dataSourceId: "ds_bank",
      type: "settlement",
      amountPaise: 45000,
      rawAmount: 450.0,
      date: "2026-10-01",
      referenceNumber: "UPI-ICICI-88219",
      status: "verified",
      confidence: 100,
    },
    {
      id: "set_202",
      businessId: "biz_stationery",
      dataSourceId: "ds_bank",
      type: "settlement",
      amountPaise: 99999, // Unmatched
      rawAmount: 999.99,
      date: "2026-10-02",
      referenceNumber: "UPI-ICICI-99999",
      status: "unmatched",
      confidence: 50,
    },
    {
      id: "set_203_dupe",
      businessId: "biz_stationery",
      dataSourceId: "ds_bank",
      type: "settlement",
      amountPaise: 45000,
      rawAmount: 450.0,
      date: "2026-10-01",
      referenceNumber: "UPI-ICICI-88219", // Duplicate reference
      status: "verified",
      confidence: 100,
    },
  ];

  it("detects duplicate financial records conservatively by reference number", () => {
    const { duplicates, uniqueRecords } = detectDuplicates(sampleSettlements);
    expect(duplicates.length).toBe(1);
    expect(duplicates[0].id).toBe("set_203_dupe");
    expect(uniqueRecords.length).toBe(2);
  });

  it("matches orders to settlements within tolerance and sends unmatched to exception queue", () => {
    const result = reconcileSettlements(sampleSettlements, sampleOrders, { tolerancePaise: 100 });
    expect(result.matches.length).toBe(1);
    expect(result.matches[0].settlementRecordId).toBe("set_201");
    expect(result.matches[0].salesOrderIds).toEqual(["ord_101"]);
    expect(result.unmatchedSettlements.length).toBe(1);
    expect(result.unmatchedSettlements[0].id).toBe("set_202");
  });
});

describe("Deterministic Funding Cap & Revenue Share", () => {
  const mockOffer: FundingOffer = {
    id: "offer_101",
    businessId: "biz_stationery",
    funderName: "Simulated Community Micro-Fund",
    offerAmountPaise: 10000000, // ₹1,00,000
    revenueSharePercent: 10,     // 10%
    repaymentCapMultiplier: 1.15,
    totalCapPaise: 11500000,    // ₹1,15,000 cap
    estimatedTermMonths: 6,
    eligibleRevenueDefinition: "Gross verified sales minus refunds and disputes",
    feePaise: 0,
    status: "simulated_active",
  };

  it("calculates exact daily repayment from eligible revenue in paise", () => {
    const history = [
      { date: "2026-10-01", grossSalesPaise: 1000000, refundsPaise: 100000 }, // Eligible = 9,00,000 paise (₹9,000)
    ];
    const res = calculateSimulatedRepayments(mockOffer, history, 0);
    expect(res.ledgerEntries[0].repaymentDuePaise).toBe(90000); // 10% of 9,00,000 = 90,000 paise (₹900)
    expect(res.remainingCapPaise).toBe(11500000 - 90000);
  });

  it("strictly stops repayments when total cap is hit without overcharging", () => {
    // Current repaid is ₹1,14,500 (50000 paise short of ₹1,15,000 cap)
    const almostDone = 11450000;
    const history = [
      { date: "2026-10-02", grossSalesPaise: 2000000 }, // 10% would be 200000 paise
    ];
    const res = calculateSimulatedRepayments(mockOffer, history, almostDone);
    expect(res.capReached).toBe(true);
    // Repayment due must be capped at exactly 50000 paise (the remaining cap), NOT 200000!
    expect(res.ledgerEntries[0].repaymentDuePaise).toBe(50000);
    expect(res.totalRepaidPaise).toBe(11500000);
    expect(res.remainingCapPaise).toBe(0);
  });

  it("handles zero-sales days gracefully with 0 due and no default", () => {
    const history = [{ date: "2026-10-03", grossSalesPaise: 0 }];
    const res = calculateSimulatedRepayments(mockOffer, history, 1000000);
    expect(res.ledgerEntries[0].repaymentDuePaise).toBe(0);
    expect(res.ledgerEntries[0].status).toBe("zero_sales");
  });
});

describe("Deterministic Business Health Profile", () => {
  it("calculates health score 0-100 with explainable component breakdown", () => {
    const assessment = calculateBusinessHealthProfile({
      businessId: "biz_stationery",
      dailySalesPaise: [500000, 520000, 480000, 510000, 490000, 530000, 500000],
      monthlyExpensesPaise: 6000000,
      totalGrossSalesPaise: 15000000,
      totalReconciledSalesPaise: 14000000,
      grossMarginPercent: 42,
      missingDataPointsCount: 0,
    });

    expect(assessment.overallScore).toBeGreaterThanOrEqual(0);
    expect(assessment.overallScore).toBeLessThanOrEqual(100);
    expect(assessment.confidence).toBe("high");
    expect(assessment.formulaVersion).toBe("BHP-v2.0-deterministic");
    expect(assessment.disclaimer).toContain("Not a credit-bureau score");
  });

  it("marks confidence as low or insufficient when data points are missing, without rejecting", () => {
    const assessment = calculateBusinessHealthProfile({
      businessId: "biz_icecream",
      dailySalesPaise: [200000],
      monthlyExpensesPaise: 3000000,
      totalGrossSalesPaise: 5000000,
      totalReconciledSalesPaise: 2000000,
      grossMarginPercent: 30,
      missingDataPointsCount: 4, // 4 missing data sources
    });

    expect(assessment.confidence).toBe("insufficient");
    expect(assessment.coveragePercent).toBe(45);
  });
});
