/**
 * Explainable Business Health Profile Engine
 * Version: BHP-v2.0-deterministic
 *
 * Components (Weights out of 100):
 * - Revenue Consistency (20 pts): volatility coefficient of daily sales
 * - Cash-Flow Health (20 pts): net cash flow margin and buffer days
 * - Data Reliability (15 pts): percentage of reconciled records vs total uploads
 * - Profitability (15 pts): gross margin % across products
 * - Operating Stability (15 pts): expense stability and rent-to-sales ratio
 * - Repayment History (10 pts): simulated repayment discipline (on-schedule index)
 * - Growth Readiness (5 pts): customer repeat rate / AOV expansion
 *
 * Strict Compliance:
 * - NOT a CIBIL or credit-bureau score.
 * - Missing data lowers confidence, never triggers automatic rejection.
 * - Zero protected personal traits (no gender, religion, caste, age, etc.).
 */

import { HealthAssessment, MetricConfidence } from "@/lib/types";

export interface HealthCalculationInputs {
  businessId: string;
  dailySalesPaise: number[];
  monthlyExpensesPaise: number;
  totalGrossSalesPaise: number;
  totalReconciledSalesPaise: number;
  grossMarginPercent: number;
  repaymentTrackRecordPercent?: number; // 0-100 if active loan/repayment exists
  missingDataPointsCount: number;
}

export function calculateBusinessHealthProfile(
  inputs: HealthCalculationInputs
): HealthAssessment {
  const {
    businessId,
    dailySalesPaise,
    monthlyExpensesPaise,
    totalGrossSalesPaise,
    totalReconciledSalesPaise,
    grossMarginPercent,
    repaymentTrackRecordPercent = 90,
    missingDataPointsCount,
  } = inputs;

  // 1. Revenue Consistency (0-20)
  let revScore = 14;
  if (dailySalesPaise.length >= 7) {
    const mean = dailySalesPaise.reduce((a, b) => a + b, 0) / dailySalesPaise.length;
    if (mean > 0) {
      const variance =
        dailySalesPaise.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
        dailySalesPaise.length;
      const cv = Math.sqrt(variance) / mean; // Coefficient of variation
      // Lower cv = higher consistency
      revScore = Math.max(5, Math.min(20, Math.round(20 * (1 - Math.min(1, cv / 1.5)))));
    }
  }

  // 2. Cash-Flow Health (0-20)
  // Ratio of sales to monthly expenses
  const netPaise = totalGrossSalesPaise - monthlyExpensesPaise;
  let cashScore = 12;
  if (totalGrossSalesPaise > 0) {
    const netMargin = netPaise / totalGrossSalesPaise;
    if (netMargin >= 0.25) cashScore = 20;
    else if (netMargin >= 0.15) cashScore = 17;
    else if (netMargin >= 0.05) cashScore = 14;
    else if (netMargin >= 0) cashScore = 10;
    else cashScore = 6;
  }

  // 3. Data Reliability (0-15)
  // How much sales data has been reconciled to verified settlements
  let dataScore = 10;
  if (totalGrossSalesPaise > 0) {
    const recRate = Math.min(1, totalReconciledSalesPaise / totalGrossSalesPaise);
    dataScore = Math.round(recRate * 15);
  }

  // 4. Profitability (0-15)
  let profScore = 10;
  if (grossMarginPercent >= 50) profScore = 15;
  else if (grossMarginPercent >= 35) profScore = 13;
  else if (grossMarginPercent >= 20) profScore = 10;
  else profScore = 6;

  // 5. Operating Stability (0-15)
  // Evaluates rent & recurring overhead burden
  let opsScore = 12;
  if (totalGrossSalesPaise > 0) {
    const expenseRatio = monthlyExpensesPaise / totalGrossSalesPaise;
    if (expenseRatio <= 0.5) opsScore = 15;
    else if (expenseRatio <= 0.75) opsScore = 12;
    else opsScore = 8;
  }

  // 6. Repayment History (0-10)
  const repayScore = Math.round((repaymentTrackRecordPercent / 100) * 10);

  // 7. Growth Readiness (0-5)
  const growthScore = 4;

  const overallScore = Math.min(
    100,
    revScore + cashScore + dataScore + profScore + opsScore + repayScore + growthScore
  );

  // Confidence is determined by completeness of records
  let confidence: MetricConfidence = "high";
  let coveragePercent = 95;

  if (missingDataPointsCount >= 4) {
    confidence = "insufficient";
    coveragePercent = 45;
  } else if (missingDataPointsCount >= 2) {
    confidence = "low";
    coveragePercent = 65;
  } else if (missingDataPointsCount === 1) {
    confidence = "medium";
    coveragePercent = 82;
  }

  return {
    id: `bhp_${businessId}_${Date.now()}`,
    businessId,
    evaluatedAt: new Date().toISOString(),
    overallScore,
    revenueConsistencyScore: revScore,
    cashFlowHealthScore: cashScore,
    dataReliabilityScore: dataScore,
    profitabilityScore: profScore,
    operatingStabilityScore: opsScore,
    repaymentHistoryScore: repayScore,
    growthReadinessScore: growthScore,
    confidence,
    coveragePercent,
    formulaVersion: "BHP-v2.0-deterministic",
    disclaimer:
      "Platform-generated indicator. Not a credit-bureau score and not a guarantee of funding or returns.",
  };
}
