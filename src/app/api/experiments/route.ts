import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "Missing businessId" }, { status: 400 });
  }

  const recommendations = db.getRecommendations(businessId);
  const experiments = db.getExperiments(businessId);

  return NextResponse.json({ recommendations, experiments });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, recommendationId, status, actionUpdates } = body;

    if (!businessId || !recommendationId || !status) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const updated = db.updateRecommendationStatus(businessId, recommendationId, status, actionUpdates);
    if (!updated) {
      return NextResponse.json({ error: "Recommendation not found or unauthorized" }, { status: 403 });
    }

    db.logAudit({
      businessId,
      userId: "usr_owner_1",
      userName: "Ramesh Sharma",
      eventType: "RECOMMENDATION_STATUS_CHANGE",
      action: `Recommendation ${recommendationId} changed to '${status}'`,
      details: JSON.stringify(actionUpdates || {}),
    });

    return NextResponse.json({ success: true, recommendation: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
