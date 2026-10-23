import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId") || undefined;

  const logs = db.getAuditLogs(businessId);

  return NextResponse.json({
    featureFlags: {
      LIVE_FUNDING: "BLOCKED",
      SAMPLE_AI_MODE: true,
      DETERMINISTIC_RECONCILIATION: true,
    },
    auditLogs: logs,
  });
}
