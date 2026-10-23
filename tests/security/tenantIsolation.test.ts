import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";

describe("Tenant Isolation & Security Tests", () => {
  beforeEach(() => {
    db.reset();
  });

  it("strictly isolates products by businessId", () => {
    const stationeryProducts = db.getProducts("biz_stationery");
    const icecreamProducts = db.getProducts("biz_icecream");

    expect(stationeryProducts.length).toBeGreaterThan(0);
    expect(icecreamProducts.length).toBeGreaterThan(0);

    // Ensure no stationery products bleed into icecream query
    for (const p of stationeryProducts) {
      expect(p.businessId).toBe("biz_stationery");
    }
    for (const p of icecreamProducts) {
      expect(p.businessId).toBe("biz_icecream");
    }
  });

  it("strictly isolates financial records and prevents cross-tenant mutation", () => {
    const stationeryRecords = db.getFinancialRecords("biz_stationery");
    expect(stationeryRecords.length).toBeGreaterThan(0);

    // Attempting to mutate a stationery record using an unauthorized businessId must fail
    const targetRecordId = stationeryRecords[0].id;
    const hackAttempt = db.updateFinancialRecord("biz_icecream", targetRecordId, {
      amountPaise: 99999999,
    });
    expect(hackAttempt).toBeNull();

    // Verify record in stationery business remains unmodified
    const verified = db.getFinancialRecords("biz_stationery").find((r) => r.id === targetRecordId);
    expect(verified?.amountPaise).toBe(stationeryRecords[0].amountPaise);
  });

  it("isolates recommendations and prevents cross-tenant approval", () => {
    const stationeryRecs = db.getRecommendations("biz_stationery");
    expect(stationeryRecs.length).toBeGreaterThan(0);
    const targetRecId = stationeryRecs[0].id;

    // Cross-tenant approval attempt from cafe
    const unauthorizedApproval = db.updateRecommendationStatus(
      "biz_cafe",
      targetRecId,
      "approved"
    );
    expect(unauthorizedApproval).toBeNull();
  });

  it("records all administrative actions in the immutable audit log", () => {
    const initialLogCount = db.getAuditLogs("biz_stationery").length;

    db.logAudit({
      businessId: "biz_stationery",
      userId: "usr_owner_1",
      userName: "Ramesh Sharma",
      eventType: "TEST_SECURITY_EVENT",
      action: "Verified audit persistence",
      details: "Tenant security check",
    });

    const updatedLogs = db.getAuditLogs("biz_stationery");
    expect(updatedLogs.length).toBe(initialLogCount + 1);
    expect(updatedLogs[0].eventType).toBe("TEST_SECURITY_EVENT");
  });
});
