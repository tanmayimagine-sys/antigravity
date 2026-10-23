import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reconcileSettlements } from "@/lib/deterministic/reconciliation";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "Missing required businessId" }, { status: 400 });
  }

  const settlements = db.getFinancialRecords(businessId);
  const orders = db.getOrders(businessId);

  const result = reconcileSettlements(settlements, orders);

  return NextResponse.json({
    businessId,
    matches: result.matches,
    unmatchedCount: result.unmatchedSettlements.length,
    duplicateCount: result.duplicateRecords.length,
    matchRatePercent: result.matchRatePercent,
    totalSettlementPaise: result.totalSettlementPaise,
    totalReconciledSalesPaise: result.totalReconciledSalesPaise,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, recordId, updates, action } = body;

    if (!businessId || !recordId) {
      return NextResponse.json({ error: "Missing businessId or recordId" }, { status: 400 });
    }

    const updated = db.updateFinancialRecord(businessId, recordId, updates);
    if (!updated) {
      return NextResponse.json({ error: "Record not found or tenant unauthorized" }, { status: 403 });
    }

    db.logAudit({
      businessId,
      userId: "usr_owner_1",
      userName: "Ramesh Sharma",
      eventType: "RECONCILIATION_UPDATE",
      action: action || "Manual field update in reconciliation workspace",
      details: JSON.stringify(updates),
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
