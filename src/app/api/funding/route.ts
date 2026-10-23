import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "Missing businessId" }, { status: 400 });
  }

  const offers = db.getFundingOffers(businessId);
  const ledger = db.getLedgerEntries(businessId);

  return NextResponse.json({
    businessId,
    offers,
    ledger,
    disclaimer: "SIMULATED. No real money moves. Live funding is BLOCKED.",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, offerId } = body;

    if (!businessId || !offerId) {
      return NextResponse.json({ error: "Missing businessId or offerId" }, { status: 400 });
    }

    const accepted = db.acceptFundingOffer(businessId, offerId);
    if (!accepted) {
      return NextResponse.json({ error: "Offer not found or unauthorized" }, { status: 403 });
    }

    db.logAudit({
      businessId,
      userId: "usr_owner_1",
      userName: "Ramesh Sharma",
      eventType: "SIMULATED_FUNDING_ACCEPTED",
      action: `Simulated terms accepted for offer ${offerId}`,
      details: "Repayment ledger activated with deterministic cap",
    });

    return NextResponse.json({ success: true, offer: accepted });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
