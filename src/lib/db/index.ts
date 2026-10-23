/**
 * In-Memory & File-Compatible Relational Data Store
 * Enforces Tenant Isolation, Seed Data, Audit Logging, and Mutation Handlers
 */

import { INITIAL_DEMO_DATA, DemoDatabase } from "@/lib/seed/data";
import {
  Business,
  Product,
  SalesOrder,
  FinancialRecord,
  Expense,
  MetricSnapshot,
  HealthAssessment,
  AIRecommendation,
  Experiment,
  LocationCandidate,
  PublicProfileSettings,
  FundingOffer,
  LedgerEntry,
  CustomerReview,
  ReviewTheme,
  DataSource,
  AuditEvent,
  BorrowingListing,
  InvestorCommitment,
} from "@/lib/types";

// Clone initial seed data for runtime modifications
function cloneSeedData(): DemoDatabase {
  return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
}

let dbInstance: DemoDatabase = cloneSeedData();

let initialListings: BorrowingListing[] = [
  {
    id: "list_stat_01",
    businessId: "biz_stationery",
    businessName: "Vidya Stationery & Xerox",
    businessCategory: "Stationery & Document Centre",
    city: "Pune",
    amountRequestedPaise: 15000000, // ₹1,50,000
    useOfFunds: "Purchase high-speed dual Xerox machine & pre-order bulk JK Copier paper for university semester finals",
    offeredRevenueSharePercent: 6.5,
    estimatedTermMonths: 6,
    expectedMonthlyProfitPaise: 3800000, // +₹38,000 / mo
    status: "open",
    createdAt: "2026-10-21T10:00:00Z",
    healthScore: 84,
    grossSales30dPaise: 51630000, // ₹5,16,300
    netCashFlow30dPaise: 17230000, // ₹1,72,300
    rating: 4.8,
    commitmentsCount: 1,
    fundedAmountPaise: 5000000, // ₹50,000 already committed
  },
  {
    id: "list_ice_01",
    businessId: "biz_icecream",
    businessName: "Scoops & Swirls Cold Treat",
    businessCategory: "Artisanal Ice Cream",
    city: "Bengaluru",
    amountRequestedPaise: 20000000, // ₹2,00,000
    useOfFunds: "Energy-efficient deep freezer upgrade to reduce electricity tariffs by 35% & introduce late-night sundaes",
    offeredRevenueSharePercent: 7.5,
    estimatedTermMonths: 7,
    expectedMonthlyProfitPaise: 4200000,
    status: "open",
    createdAt: "2026-10-22T14:30:00Z",
    healthScore: 71,
    grossSales30dPaise: 51180000,
    netCashFlow30dPaise: 12530000,
    rating: 4.6,
    commitmentsCount: 0,
    fundedAmountPaise: 0,
  },
  {
    id: "list_cafe_01",
    businessId: "biz_cafe",
    businessName: "Chai & Chutney All-Day Café",
    businessCategory: "Quick-Service Café",
    city: "New Delhi",
    amountRequestedPaise: 25000000, // ₹2,50,000
    useOfFunds: "Dedicated Express Morning Pickup Counter equipment & automated tea brewing station",
    offeredRevenueSharePercent: 8.0,
    estimatedTermMonths: 8,
    expectedMonthlyProfitPaise: 5500000,
    status: "open",
    createdAt: "2026-10-20T11:00:00Z",
    healthScore: 88,
    grossSales30dPaise: 72030000,
    netCashFlow30dPaise: 23200000,
    rating: 4.9,
    commitmentsCount: 2,
    fundedAmountPaise: 18000000,
  },
];

let borrowingListingsStore: BorrowingListing[] = JSON.parse(JSON.stringify(initialListings));

let initialCommitments: InvestorCommitment[] = [
  {
    id: "cmt_seed_1",
    listingId: "list_stat_01",
    businessId: "biz_stationery",
    businessName: "Vidya Stationery & Xerox",
    businessCategory: "Stationery & Document Centre",
    city: "Pune",
    funderName: "Kunal Shah (Growth Syndicate)",
    investedAmountPaise: 5000000, // ₹50,000
    revenueSharePercent: 6.5,
    repaymentCapMultiplier: 1.15,
    totalReturnCapPaise: 5750000, // ₹57,500 total return cap
    committedAt: "2026-10-21T11:30:00Z",
    monthlySalesPaise: 51630000,
    estimatedDailyPayoutPaise: 111865, // ~₹1,119 / day
    estimatedPaybackDays: 52, // 52 days to full cap
    recoveryProbability: "96% High Confidence",
    riskRating: "Low Risk",
    repaidSoFarPaise: 1420000, // ₹14,200 repaid so far
    status: "recovering",
  },
  {
    id: "cmt_seed_2",
    listingId: "list_cafe_01",
    businessId: "biz_cafe",
    businessName: "Chai & Chutney All-Day Café",
    businessCategory: "Quick-Service Café",
    city: "New Delhi",
    funderName: "Kunal Shah (Growth Syndicate)",
    investedAmountPaise: 18000000, // ₹1,80,000
    revenueSharePercent: 8.0,
    repaymentCapMultiplier: 1.15,
    totalReturnCapPaise: 20700000, // ₹2,07,000 total return cap
    committedAt: "2026-10-20T12:00:00Z",
    monthlySalesPaise: 72030000,
    estimatedDailyPayoutPaise: 192080, // ~₹1,921 / day
    estimatedPaybackDays: 108,
    recoveryProbability: "98% High Confidence",
    riskRating: "Low Risk",
    repaidSoFarPaise: 5200000, // ₹52,000 repaid so far
    status: "recovering",
  },
];

let investorCommitmentsStore: InvestorCommitment[] = JSON.parse(JSON.stringify(initialCommitments));
let auditLogs: AuditEvent[] = [
  {
    id: "aud_01",
    businessId: "biz_stationery",
    userId: "usr_owner_1",
    userName: "Ramesh Sharma (Owner)",
    eventType: "RECONCILIATION",
    action: "Matched UPI settlement #994812 to Order #ORD-2026-101",
    details: "Deterministic Matcher matched 45000 paise with 0 fee variance",
    timestamp: "2026-10-21T09:30:00Z",
  },
  {
    id: "aud_02",
    businessId: "biz_stationery",
    userId: "usr_owner_1",
    userName: "Ramesh Sharma (Owner)",
    eventType: "EXPERIMENT_APPROVED",
    action: "Approved Recommendation #rec_stat_g2",
    details: "Promoted to active Experiment #exp_stat_run1 with budget ₹0",
    timestamp: "2026-10-22T10:00:00Z",
  },
];

export const db = {
  // Reset demo data to clean synthetic baseline
  reset: () => {
    dbInstance = cloneSeedData();
    auditLogs = [];
    borrowingListingsStore = JSON.parse(JSON.stringify(initialListings));
    investorCommitmentsStore = JSON.parse(JSON.stringify(initialCommitments));
    return true;
  },

  // Audit Logs
  getAuditLogs: (businessId?: string): AuditEvent[] => {
    if (!businessId) return auditLogs;
    return auditLogs.filter((a) => a.businessId === businessId);
  },

  logAudit: (event: Omit<AuditEvent, "id" | "timestamp">) => {
    const entry: AuditEvent = {
      ...event,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    auditLogs.unshift(entry);
    return entry;
  },

  // Businesses
  getBusinesses: (): Business[] => {
    return dbInstance.businesses;
  },

  getBusinessById: (businessId: string): Business | undefined => {
    return dbInstance.businesses.find((b) => b.id === businessId);
  },

  getBusinessBySlug: (slug: string): Business | undefined => {
    return dbInstance.businesses.find((b) => b.slug === slug);
  },

  // Products
  getProducts: (businessId: string): Product[] => {
    return dbInstance.products[businessId] || [];
  },

  // Orders
  getOrders: (businessId: string): SalesOrder[] => {
    return dbInstance.orders[businessId] || [];
  },

  // Data Sources
  getDataSources: (businessId: string): DataSource[] => {
    return dbInstance.dataSources[businessId] || [];
  },

  addDataSource: (businessId: string, source: DataSource) => {
    if (!dbInstance.dataSources[businessId]) dbInstance.dataSources[businessId] = [];
    dbInstance.dataSources[businessId].unshift(source);
    return source;
  },

  // Financial Records
  getFinancialRecords: (businessId: string): FinancialRecord[] => {
    return dbInstance.financialRecords[businessId] || [];
  },

  addFinancialRecord: (businessId: string, record: FinancialRecord) => {
    if (!dbInstance.financialRecords[businessId]) dbInstance.financialRecords[businessId] = [];
    dbInstance.financialRecords[businessId].unshift(record);
    return record;
  },

  updateFinancialRecord: (businessId: string, recordId: string, updates: Partial<FinancialRecord>) => {
    const records = dbInstance.financialRecords[businessId] || [];
    const idx = records.findIndex((r) => r.id === recordId);
    if (idx !== -1) {
      records[idx] = { ...records[idx], ...updates };
      return records[idx];
    }
    return null;
  },

  // Expenses
  getExpenses: (businessId: string): Expense[] => {
    return dbInstance.expenses[businessId] || [];
  },

  // Metrics
  getMetrics: (businessId: string): MetricSnapshot[] => {
    return dbInstance.metrics[businessId] || [];
  },

  // Business Health Assessment
  getHealthAssessment: (businessId: string): HealthAssessment | undefined => {
    return dbInstance.healthAssessments[businessId];
  },

  // AI Recommendations
  getRecommendations: (businessId: string): AIRecommendation[] => {
    return dbInstance.recommendations[businessId] || [];
  },

  updateRecommendationStatus: (
    businessId: string,
    recId: string,
    status: AIRecommendation["status"],
    actionUpdates?: Partial<AIRecommendation>
  ): AIRecommendation | null => {
    const recs = dbInstance.recommendations[businessId] || [];
    const rec = recs.find((r) => r.id === recId);
    if (!rec) return null;

    rec.status = status;
    if (actionUpdates) {
      Object.assign(rec, actionUpdates);
    }
    if (status === "approved") {
      rec.approvedAt = new Date().toISOString();
      // If not already an experiment, promote it
      if (!rec.experimentId) {
        const expId = `exp_${rec.id}_${Date.now()}`;
        rec.experimentId = expId;
        const newExp: Experiment = {
          id: expId,
          businessId,
          recommendationId: rec.id,
          title: rec.title,
          hypothesis: rec.explanation,
          stage: "running",
          baselineMetric: rec.successMetric,
          baselineValue: 100,
          targetValue: 120,
          currentValue: 105,
          unit: "pts",
          budgetCapPaise: rec.estimatedCostPaise,
          spentPaise: 0,
          startDate: new Date().toISOString().split("T")[0],
          timeline: [
            { date: new Date().toISOString().split("T")[0], value: 100 },
          ],
        };
        if (!dbInstance.experiments[businessId]) dbInstance.experiments[businessId] = [];
        dbInstance.experiments[businessId].unshift(newExp);
      }
    }
    return rec;
  },

  // Experiments
  getExperiments: (businessId: string): Experiment[] => {
    return dbInstance.experiments[businessId] || [];
  },

  updateExperimentStage: (
    businessId: string,
    expId: string,
    stage: Experiment["stage"],
    decision?: Experiment["decision"]
  ): Experiment | null => {
    const exps = dbInstance.experiments[businessId] || [];
    const exp = exps.find((e) => e.id === expId);
    if (!exp) return null;
    exp.stage = stage;
    if (decision) exp.decision = decision;
    return exp;
  },

  // Locations
  getLocations: (businessId: string): LocationCandidate[] => {
    return dbInstance.locations[businessId] || [];
  },

  addLocation: (businessId: string, location: LocationCandidate): LocationCandidate => {
    if (!dbInstance.locations[businessId]) {
      dbInstance.locations[businessId] = [];
    }
    dbInstance.locations[businessId].unshift(location);
    return location;
  },

  toggleLocationChecklistItem: (businessId: string, locationId: string, checkId: string): boolean => {
    const locs = dbInstance.locations[businessId] || [];
    const loc = locs.find((l) => l.id === locationId);
    if (!loc) return false;
    const item = loc.fieldVisitChecklist.find((c) => c.id === checkId);
    if (!item) return false;
    item.done = !item.done;
    return item.done;
  },

  // Public Profile
  getPublicProfile: (businessId: string): PublicProfileSettings | undefined => {
    return dbInstance.publicProfiles[businessId];
  },

  updatePublicProfile: (businessId: string, updates: Partial<PublicProfileSettings>): PublicProfileSettings | null => {
    const profile = dbInstance.publicProfiles[businessId];
    if (!profile) return null;
    Object.assign(profile, updates);
    return profile;
  },

  // Funding Offers & Ledger
  getFundingOffers: (businessId: string): FundingOffer[] => {
    return dbInstance.fundingOffers[businessId] || [];
  },

  getLedgerEntries: (businessId: string): LedgerEntry[] => {
    return dbInstance.ledgerEntries[businessId] || [];
  },

  acceptFundingOffer: (businessId: string, offerId: string): FundingOffer | null => {
    const offers = dbInstance.fundingOffers[businessId] || [];
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return null;
    offer.status = "simulated_active";
    offer.acceptedAt = new Date().toISOString();
    return offer;
  },

  // Borrowing Marketplace & Investor Panel
  getBorrowingListings: (): BorrowingListing[] => {
    return borrowingListingsStore;
  },

  getBorrowingListingByBusinessId: (businessId: string): BorrowingListing | undefined => {
    return borrowingListingsStore.find((l) => l.businessId === businessId);
  },

  createBorrowingListing: (listing: BorrowingListing): BorrowingListing => {
    // Replace if exists for same business or unshift
    const idx = borrowingListingsStore.findIndex((l) => l.businessId === listing.businessId);
    if (idx !== -1) {
      borrowingListingsStore[idx] = listing;
    } else {
      borrowingListingsStore.unshift(listing);
    }
    return listing;
  },

  commitInvestment: (
    listingId: string,
    offer: { funderName: string; amountPaise: number; revenueSharePercent: number }
  ): { success: boolean; listing: BorrowingListing; offer: FundingOffer; commitment: InvestorCommitment } | null => {
    const listing = borrowingListingsStore.find((l) => l.id === listingId);
    if (!listing) return null;

    listing.fundedAmountPaise = (listing.fundedAmountPaise || 0) + offer.amountPaise;
    listing.commitmentsCount = (listing.commitmentsCount || 0) + 1;
    if (listing.fundedAmountPaise >= listing.amountRequestedPaise) {
      listing.status = "funded";
    }

    const totalCapPaise = Math.round(offer.amountPaise * 1.15);
    const monthlySales = listing.grossSales30dPaise || 50000000;
    const dailyAvgSales = Math.round(monthlySales / 30);
    const dailyPayoutPaise = Math.round(dailyAvgSales * (offer.revenueSharePercent / 100));
    const paybackDays = dailyPayoutPaise > 0 ? Math.ceil(totalCapPaise / dailyPayoutPaise) : 90;

    // Create a corresponding FundingOffer
    const newOffer: FundingOffer = {
      id: `off_mkt_${Date.now()}`,
      businessId: listing.businessId,
      funderName: offer.funderName || "Verified Syndicate Investor (SIMULATED)",
      offerAmountPaise: offer.amountPaise,
      revenueSharePercent: offer.revenueSharePercent,
      repaymentCapMultiplier: 1.15,
      totalCapPaise,
      estimatedTermMonths: listing.estimatedTermMonths,
      eligibleRevenueDefinition: "Reconciled gross sales from verified POS & UPI QR credits, minus documented refunds.",
      feePaise: 0,
      status: "simulated_active",
      acceptedAt: new Date().toISOString(),
    };

    if (!dbInstance.fundingOffers[listing.businessId]) {
      dbInstance.fundingOffers[listing.businessId] = [];
    }
    dbInstance.fundingOffers[listing.businessId].unshift(newOffer);

    // Create Investor Commitment
    const newCommitment: InvestorCommitment = {
      id: `cmt_${Date.now()}`,
      listingId: listing.id,
      businessId: listing.businessId,
      businessName: listing.businessName,
      businessCategory: listing.businessCategory,
      city: listing.city,
      funderName: offer.funderName || "Kunal Shah (Growth Syndicate)",
      investedAmountPaise: offer.amountPaise,
      revenueSharePercent: offer.revenueSharePercent,
      repaymentCapMultiplier: 1.15,
      totalReturnCapPaise: totalCapPaise,
      committedAt: new Date().toISOString(),
      monthlySalesPaise: monthlySales,
      estimatedDailyPayoutPaise: dailyPayoutPaise,
      estimatedPaybackDays: paybackDays,
      recoveryProbability: listing.healthScore >= 80 ? "96% Very High" : listing.healthScore >= 70 ? "92% Strong" : "84% Moderate",
      riskRating: listing.healthScore >= 80 ? "Low Risk" : listing.healthScore >= 70 ? "Moderate Risk" : "Higher Yield",
      repaidSoFarPaise: 0,
      status: "active",
    };
    investorCommitmentsStore.unshift(newCommitment);

    return { success: true, listing, offer: newOffer, commitment: newCommitment };
  },

  getInvestorCommitments: (): InvestorCommitment[] => {
    return investorCommitmentsStore;
  },

  getInvestorCommitmentsByBusiness: (businessId: string): InvestorCommitment[] => {
    return investorCommitmentsStore.filter((c) => c.businessId === businessId);
  },

  // Reviews & Themes
  getReviews: (businessId: string): CustomerReview[] => {
    return dbInstance.reviews[businessId] || [];
  },

  getReviewThemes: (businessId: string): ReviewTheme[] => {
    return dbInstance.reviewThemes[businessId] || [];
  },

  submitReviewReply: (businessId: string, reviewId: string, replyText: string): CustomerReview | null => {
    const reviews = dbInstance.reviews[businessId] || [];
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return null;
    review.ownerResponse = replyText;
    review.responseStatus = "replied";
    return review;
  },
};
