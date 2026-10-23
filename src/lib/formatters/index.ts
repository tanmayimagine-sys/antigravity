/**
 * Formatters for Indian Micro-Business Platform
 * Standards: en-IN locale, Lakh/Crore grouping, DD MMM YYYY dates, paise conversion.
 */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrDecimalsFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Converts integer minor units (paise) into properly grouped INR string
 * e.g. 12500000 paise -> "₹1,25,000"
 */
export function formatPaise(paise: number, includeDecimals = false): string {
  if (isNaN(paise) || paise === null || paise === undefined) return "₹0";
  const rupees = paise / 100;
  return includeDecimals ? inrDecimalsFormatter.format(rupees) : inrFormatter.format(rupees);
}

/**
 * Compact Indian currency formatting: e.g. ₹1.25 L, ₹12.4 K, ₹2.4 Cr
 */
export function formatPaiseCompact(paise: number): string {
  if (isNaN(paise) || paise === null || paise === undefined) return "₹0";
  const rupees = Math.abs(paise) / 100;
  const sign = paise < 0 ? "-" : "";

  if (rupees >= 10000000) {
    return `${sign}₹${(rupees / 10000000).toFixed(2)} Cr`;
  }
  if (rupees >= 100000) {
    return `${sign}₹${(rupees / 100000).toFixed(2)} L`;
  }
  if (rupees >= 1000) {
    return `${sign}₹${(rupees / 1000).toFixed(1)} K`;
  }
  return `${sign}₹${rupees.toFixed(0)}`;
}

/**
 * Format date in Indian style: "23 Oct 2026"
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return "";
  const d = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(d.getTime())) return String(dateString);

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format percentage with sign: "+12.4%" or "-5.1%"
 */
export function formatPercent(value: number, showSign = true): string {
  if (isNaN(value)) return "0%";
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Parse an uploaded rupee string into integer paise safely
 * e.g. "1,250.50" -> 125050 paise
 */
export function parseRupeesToPaise(input: string | number): number {
  if (typeof input === "number") return Math.round(input * 100);
  if (!input) return 0;
  const clean = input.replace(/[₹,\s]/g, "");
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : Math.round(num * 100);
}
