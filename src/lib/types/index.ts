/**
 * Central AI Micro-Business Operating System
 * Core Data Models & TypeScript Definitions (All 22 Entities)
 */

export type UserRole = "owner" | "staff" | "funder" | "admin" | "visitor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId: string;
  avatarUrl?: string;
}

export type BusinessCategory = "stationery" | "ice_cream" | "cafe" | "retail" | "salon" | "food_stall";

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: BusinessCategory;
  categoryLabel: string;
  tagline: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  foundedYear: number;
  description: string;
  isSyntheticDemo: boolean;
  currency: string;
}

export type ConsentSource = "pos" | "bank" | "upi" | "gst";
export type ConsentPurpose = "analytics" | "reconciliation" | "funding_review";

export interface ConsentRecord {
  id: string;
  businessId: string;
  source: ConsentSource;
  purpose: ConsentPurpose;
  granted: boolean;
  grantedAt?: string;
  revokedAt?: string;
}

export type DataSourceType = "csv" | "xlsx" | "pdf" | "api";
export type DataSourceStatus = "ready" | "needs_review" | "failed" | "processing";

export interface DataSource {
  id: string;
  businessId: string;
  name: string;
  type: DataSourceType;
  status: DataSourceStatus;
  confidence: number; // 0 to 100
  periodStart: string;
  periodEnd: string;
  recordCount: number;
  fileName: string;
  fileSizeKb: number;
  uploadedAt: string;
  validationErrors?: string[];
  uncertainCount?: number;
}

export type FinancialRecordType = 
  | "bill" 
  | "settlement" 
  | "expense" 
  | "bank_credit" 
  | "bank_debit" 
  | "transfer" 
  | "refund";

export type FinancialRecordStatus = 
  | "verified" 
  | "unmatched" 
  | "uncertain" 
  | "duplicate" 
  | "matched";

export interface FinancialRecord {
  id: string;
  businessId: string;
  dataSourceId: string;
  type: FinancialRecordType;
  amountPaise: number; // Integer minor units
  rawAmount: number;
  date: string;
  referenceNumber: string;
  counterparty?: string;
  channel?: "cash" | "upi" | "card" | "aggregator_swiggy" | "aggregator_zomato" | "bank_transfer";
  status: FinancialRecordStatus;
  confidence: number;
  uncertainFields?: string[];
  note?: string;
  isDuplicate?: boolean;
}

export interface SalesOrder {
  id: string;
  businessId: string;
  orderNumber: string;
  date: string;
  time: string;
  channel: "counter_cash" | "upi" | "card" | "swiggy" | "zomato" | "bank_transfer";
  totalPaise: number;
  taxPaise: number;
  status: "completed" | "refunded" | "cancelled";
  customerType?: "student" | "regular" | "walk_in" | "corporate";
  linesCount: number;
}

export interface SalesLine {
  id: string;
  orderId: string;
  businessId: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPricePaise: number;
  totalPaise: number;
  estimatedCostPaise: number;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  category: string;
  sku: string;
  sellingPricePaise: number;
  costPricePaise: number;
  marginPercent: number;
  stockUnits: number;
  reorderPoint: number;
  isHero: boolean;
  unitsSold30d: number;
  revenue30dPaise: number;
}

export type ExpenseCategory = 
  | "rent" 
  | "electricity" 
  | "raw_materials" 
  | "staff" 
  | "packaging" 
  | "marketing" 
  | "maintenance" 
  | "other";

export interface Expense {
  id: string;
  businessId: string;
  category: ExpenseCategory;
  description: string;
  amountPaise: number;
  date: string;
  isRecurring: boolean;
  vendor: string;
}

export interface InventorySnapshot {
  id: string;
  businessId: string;
  date: string;
  totalValuePaise: number;
  stockoutItemsCount: number;
  wastageValuePaise: number;
  notes?: string;
}

export interface ReconciliationMatch {
  id: string;
  businessId: string;
  settlementRecordId: string;
  salesOrderIds: string[];
  settlementAmountPaise: number;
  matchedSalesAmountPaise: number;
  differencePaise: number;
  feeDeductedPaise: number;
  status: "matched" | "unmatched" | "disputed" | "split";
  matchConfidence: number;
  reconciledAt?: string;
  reconciledBy?: string;
  notes?: string;
}

export type MetricConfidence = "high" | "medium" | "low" | "insufficient";
export type EvidenceTagType = "fact" | "estimate" | "hypothesis";

export interface MetricSnapshot {
  id: string;
  businessId: string;
  period: string;
  metricCode: string;
  name: string;
  value: number; // For money: paise; for count: integer; for %: float
  unit: "paise" | "count" | "percent" | "ratio";
  previousValue: number;
  changePercent: number;
  formula: string;
  sourceCoveragePercent: number;
  confidence: MetricConfidence;
  tagType: EvidenceTagType;
  dataSourceIds: string[];
  definition: string;
  sparklineData?: number[];
}

export interface HealthAssessment {
  id: string;
  businessId: string;
  evaluatedAt: string;
  overallScore: number; // 0-100
  revenueConsistencyScore: number;
  cashFlowHealthScore: number;
  dataReliabilityScore: number;
  profitabilityScore: number;
  operatingStabilityScore: number;
  repaymentHistoryScore: number;
  growthReadinessScore: number;
  confidence: MetricConfidence;
  coveragePercent: number;
  formulaVersion: string;
  disclaimer: string;
}

export interface AIConversation {
  id: string;
  businessId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AIMessage[];
}

export interface AIMessage {
  id: string;
  conversationId: string;
  sender: "user" | "ai";
  content: string;
  evidenceIds?: string[];
  confidence?: MetricConfidence;
  unknowns?: string[];
  suggestedAction?: {
    actionText: string;
    impact: string;
    costPaise?: number;
    recommendationId?: string;
  };
  timestamp: string;
  isSampleResponse?: boolean;
}

export interface AIRecommendation {
  id: string;
  businessId: string;
  title: string;
  finding: string;
  evidenceIds: string[];
  period: string;
  explanation: string;
  action: string;
  estimatedCostPaise: number;
  expectedImpact: string;
  confidence: MetricConfidence;
  risks: string;
  successMetric: string;
  reviewDate: string;
  status: "pending" | "approved" | "declined" | "edited";
  approvedAt?: string;
  experimentId?: string;
}

export type ExperimentStage = "baseline" | "running" | "result" | "decision";

export interface Experiment {
  id: string;
  businessId: string;
  recommendationId?: string;
  title: string;
  hypothesis: string;
  stage: ExperimentStage;
  decision?: "keep" | "change" | "stop";
  baselineMetric: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  budgetCapPaise: number;
  spentPaise: number;
  startDate: string;
  endDate?: string;
  timeline: { date: string; value: number }[];
}

export interface LocationCandidate {
  id: string;
  businessId: string;
  areaName: string;
  city: string;
  distanceKm: number;
  monthlyRentPaise: number;
  estimatedCapexPaise: number;
  nearbyCollegesOffices: string;
  competitorDensity: "low" | "medium" | "high";
  accessibilityRating: number; // 1-5
  conservativeRevenuePaise: number;
  baseRevenuePaise: number;
  optimisticRevenuePaise: number;
  conservativeNetPaise: number;
  baseNetPaise: number;
  optimisticNetPaise: number;
  breakEvenMonths: number;
  fieldVisitChecklist: { id: string; task: string; done: boolean }[];
  footfallLabel: string; // Must be "Footfall: not measured"
  confidence: MetricConfidence;
}

export interface PublicProfileSettings {
  id: string;
  businessId: string;
  storyApproved: boolean;
  storyText: string;
  categoryApproved: boolean;
  locationAreaApproved: boolean;
  areaLabel: string;
  servicesApproved: boolean;
  servicesList: string[];
  metricsApproved: boolean;
  allowedMetricCodes: string[];
  reviewsApproved: boolean;
  demoOfferApproved: boolean;
  demoOfferTitle: string;
  demoOfferDetail: string;
}

export interface FundingOffer {
  id: string;
  businessId: string;
  funderName: string;
  offerAmountPaise: number;
  revenueSharePercent: number; // e.g., 6.5%
  repaymentCapMultiplier: number; // e.g. 1.15x
  totalCapPaise: number; // offerAmount * multiplier
  estimatedTermMonths: number;
  eligibleRevenueDefinition: string;
  feePaise: number;
  status: "simulated_available" | "simulated_active" | "simulated_completed";
  acceptedAt?: string;
}

export interface LedgerEntry {
  id: string;
  businessId: string;
  offerId: string;
  date: string;
  grossSalesPaise: number;
  eligibleRevenuePaise: number;
  sharePercent: number;
  repaymentDuePaise: number;
  cumulativeRepaidPaise: number;
  remainingCapPaise: number;
  status: "reconciled" | "adjusted" | "zero_sales";
}

export interface AuditEvent {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  eventType: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface IntegrationConnection {
  id: string;
  businessId: string;
  provider: "google_business" | "upi_icici" | "swiggy_pos" | "zomato_pos" | "gstn_sandbox";
  name: string;
  status: "connected" | "disconnected" | "syncing" | "error";
  lastSync: string;
  authorizedScopes: string[];
}

export interface ReviewTheme {
  id: string;
  theme: string;
  sentiment: "positive" | "negative" | "neutral";
  count: number;
  sampleQuotes: string[];
  actionRecommendation: string;
}

export interface CustomerReview {
  id: string;
  businessId: string;
  authorName: string;
  rating: number; // 1 to 5
  date: string;
  text: string;
  responseStatus: "replied" | "drafted" | "needs_reply";
  ownerResponse?: string;
  aiSuggestedResponse?: string;
}

export interface BorrowingListing {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  city: string;
  amountRequestedPaise: number;
  useOfFunds: string;
  offeredRevenueSharePercent: number; // e.g., 6.5%
  estimatedTermMonths: number;
  expectedMonthlyProfitPaise: number;
  status: "open" | "funded" | "closed";
  createdAt: string;
  healthScore: number;
  grossSales30dPaise: number;
  netCashFlow30dPaise: number;
  rating: number;
  commitmentsCount: number;
  fundedAmountPaise: number;
}

export interface InvestorCommitment {
  id: string;
  listingId: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  city: string;
  funderName: string;
  investedAmountPaise: number;
  revenueSharePercent: number;
  repaymentCapMultiplier: number; // 1.15x
  totalReturnCapPaise: number; // investedAmount * 1.15
  committedAt: string;
  monthlySalesPaise: number;
  estimatedDailyPayoutPaise: number;
  estimatedPaybackDays: number;
  recoveryProbability: string;
  riskRating: "Low Risk" | "Moderate Risk" | "Higher Yield";
  repaidSoFarPaise: number;
  status: "active" | "recovering" | "completed";
}


