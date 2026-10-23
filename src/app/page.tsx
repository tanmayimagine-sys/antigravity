"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/components/shell/BusinessContext";
import { AUTH_USERS } from "@/lib/auth/users";
import {
  Store,
  Coins,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Globe,
  FileCheck2,
  TrendingUp,
  KeyRound,
  Shield,
  Briefcase,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { switchUser, setGuidedDemoActive } = useBusiness();

  const shopOwners = AUTH_USERS.filter((u) => u.role === "owner");
  const investor = AUTH_USERS.find((u) => u.role === "funder")!;

  const handleOwnerLogin = (userId: string) => {
    switchUser(userId);
    router.push("/dashboard");
  };

  const handleInvestorLogin = () => {
    switchUser(investor.id);
    router.push("/funding");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary-ink text-xs font-semibold border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Central AI Micro-Business Operating System v2.0</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight leading-tight">
          Understand your business. <br className="hidden sm:inline" />
          <span className="text-primary-ink">Grow with confidence.</span>
        </h1>

        <p className="text-sm sm:text-base text-text-muted leading-relaxed">
          The connected AI operating system for Indian micro-retailers, cafés, and stationery shops.
          Featuring <strong>strict tenant isolation</strong>, multi-shop credentials, and a separate <strong>investor discovery marketplace</strong>.
        </p>

        <div className="flex items-center justify-center gap-3 pt-3 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setGuidedDemoActive(true);
              handleOwnerLogin("usr_vidya_owner");
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:bg-primary-hover shadow-md transition-all active:scale-[0.98]"
          >
            <span>Try the 5-Minute Guided Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-border bg-surface hover:bg-surface-2 text-text font-semibold text-sm transition-colors"
          >
            <KeyRound className="w-4 h-4 text-text-muted" />
            <span>Sign In with Credentials</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/public-profile/vidya-stationery")}
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-2 text-text font-medium text-sm transition-colors"
          >
            <Globe className="w-4 h-4 text-text-muted" />
            <span>Public Storefront</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: SHOP OWNERS (STRICT TENANT ISOLATION) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary-ink" />
              <h2 className="text-xl font-bold text-text">🏬 Shop Owners (Har Dukaan Ka Alag Login)</h2>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Strict Tenant Isolation: Logging in as a shop owner gives access strictly to that particular store. No other shop&apos;s data is accessible.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary-soft text-primary-ink font-semibold border border-primary/20 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Isolated Tenant Boundaries</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {shopOwners.map((owner) => (
            <div
              key={owner.id}
              className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm hover:border-primary/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary-ink flex items-center justify-center font-bold text-sm">
                    {owner.avatarInitials}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-text-muted border border-border">
                    {owner.city}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-text">{owner.businessName}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{owner.businessCategory}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-2 border border-border text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Proprietor:</span>
                    <span className="font-semibold text-text">{owner.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Login:</span>
                    <span className="font-mono text-primary-ink">{owner.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Password:</span>
                    <span className="font-mono text-text-muted">{owner.password}</span>
                  </div>
                </div>

                <p className="text-[11px] text-text-muted leading-relaxed">
                  {owner.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOwnerLogin(owner.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98]"
              >
                <span>Enter as {owner.name.split(" ")[0]} (Owner)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: INVESTOR & SYNDICATE PORTAL */}
      <div className="rounded-2xl border border-accent/40 bg-gradient-to-br from-surface to-accent-soft/20 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center shadow-md shrink-0">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-soft text-accent border border-accent/30">
                  Investor Discovery Access
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-text-muted">
                  Simulated Marketplace
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-text mt-1">
                💼 Investor & Syndicate Capital Discovery Portal
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInvestorLogin}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-white text-xs font-bold hover:opacity-95 shadow-md transition-transform active:scale-[0.98]"
          >
            <span>Enter as Kunal Shah (Investor)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-4xl">
          Investors have dedicated credentials (<strong>{investor.email}</strong> / <strong>{investor.password}</strong>) granting discovery rights across <strong>all listed businesses</strong>. Compare real-time Business Health Profile (BHP) scores, 30-day verified gross sales, and customer reviews, and commit simulated investment capital without compromising any shop&apos;s internal private accounting.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
            <span className="font-bold text-accent block">📊 Multi-Shop Discovery</span>
            <span className="text-text-muted text-[11px]">View all 3 shops seeking capital side-by-side with verified sales and net margins.</span>
          </div>
          <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
            <span className="font-bold text-accent block">🔒 Zero Store Tampering</span>
            <span className="text-text-muted text-[11px]">Investors cannot alter store settings, cannot touch reconciliation, and cannot upload fake bills.</span>
          </div>
          <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
            <span className="font-bold text-accent block">🤝 Simulated Commitments</span>
            <span className="text-text-muted text-[11px]">Commit capital offers and track daily revenue share with deterministic repayment caps.</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: How it Works Strip */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-lg font-bold text-text">How the Central AI System Operates</h2>
          <p className="text-xs text-text-muted">
            Strict separation between deterministic calculation and AI reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary-ink flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="font-bold text-sm text-text">Ingestion & Reconciliation</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Upload POS registers, bank statements, and scanned bills. Deterministic matching flags duplicates and sends unmatched credits to the Exception Queue.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="font-bold text-sm text-text">Evidence-Grounded AI</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Central AI retrieves only authorized tenant context. Every claim links to verifiable evidence chips [M-201] with confidence levels and unknown indicators.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <div className="w-8 h-8 rounded-lg bg-info-soft text-info flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="font-bold text-sm text-text">Owner Approval & Control</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              No prices change, no money moves, and no public fields publish without owner approval. Repayments stop at the deterministic simulated cap.
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Compliance Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border text-xs text-text-muted">
        <div className="flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div>
            <strong className="text-text block">Tenant Isolated by Design:</strong>
            Queries enforce business authorization at the data boundary. Never mixes tenant data.
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <FileCheck2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
          <div>
            <strong className="text-text block">Explainable Health Profile:</strong>
            Platform-generated indicator with clear formulas and coverage. Not a credit bureau score.
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Coins className="w-4 h-4 text-info shrink-0 mt-0.5" />
          <div>
            <strong className="text-text block">Simulated Funding Workflows:</strong>
            Strictly simulated MVP. Live investment and money movement remain blocked.
          </div>
        </div>
      </div>
    </div>
  );
}
