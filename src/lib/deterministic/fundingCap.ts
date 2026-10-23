/**
 * Pure Deterministic Revenue-Share Repayment & Cap Engine
 * Strictly SIMULATED for Hackathon MVP
 *
 * Rules:
 * 1. Eligible Revenue = Reconciled Gross Sales - Verified Refunds - Disputed Transactions.
 * 2. Daily Due = Math.round(Eligible Revenue * (revenueSharePercent / 100)).
 * 3. Repayment stops EXACTLY when cumulativeRepaid reaches totalCapPaise.
 * 4. Zero-sales handling: when sales = 0, repayment due = 0 (no default, terms extend).
 * 5. All arithmetic in integer minor units (paise). No binary float drift.
 */

import { LedgerEntry, FundingOffer } from "@/lib/types";

export interface DailySalesInput {
  date: string;
  grossSalesPaise: number;
  refundsPaise?: number;
  disputedPaise?: number;
}

export interface RepaymentCalculationResult {
  ledgerEntries: LedgerEntry[];
  totalRepaidPaise: number;
  remainingCapPaise: number;
  capReached: boolean;
  capReachedDate?: string;
  totalEligibleRevenuePaise: number;
}

/**
 * Calculates deterministic simulated repayment ledger from sales history
 */
export function calculateSimulatedRepayments(
  offer: FundingOffer,
  salesHistory: DailySalesInput[],
  startingCumulativeRepaidPaise = 0
): RepaymentCalculationResult {
  const entries: LedgerEntry[] = [];
  let cumulativeRepaid = startingCumulativeRepaidPaise;
  const totalCap = offer.totalCapPaise;
  let capReached = cumulativeRepaid >= totalCap;
  let capReachedDate: string | undefined = undefined;
  let totalEligibleRevenue = 0;

  for (const day of salesHistory) {
    const refunds = Math.max(0, day.refundsPaise || 0);
    const disputes = Math.max(0, day.disputedPaise || 0);

    // Eligible revenue excludes refunds and disputed charges
    const eligibleRevenue = Math.max(0, day.grossSalesPaise - refunds - disputes);
    totalEligibleRevenue += eligibleRevenue;

    if (capReached) {
      // Cap already hit in a previous entry
      entries.push({
        id: `ledger_${offer.id}_${day.date}`,
        businessId: offer.businessId,
        offerId: offer.id,
        date: day.date,
        grossSalesPaise: day.grossSalesPaise,
        eligibleRevenuePaise: eligibleRevenue,
        sharePercent: offer.revenueSharePercent,
        repaymentDuePaise: 0,
        cumulativeRepaidPaise: totalCap,
        remainingCapPaise: 0,
        status: "reconciled",
      });
      continue;
    }

    if (eligibleRevenue === 0) {
      // Zero-sales day: zero payment due
      entries.push({
        id: `ledger_${offer.id}_${day.date}`,
        businessId: offer.businessId,
        offerId: offer.id,
        date: day.date,
        grossSalesPaise: day.grossSalesPaise,
        eligibleRevenuePaise: 0,
        sharePercent: offer.revenueSharePercent,
        repaymentDuePaise: 0,
        cumulativeRepaidPaise: cumulativeRepaid,
        remainingCapPaise: totalCap - cumulativeRepaid,
        status: "zero_sales",
      });
      continue;
    }

    // Normal calculation: percentage of eligible revenue
    const rawDue = Math.round((eligibleRevenue * offer.revenueSharePercent) / 100);
    const remainingBeforeThisDay = totalCap - cumulativeRepaid;

    // Cap constraint: cannot exceed remaining cap
    const actualDue = Math.min(rawDue, remainingBeforeThisDay);
    cumulativeRepaid += actualDue;

    if (cumulativeRepaid >= totalCap) {
      capReached = true;
      capReachedDate = day.date;
    }

    entries.push({
      id: `ledger_${offer.id}_${day.date}`,
      businessId: offer.businessId,
      offerId: offer.id,
      date: day.date,
      grossSalesPaise: day.grossSalesPaise,
      eligibleRevenuePaise: eligibleRevenue,
      sharePercent: offer.revenueSharePercent,
      repaymentDuePaise: actualDue,
      cumulativeRepaidPaise: cumulativeRepaid,
      remainingCapPaise: Math.max(0, totalCap - cumulativeRepaid),
      status: "reconciled",
    });
  }

  return {
    ledgerEntries: entries,
    totalRepaidPaise: cumulativeRepaid,
    remainingCapPaise: Math.max(0, totalCap - cumulativeRepaid),
    capReached,
    capReachedDate,
    totalEligibleRevenuePaise: totalEligibleRevenue,
  };
}
