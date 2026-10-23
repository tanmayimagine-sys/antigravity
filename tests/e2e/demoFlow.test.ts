import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";
import { reconcileSettlements } from "@/lib/deterministic/reconciliation";
import { calculateSimulatedRepayments } from "@/lib/deterministic/fundingCap";

describe("5-Minute Hackathon Demo Path Verification", () => {
  beforeEach(() => {
    db.reset();
  });

  it("Step 1: Inspects Vidya Stationery & Xerox dashboard metrics & health profile", () => {
    const business = db.getBusinessById("biz_stationery");
    expect(business).toBeDefined();
    expect(business?.name).toBe("Vidya Stationery & Xerox");

    const metrics = db.getMetrics("biz_stationery");
    expect(metrics.length).toBeGreaterThanOrEqual(4);
    const salesMetric = metrics.find((m) => m.metricCode === "M-201");
    expect(salesMetric).toBeDefined();
    expect(salesMetric?.value).toBe(51630000); // ₹5,16,300

    const health = db.getHealthAssessment("biz_stationery");
    expect(health).toBeDefined();
    expect(health?.overallScore).toBe(84);
    expect(health?.disclaimer).toContain("Not a credit-bureau score");
  });

  it("Step 2: Data Centre ingests messy records and flags uncertain OCR fields", () => {
    const financialRecords = db.getFinancialRecords("biz_stationery");
    const uncertain = financialRecords.filter((r) => r.status === "uncertain");
    expect(uncertain.length).toBeGreaterThan(0);
    expect(uncertain[0].uncertainFields).toContain("vendorGstin");

    // Owner corrects uncertain field in Correction Queue
    const corrected = db.updateFinancialRecord("biz_stationery", uncertain[0].id, {
      amountPaise: 4850000,
      status: "verified",
      confidence: 98,
    });
    expect(corrected?.status).toBe("verified");
    expect(corrected?.confidence).toBe(98);
  });

  it("Step 3: Reconciliation workspace detects duplicates and matches orders", () => {
    const settlements = db.getFinancialRecords("biz_stationery");
    const orders = db.getOrders("biz_stationery");

    const result = reconcileSettlements(settlements, orders);
    expect(result.duplicateRecords.length).toBeGreaterThanOrEqual(1);
    expect(result.matches.length).toBeGreaterThanOrEqual(1);
  });

  it("Step 4: Central AI references ground-truth evidence chips and warns of unknowns", () => {
    const metrics = db.getMetrics("biz_stationery");
    const salesMetric = metrics.find((m) => m.metricCode === "M-201");
    expect(salesMetric?.dataSourceIds).toContain("ds_stat_pos");
    expect(salesMetric?.confidence).toBe("high");
  });

  it("Step 5: Approves recommendation and automatically promotes it to Experiment board", () => {
    const recs = db.getRecommendations("biz_stationery");
    const targetRec = recs.find((r) => r.status === "pending");
    expect(targetRec).toBeDefined();

    const approved = db.updateRecommendationStatus(
      "biz_stationery",
      targetRec!.id,
      "approved"
    );
    expect(approved?.status).toBe("approved");
    expect(approved?.experimentId).toBeDefined();

    // Verify it exists in active experiments
    const exps = db.getExperiments("biz_stationery");
    const matchingExp = exps.find((e) => e.recommendationId === targetRec!.id);
    expect(matchingExp).toBeDefined();
    expect(matchingExp?.stage).toBe("running");
  });

  it("Step 6: Location scenarios compute unit economics and simulated funding caps properly", () => {
    const locations = db.getLocations("biz_stationery");
    expect(locations.length).toBeGreaterThan(0);
    const loc = locations[0];
    expect(loc.footfallLabel).toBe("Footfall: not measured"); // Strict compliance!

    // Simulated Funding offer and cap tracking
    const offers = db.getFundingOffers("biz_stationery");
    expect(offers.length).toBeGreaterThan(0);
    const offer = offers[0];
    expect(offer.totalCapPaise).toBe(11500000); // ₹1,15,000 cap

    const salesHistory = [
      { date: "2026-10-21", grossSalesPaise: 2000000 },
      { date: "2026-10-22", grossSalesPaise: 2200000 },
    ];
    const calc = calculateSimulatedRepayments(offer, salesHistory, 4506050);
    expect(calc.totalRepaidPaise).toBeGreaterThan(4506050);
    expect(calc.remainingCapPaise).toBe(11500000 - calc.totalRepaidPaise);
  });
});
