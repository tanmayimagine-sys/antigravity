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
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-16 space-y-14">

      {/* ── Hero ── */}
      <div className="space-y-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-surface text-[11.5px] font-medium text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          Central AI OS · v2.0 · Synthetic Demo
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-text tracking-tight leading-[1.15]">
          Understand your business.{" "}
          <span className="text-primary">Grow with confidence.</span>
        </h1>

        <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
          A connected AI operating system for Indian micro-retailers, cafés,
          and stationery shops — with strict tenant isolation, multi-shop
          credentials, and a separate investor discovery marketplace.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              setGuidedDemoActive(true);
              handleOwnerLogin("usr_vidya_owner");
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-white font-semibold text-[13.5px] hover:bg-primary-hover transition-colors active:scale-[0.98] shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Try the 5-Minute Guided Demo
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-border hover:bg-surface-2 text-text font-semibold text-[13.5px] transition-colors"
          >
            <KeyRound className="w-4 h-4 text-text-muted" />
            Sign In with Credentials
          </button>

          <button
            type="button"
            onClick={() => router.push("/public-profile/vidya-stationery")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-border hover:bg-surface-2 text-text font-medium text-[13.5px] transition-colors"
          >
            <Globe className="w-4 h-4 text-text-muted" />
            Public Storefront
          </button>
        </div>
      </div>

      {/* ── Shop Owners ── */}
      <div className="space-y-4">
        {/* Section header */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-text-muted" />
              <h2 className="text-[17px] font-semibold text-text">
                Shop Owners — Har Dukaan Ka Alag Login
              </h2>
            </div>
            <p className="text-[12.5px] text-text-muted mt-0.5 ml-6">
              Strict tenant isolation: each login is locked to a single store.
            </p>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-[11.5px] text-text-muted border border-border rounded-md px-2.5 py-1">
            <Lock className="w-3 h-3" />
            Isolated Boundaries
          </span>
        </div>

        {/* Owner cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shopOwners.map((owner) => (
            <div
              key={owner.id}
              className="rounded-lg border border-border bg-surface p-4 space-y-4 flex flex-col justify-between hover:border-primary/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-md bg-surface-2 border border-border text-text flex items-center justify-center font-bold text-[13px]">
                    {owner.avatarInitials}
                  </div>
                  <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-surface-2 border border-border text-text-muted font-medium">
                    {owner.city}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-[14px] text-text">{owner.businessName}</h3>
                  <p className="text-[11.5px] text-text-muted mt-0.5">{owner.businessCategory}</p>
                </div>

                <div className="rounded-md bg-surface-2 border border-border p-2.5 text-[11.5px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Proprietor</span>
                    <span className="font-medium text-text">{owner.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Login</span>
                    <span className="font-mono text-primary">{owner.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Password</span>
                    <span className="font-mono text-text-muted">{owner.password}</span>
                  </div>
                </div>

                <p className="text-[11.5px] text-text-muted leading-relaxed">{owner.description}</p>
              </div>

              <button
                type="button"
                onClick={() => handleOwnerLogin(owner.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-[12.5px] font-semibold hover:bg-primary-hover transition-colors active:scale-[0.98]"
              >
                Enter as {owner.name.split(" ")[0]}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Investor Portal ── */}
      <div className="rounded-lg border border-border bg-surface p-6 sm:p-8 space-y-5">
        <div className="flex items-start sm:items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-2 border border-border text-text-muted">
                  Investor Discovery
                </span>
                <span className="text-[10.5px] px-2 py-0.5 rounded-md border border-border text-text-muted">
                  Simulated
                </span>
              </div>
              <h2 className="text-[17px] font-semibold text-text mt-1">
                Investor & Syndicate Capital Discovery Portal
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInvestorLogin}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-white text-[12.5px] font-semibold hover:opacity-90 transition-opacity active:scale-[0.98] shrink-0"
          >
            Enter as Kunal Shah
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[12.5px] text-text-muted leading-relaxed max-w-3xl">
          Investors have dedicated credentials (
          <span className="font-mono text-text">{investor.email}</span> /{" "}
          <span className="font-mono text-text">{investor.password}</span>) granting discovery
          rights across <strong className="text-text">all listed businesses</strong>. Compare
          Business Health Profile (BHP) scores, 30-day verified gross sales, and customer reviews,
          and commit simulated investment capital.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: "Multi-Shop Discovery",
              desc: "View all 3 shops seeking capital side-by-side with verified sales and net margins.",
            },
            {
              title: "Zero Store Tampering",
              desc: "Investors cannot alter store settings, touch reconciliation, or upload fake bills.",
            },
            {
              title: "Simulated Commitments",
              desc: "Commit capital offers and track daily revenue share with deterministic repayment caps.",
            },
          ].map((f) => (
            <div key={f.title} className="p-3.5 rounded-md bg-surface-2 border border-border space-y-1">
              <span className="font-semibold text-[12.5px] text-text block">{f.title}</span>
              <span className="text-[11.5px] text-text-muted leading-relaxed">{f.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── How It Works ── */}
      <div className="space-y-5">
        <div>
          <h2 className="text-[17px] font-semibold text-text">How the Central AI System Operates</h2>
          <p className="text-[12.5px] text-text-muted mt-0.5">
            Strict separation between deterministic calculation and AI reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              n: "01",
              title: "Ingestion & Reconciliation",
              body: "Upload POS registers, bank statements, and scanned bills. Deterministic matching flags duplicates and sends unmatched credits to the Exception Queue.",
              color: "text-primary",
            },
            {
              n: "02",
              title: "Evidence-Grounded AI",
              body: "Central AI retrieves only authorized tenant context. Every claim links to verifiable evidence chips [M-201] with confidence levels and unknown indicators.",
              color: "text-accent",
            },
            {
              n: "03",
              title: "Owner Approval & Control",
              body: "No prices change, no money moves, and no public fields publish without owner approval. Repayments stop at the deterministic simulated cap.",
              color: "text-info",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="p-4 rounded-lg border border-border bg-surface space-y-2"
            >
              <span className={`font-mono text-[11px] font-semibold ${step.color}`}>{step.n}</span>
              <h4 className="font-semibold text-[13.5px] text-text">{step.title}</h4>
              <p className="text-[12px] text-text-muted leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust & Compliance footer strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
        {[
          {
            icon: Lock,
            title: "Tenant Isolated by Design",
            body: "Queries enforce business authorization at the data boundary. Never mixes tenant data.",
          },
          {
            icon: FileCheck2,
            title: "Explainable Health Profile",
            body: "Platform-generated indicator with clear formulas and coverage. Not a credit bureau score.",
          },
          {
            icon: Coins,
            title: "Simulated Funding Workflows",
            body: "Strictly simulated MVP. Live investment and money movement remain blocked.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-surface-2 border border-border flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-text-muted" />
              </div>
              <div>
                <strong className="text-[12.5px] text-text block">{item.title}</strong>
                <p className="text-[11.5px] text-text-muted mt-0.5 leading-relaxed">{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
