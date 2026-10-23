import { describe, it, expect } from "vitest";
import { formatPaise, formatPaiseCompact, parseRupeesToPaise } from "@/lib/formatters";

describe("Rupee / Paise Formatter (en-IN Standards)", () => {
  it("formats integer paise into Indian currency with lakh grouping", () => {
    // 12500000 paise = ₹1,25,000
    const formatted = formatPaise(12500000);
    // Note: Node Intl may render with or without non-breaking space
    expect(formatted.replace(/\u00a0/g, " ")).toContain("₹1,25,000");
  });

  it("handles negative amounts correctly", () => {
    // -500000 paise = -₹5,000
    const formatted = formatPaise(-500000);
    expect(formatted.replace(/\u00a0/g, " ")).toContain("-₹5,000");
  });

  it("formats compact Indian notations (Lakhs and Crores)", () => {
    expect(formatPaiseCompact(15000000)).toBe("₹1.50 L");
    expect(formatPaiseCompact(2500000000)).toBe("₹2.50 Cr");
    expect(formatPaiseCompact(4500000)).toBe("₹45.0 K");
  });

  it("safely parses rupee string into exact integer paise", () => {
    expect(parseRupeesToPaise("₹1,250.50")).toBe(125050);
    expect(parseRupeesToPaise("500")).toBe(50000);
    expect(parseRupeesToPaise("0")).toBe(0);
  });
});
