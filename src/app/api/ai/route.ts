import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { askCentralAI } from "@/lib/ai/geminiOrchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, query } = body;

    if (!businessId || !query) {
      return NextResponse.json(
        { error: "Missing businessId or query" },
        { status: 400 }
      );
    }

    const business = db.getBusinessById(businessId);
    if (!business) {
      return NextResponse.json(
        { error: "Unauthorized or invalid tenant" },
        { status: 403 }
      );
    }

    // Call live Gemini orchestrator with grounded business data
    const aiResult = await askCentralAI(businessId, query);

    db.logAudit({
      businessId,
      userId: "usr_owner_1",
      userName: "Ramesh Sharma",
      eventType: "AI_LIVE_QUERY_ORCHESTRATED",
      action: `Central AI (Gemini 2.5 Flash) processed: "${query.substring(0, 45)}..."`,
      details: `Referenced evidence: ${aiResult.evidenceIds.join(", ")} | Model: ${aiResult.model}`,
    });

    return NextResponse.json({
      ...aiResult,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
