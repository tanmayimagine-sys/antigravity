import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BorrowingListing } from "@/lib/types";

export async function GET() {
  const listings = db.getBorrowingListings();
  const commitments = db.getInvestorCommitments();
  return NextResponse.json({
    listings,
    commitments,
    disclaimer: "SIMULATED MARKETPLACE. No real money moves. For demonstration & evaluation only.",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessId,
      amountRequestedPaise,
      useOfFunds,
      offeredRevenueSharePercent,
      estimatedTermMonths,
      expectedMonthlyProfitPaise,
    } = body;

    if (!businessId || !amountRequestedPaise || !useOfFunds) {
      return NextResponse.json({ error: "Missing required listing fields" }, { status: 400 });
    }

    const business = db.getBusinessById(businessId);
    if (!business) {
      return NextResponse.json({ error: "Business tenant not found" }, { status: 404 });
    }

    const health = db.getHealthAssessment(businessId);
    const metrics = db.getMetrics(businessId);
    const reviews = db.getReviews(businessId);

    const grossSales = metrics.find((m) => m.metricCode === "M-201" || m.metricCode === "M-301" || m.metricCode === "M-401")?.value || 50000000;
    const cashFlow = metrics.find((m) => m.metricCode === "M-204" || m.metricCode === "M-304" || m.metricCode === "M-404")?.value || 15000000;
    const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 4.8;

    const newListing: BorrowingListing = {
      id: `list_${business.slug}_${Date.now()}`,
      businessId,
      businessName: business.name,
      businessCategory: business.categoryLabel,
      city: business.city,
      amountRequestedPaise,
      useOfFunds,
      offeredRevenueSharePercent: offeredRevenueSharePercent || 6.5,
      estimatedTermMonths: estimatedTermMonths || 6,
      expectedMonthlyProfitPaise: expectedMonthlyProfitPaise || Math.round(amountRequestedPaise * 0.25),
      status: "open",
      createdAt: new Date().toISOString(),
      healthScore: health?.overallScore || 84,
      grossSales30dPaise: grossSales,
      netCashFlow30dPaise: cashFlow,
      rating: Number(avgRating),
      commitmentsCount: 0,
      fundedAmountPaise: 0,
    };

    const created = db.createBorrowingListing(newListing);

    db.logAudit({
      businessId,
      userId: "usr_owner_1",
      userName: "Ramesh Sharma",
      eventType: "BORROWING_LISTING_CREATED",
      action: `Created borrowing listing for ₹${amountRequestedPaise / 100}`,
      details: useOfFunds,
    });

    return NextResponse.json({ success: true, listing: created });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
