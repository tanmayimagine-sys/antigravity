import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listingId, funderName, amountPaise, revenueSharePercent } = body;

    if (!listingId || !amountPaise) {
      return NextResponse.json({ error: "Missing listingId or amountPaise" }, { status: 400 });
    }

    const result = db.commitInvestment(listingId, {
      funderName: funderName || "Verified Syndicate Investor (SIMULATED)",
      amountPaise,
      revenueSharePercent: revenueSharePercent || 6.5,
    });

    if (!result) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    db.logAudit({
      businessId: result.listing.businessId,
      userId: "usr_funder_1",
      userName: funderName || "Syndicate Investor",
      eventType: "SIMULATED_INVESTMENT_COMMITTED",
      action: `Committed ₹${amountPaise / 100} to ${result.listing.businessName}`,
      details: `Terms: ${revenueSharePercent}% revenue share @ 1.15x cap (SIMULATED)`,
    });

    return NextResponse.json({
      success: true,
      listing: result.listing,
      offer: result.offer,
      message: "Simulated capital committed successfully!",
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
