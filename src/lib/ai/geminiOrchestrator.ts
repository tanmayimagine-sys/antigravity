/**
 * Live Google Gemini AI Orchestrator
 * Connects Central AI to Gemini 2.5 Flash with live business context.
 */

import { GoogleGenAI } from "@google/genai";
import { db } from "@/lib/db";
import { formatPaise } from "@/lib/formatters";

export interface OrchestratedAIResponse {
  answer: string;
  evidenceIds: string[];
  confidence: "high" | "medium" | "low";
  unknowns: string[];
  suggestedAction?: {
    title: string;
    actionText: string;
    impact: string;
    costPaise?: number;
    targetPath?: string;
  };
  isSampleResponse: boolean;
  model: string;
}

export async function askCentralAI(
  businessId: string,
  userPrompt: string
): Promise<OrchestratedAIResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  const business = db.getBusinessById(businessId) || db.getBusinesses()[0];
  const metrics = db.getMetrics(business.id);
  const health = db.getHealthAssessment(business.id);
  const products = db.getProducts(business.id);
  const expenses = db.getExpenses(business.id);
  const reviews = db.getReviews(business.id);
  const reviewThemes = db.getReviewThemes(business.id);
  const locations = db.getLocations(business.id);
  const funding = db.getFundingOffers(business.id);
  const settlements = db.getFinancialRecords(business.id);

  // If no API key configured, use schema-valid fallback
  if (!apiKey || apiKey.trim() === "") {
    return getFallbackResponse(business.id, userPrompt);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Build comprehensive, grounded business context
    const businessContextText = `
BUSINESS CONTEXT:
Name: ${business.name} (${business.categoryLabel})
Location: ${business.address}, ${business.city}, ${business.state}
Tagline: ${business.tagline}
Description: ${business.description}

DETERMINISTIC METRICS (Truth source - use these exact numbers):
${metrics
  .map(
    (m) =>
      `- [${m.metricCode}] ${m.name}: ${
        m.unit === "paise" ? formatPaise(m.value) : m.value
      } (${m.changePercent >= 0 ? "+" : ""}${m.changePercent}% vs prior period). Formula: ${m.formula}. Confidence: ${m.confidence} (${m.sourceCoveragePercent}% verified). Definition: ${m.definition}`
  )
  .join("\n")}

BUSINESS HEALTH PROFILE (BHP-v2.0):
- Overall Health Score: ${health?.overallScore || 84}/100 (${health?.confidence || "high"} confidence)
- Revenue Consistency: ${health?.revenueConsistencyScore || 18}/20
- Cash Flow Health: ${health?.cashFlowHealthScore || 17}/20
- Data Reliability: ${health?.dataReliabilityScore || 14}/15
- Profitability: ${health?.profitabilityScore || 13}/15
- Operating Stability: ${health?.operatingStabilityScore || 13}/15
- Repayment History: ${health?.repaymentHistoryScore || 5}/10

HERO PRODUCTS & MARGINS:
${products
  .map(
    (p) =>
      `- [${p.sku}] ${p.name} (${p.category}): Selling ${formatPaise(p.sellingPricePaise)}, Cost ${formatPaise(p.costPricePaise)}, Margin ${p.marginPercent.toFixed(1)}%. Sold 30d: ${p.unitsSold30d} units (Revenue: ${formatPaise(p.revenue30dPaise)}). In Stock: ${p.stockUnits} units (Reorder at: ${p.reorderPoint}). Hero: ${p.isHero}`
  )
  .join("\n")}

MONTHLY EXPENSES OVERHEAD:
${expenses
  .map(
    (e) =>
      `- ${e.category} (${e.vendor}): ${formatPaise(e.amountPaise)} - ${e.description}`
  )
  .join("\n")}

CUSTOMER REPUTATION & GOOGLE REVIEWS:
Positive Themes: ${reviewThemes.filter((t) => t.sentiment === "positive").map((t) => `${t.theme} (${t.count} mentions)`).join(", ")}
Pain Points / Bottlenecks: ${reviewThemes.filter((t) => t.sentiment === "negative").map((t) => `${t.theme} (${t.count} mentions - ${t.actionRecommendation})`).join(", ")}
Recent Reviews:
${reviews.map((r) => `- ${r.authorName} (${r.rating}★): "${r.text}" [Status: ${r.responseStatus}]`).join("\n")}

EXPANSION CANDIDATE SITES:
${locations.map((l) => `- ${l.areaName}: Rent ${formatPaise(l.monthlyRentPaise)}/mo, Capex ${formatPaise(l.estimatedCapexPaise)}, Break-even ${l.breakEvenMonths} mos, Target audience: ${l.nearbyCollegesOffices}, Footfall: ${l.footfallLabel}`).join("\n")}

RECONCILIATION & CASH FLOW:
Total Settlements: ${settlements.length} records.
Unmatched items in Exception Queue: ${settlements.filter((s) => s.status === "unmatched").length} items (NEFT Pune University examination booklet credit #4412 awaiting split clearance).
`;

    const systemPrompt = `
You are Central AI, the dedicated, trusted AI partner and financial operating system for Indian micro-businesses.
You are directly connected to the business's live data.

Your goal is to answer the owner's questions with calm, trustworthy, practical, and highly specific guidance.

CRITICAL RULES:
1. Grounding & Evidence: You must ALWAYS cite evidence codes like [M-201], [M-204], product SKUs [PRN-THS-01], or review themes. Never state a number that is not in the context.
2. Tone: Professional, encouraging, respectful of a busy shopkeeper or business owner. Clear plain English.
3. Honesty: If there are uncertainties (e.g. OCR smudges, unmeasured footfall, pending university cheque), explicitly disclose them in "unknowns".
4. Actionability: Suggest a concrete, measurable action with estimated cost in paise and expected revenue/profit impact.
5. Response Format: You MUST reply with valid JSON only, without any markdown code fence wrapping or backticks. Follow this exact JSON schema:

{
  "answer": "Clear, concise direct answer with markdown bolding and [M-XXX] style evidence chips embedded inline.",
  "evidenceIds": ["M-201", "M-204", ...],
  "confidence": "high" | "medium" | "low",
  "unknowns": ["Specific data blindspots or missing records..."],
  "suggestedAction": {
    "title": "Action title",
    "actionText": "Concrete step the owner can approve or take",
    "impact": "+₹XX,XXX expected net profit / savings / cash flow",
    "costPaise": 200000
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { text: businessContextText },
            { text: `OWNER QUESTION: ${userPrompt}` },
          ],
        },
      ],
    });

    const rawText = response.text || "";
    // Clean potential markdown json fences
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(cleanJson);
      return {
        answer: parsed.answer || cleanJson,
        evidenceIds: Array.isArray(parsed.evidenceIds) && parsed.evidenceIds.length > 0 ? parsed.evidenceIds : ["M-201", "M-204"],
        confidence: parsed.confidence || "high",
        unknowns: Array.isArray(parsed.unknowns) ? parsed.unknowns : [],
        suggestedAction: parsed.suggestedAction || undefined,
        isSampleResponse: false,
        model: "Gemini 2.5 Flash (Live)",
      };
    } catch {
      // If parsing failed, return raw response cleanly
      return {
        answer: rawText,
        evidenceIds: ["M-201", "M-204"],
        confidence: "high",
        unknowns: ["Unstructured AI output format"],
        isSampleResponse: false,
        model: "Gemini 2.5 Flash (Live)",
      };
    }
  } catch (err: unknown) {
    console.error("Gemini Live API Error, falling back to schema-valid response:", (err as Error).message);
    return getFallbackResponse(businessId, userPrompt);
  }
}

function getFallbackResponse(businessId: string, query: string): OrchestratedAIResponse {
  const q = query.toLowerCase();

  if (q.includes("drop") || q.includes("dip") || q.includes("september") || q.includes("fall")) {
    return {
      answer: "Verified sales dipped 9.9% in late September [M-201] due to the post-admission semester lull. However, Xerox gross margin remained very resilient at 70% [M-204], while high-volume paper ream stock was depleted.",
      evidenceIds: ["M-201", "M-204", "prod_stat_5"],
      confidence: "high",
      unknowns: [
        "External college timetable adjustments not captured in POS data.",
        "Cash walk-in receipts without itemized customer bills.",
      ],
      suggestedAction: {
        title: "Pre-Order Exam Paper Reams",
        actionText: "Restock 120 boxes of JK Copier 75GSM before exam weeks to capture high-margin photocopy volume.",
        impact: "+₹28,000 net profit during upcoming mid-term submissions",
        costPaise: 450000,
        targetPath: "/experiments",
      },
      isSampleResponse: true,
      model: "Offline Fallback Schema",
    };
  }

  if (q.includes("promote") || q.includes("product") || q.includes("exam")) {
    return {
      answer: "Your top-performing product by margin is Thesis Printing & Hard Binding (60% margin, ₹450 price [prod_stat_1]). Engineering Drawing Sheets [prod_stat_3] are also in heavy demand but have dipped below reorder threshold (65 units left).",
      evidenceIds: ["prod_stat_1", "prod_stat_3", "M-203"],
      confidence: "high",
      unknowns: ["Competitor binding pricing across FC Road."],
      suggestedAction: {
        title: "Launch Student Mid-Term Exam Bundle",
        actionText: "Bundle 1x Folder + 2x Notebooks + 50 Xerox vouchers at ₹480 (saving students ₹80).",
        impact: "+₹24,000 cash flow in 14 days",
        costPaise: 200000,
        targetPath: "/experiments",
      },
      isSampleResponse: true,
      model: "Offline Fallback Schema",
    };
  }

  return {
    answer: `Your Business Health Profile is evaluated at **84/100 (High Confidence)**. Your net operating cash flow stands at ${formatPaise(17230000)} [M-204], comfortably covering your simulated revenue-share repayment obligations.`,
    evidenceIds: ["M-204", "M-201"],
    confidence: "high",
    unknowns: ["Unreconciled bulk college cheque #4412 awaiting split clearance."],
    suggestedAction: {
      title: "Reconcile College Exam Booklet Settlement",
      actionText: "Clear the ₹12,500 pending credit in Reconciliation Workspace to lift Data Reliability.",
      impact: "+₹12,500 immediately recognized into verified working capital",
      targetPath: "/reconciliation",
    },
    isSampleResponse: true,
    model: "Offline Fallback Schema",
  };
}
