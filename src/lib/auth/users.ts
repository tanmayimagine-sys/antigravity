/**
 * Authentication & Credentials Registry
 *
 * Strict Tenant Isolation:
 * - Each shop owner has their own distinct credentials and is permanently locked to their shop.
 * - Investors have separate credentials granting multi-tenant marketplace discovery & investment rights,
 *   while completely blocking access to private accounting, reconciliation, and internal operations.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "owner" | "staff" | "funder" | "admin" | "visitor";
  businessId: string | null; // Locked to this shop if owner/staff; null if funder/admin
  businessName: string;
  businessCategory?: string;
  city?: string;
  title: string;
  avatarInitials: string;
  badge: string;
  description: string;
}

export const AUTH_USERS: AuthUser[] = [
  // 1. Vidya Stationery Owner
  {
    id: "usr_vidya_owner",
    name: "Ramesh Sharma",
    email: "owner@vidya.demo",
    password: "password123",
    role: "owner",
    businessId: "biz_stationery",
    businessName: "Vidya Stationery & Xerox",
    businessCategory: "Stationery & Document Centre",
    city: "Pune",
    title: "Store Proprietor",
    avatarInitials: "RS",
    badge: "Shop Owner (Vidya)",
    description: "Owner of Vidya Stationery & Xerox. Has full access to Pune store POS, cash flow, and borrowing controls.",
  },

  // 2. Scoops & Swirls Owner
  {
    id: "usr_scoops_owner",
    name: "Priya Sundaram",
    email: "owner@scoops.demo",
    password: "password123",
    role: "owner",
    businessId: "biz_icecream",
    businessName: "Scoops & Swirls Cold Treat",
    businessCategory: "Artisanal Ice Cream",
    city: "Bengaluru",
    title: "Founder & Master Gelatiere",
    avatarInitials: "PS",
    badge: "Shop Owner (Scoops)",
    description: "Owner of Scoops & Swirls Cold Treat. Has full access to Koramangala store operations and seasonal borrowing.",
  },

  // 3. Chai & Chutney Owner
  {
    id: "usr_chai_owner",
    name: "Kabir Oberoi",
    email: "owner@chai.demo",
    password: "password123",
    role: "owner",
    businessId: "biz_cafe",
    businessName: "Chai & Chutney All-Day Café",
    businessCategory: "Quick-Service Café",
    city: "New Delhi",
    title: "Managing Partner",
    avatarInitials: "KO",
    badge: "Shop Owner (Chai & Chutney)",
    description: "Owner of Chai & Chutney Café. Has full access to GK-2 outlet POS, aggregator reconciliations, and expansion.",
  },

  // 4. Investor / Syndicate
  {
    id: "usr_investor",
    name: "Kunal Shah",
    email: "investor@venture.demo",
    password: "password123",
    role: "funder",
    businessId: null, // Global marketplace view
    businessName: "Growth Syndicate & Capital",
    businessCategory: "Micro-Business Angel Fund",
    city: "Mumbai",
    title: "Accredited Micro-Business Investor",
    avatarInitials: "KS",
    badge: "Verified Investor",
    description: "Evaluates Business Health Profiles across all listed shops and commits simulated growth capital. Cannot alter store private settings or accounting.",
  },

  // 5. Scoped Staff / Accountant (Vidya Stationery)
  {
    id: "usr_accountant",
    name: "Ananya Deshmukh",
    email: "accounts@vidya.demo",
    password: "password123",
    role: "staff",
    businessId: "biz_stationery",
    businessName: "Vidya Stationery & Xerox",
    businessCategory: "Stationery & Document Centre",
    city: "Pune",
    title: "Chartered Accountant",
    avatarInitials: "AD",
    badge: "Scoped Staff / Accountant",
    description: "Uploads invoices and matches reconciliations in the Exception Queue for Vidya Stationery.",
  },

  // 6. Platform Governance / Admin
  {
    id: "usr_admin",
    name: "System Security Admin",
    email: "security@centralai.internal",
    password: "password123",
    role: "admin",
    businessId: null,
    businessName: "Platform Governance & Audit",
    city: "National",
    title: "Chief Compliance Officer",
    avatarInitials: "SA",
    badge: "Platform Admin",
    description: "Monitors tenant isolation boundaries, immutable audit logs, and locked regulatory compliance flags.",
  },
];

export function findUserByEmail(email: string): AuthUser | undefined {
  const normalized = email.trim().toLowerCase();
  return AUTH_USERS.find((u) => u.email.toLowerCase() === normalized);
}

export function findUserById(id: string): AuthUser | undefined {
  return AUTH_USERS.find((u) => u.id === id);
}

export function getOwnerForBusiness(businessId: string): AuthUser | undefined {
  return AUTH_USERS.find((u) => u.role === "owner" && u.businessId === businessId);
}
