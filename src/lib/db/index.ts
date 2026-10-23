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
} from "@/lib/types";

// Clone initial seed data for runtime modifications
function cloneSeedData(): DemoDatabase {
  return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
}

let dbInstance: DemoDatabase = cloneSeedData();
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
