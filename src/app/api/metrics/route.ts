import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "Missing required businessId tenant parameter" }, { status: 400 });
  }

  // Tenant-isolated query
  const metrics = db.getMetrics(businessId);
  const health = db.getHealthAssessment(businessId);
  const products = db.getProducts(businessId);
  const expenses = db.getExpenses(businessId);

  return NextResponse.json({
    businessId,
    metrics,
    healthAssessment: health,
    products,
    expenses,
    generatedAt: new Date().toISOString(),
  });
}
