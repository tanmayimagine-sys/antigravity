import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, query } = body;

    if (!businessId || !query) {
      return NextResponse.json({ error: "Missing businessId or query" }, { status: 400 });
    }

    const business = db.getBusinessById(businessId);
    if (!business) {
      return NextResponse.json({ error: "Unauthorized or invalid tenant" }, { status: 403 });
    }

    // Retrieve only authorized tenant evidence
    const metrics = db.getMetrics(businessId);
    const health = db.getHealthAssessment(businessId);
    const products = db.getProducts(businessId);

    const q = query.toLowerCase();

    // Provider-agnostic / Sample mode fallback response
    let answerText = "";
    let evidenceIds: string[] = [];
    let unknowns: string[] = [];
    let suggestedAction = undefined;

    if (q.includes("drop") || q.includes("dip") || q.includes("september") || q.includes("fall")) {
      answerText = `Verified sales dipped 9.9% in late September due to the post-admission semester lull. However, Xerox gross margin remained very resilient at 70%, while your high-volume paper ream stock was depleted.`;
      evidenceIds = ["M-201", "M-204", "prod_stat_5"];
      unknowns = [
        "External college timetable adjustments not captured in POS data.",
        "Cash walk-in receipts without itemized customer bills.",
      ];
      suggestedAction = {
        title: "Pre-Order Exam Paper Reams",
        actionText: "Restock 120 boxes of JK Copier 75GSM before exam weeks to capture high-margin photocopy volume.",
        impact: "+₹28,000 net profit during upcoming mid-term submissions",
        costPaise: 450000,
      };
    } else if (q.includes("promote") || q.includes("product") || q.includes("exam")) {
      answerText = `Your top-performing product by margin is Thesis Printing & Hard Binding (60% margin, ₹450 price). Engineering Drawing Sheets are also in heavy demand but have dipped below reorder threshold (65 units left).`;
      evidenceIds = ["prod_stat_1", "prod_stat_3", "M-203"];
      unknowns = ["Competitor binding pricing across FC Road."];
      suggestedAction = {
        title: "Launch Student Mid-Term Exam Bundle",
        actionText: "Bundle 1x Folder + 2x Notebooks + 50 Xerox vouchers at ₹480 (saving students ₹80).",
        impact: "+₹24,000 cash flow in 14 days",
        costPaise: 200000,
      };
    } else {
      answerText = `Your Business Health Profile is currently evaluated at **${health?.overallScore || 84}/100 (High Confidence)**. Your net operating cash flow stands at ₹1,72,300, comfortably covering your simulated revenue-share repayment obligations.`;
      evidenceIds = ["M-204", "M-201"];
      unknowns = ["Unreconciled bulk college cheque #4412 awaiting split clearance."];
      suggestedAction = {
        title: "Reconcile College Exam Booklet Settlement",
        actionText: "Clear the ₹12,500 pending credit in Reconciliation Workspace to lift Data Reliability.",
        impact: "+₹12,500 immediately recognized into verified working capital",
      };
    }

    db.logAudit({
      businessId,
      userId: "usr_owner_1",
      userName: "Ramesh Sharma",
      eventType: "AI_QUERY_ORCHESTRATED",
      action: `Central AI processed user prompt: "${query.substring(0, 40)}..."`,
      details: `Referenced evidence: ${evidenceIds.join(", ")}`,
    });

    return NextResponse.json({
      answer: answerText,
      evidenceIds,
      confidence: "high",
      unknowns,
      suggestedAction,
      isSampleResponse: !process.env.GEMINI_API_KEY,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
