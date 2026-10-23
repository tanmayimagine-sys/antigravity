"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/components/shell/BusinessContext";
import {
  Store,
  Calculator,
  Coins,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Globe,
  FileCheck2,
  TrendingUp,
  Bot,
} from "lucide-react";
import { UserRole } from "@/lib/types";

export default function LandingPage() {
  const router = useRouter();
  const { setCurrentRole, setActiveBusinessId, setGuidedDemoActive } = useBusiness();

  const handleRoleSelect = (role: UserRole, businessId = "biz_stationery", targetPath = "/dashboard") => {
    setCurrentRole(role);
    setActiveBusinessId(businessId);
    router.push(targetPath);
  };

  const roles = [
    {
      role: "owner" as UserRole,
      title: "Business Owner",
      badge: "Full Access",
      desc: "Ramesh Sharma (Vidya Stationery). Review cash flow, approve AI growth actions, and monitor simulated repayments.",
      icon: Store,
      target: "/dashboard",
      accent: "border-primary/40 bg-primary-soft/20 text-primary-ink",
    },
    {
      role: "staff" as UserRole,
      title: "Accountant / Staff",
      badge: "Scoped Access",
      desc: "Priya Mehta. Upload bills, match settlements in the Exception Queue, and review parser confidence.",
      icon: Calculator,
      target: "/reconciliation",
      accent: "border-border bg-surface hover:bg-surface-2 text-text",
    },
    {
      role: "funder" as UserRole,
      title: "Simulated Funder",
      badge: "SIMULATED",
      desc: "Syndicate reviewer. Evaluate verified Business Health Profiles, review revenue share terms and cap progress.",
      icon: Coins,
      target: "/funding",
      accent: "border-info/40 bg-info-soft/30 text-info",
    },
    {
      role: "admin" as UserRole,
      title: "Platform Admin",
      badge: "System Governance",
      desc: "Inspect immutable audit logs, check tenant boundaries, and review locked regulatory safety flags.",
      icon: ShieldAlert,
      target: "/admin",
      accent: "border-border bg-surface hover:bg-surface-2 text-text",
    },
  ];

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
          From deterministic reconciliation and evidence-grounded AI advice to owner-approved public profiles and simulated funding.
        </p>

        <div className="flex items-center justify-center gap-3 pt-3 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setGuidedDemoActive(true);
              handleRoleSelect("owner", "biz_stationery", "/dashboard");
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:bg-primary-hover shadow-md transition-all active:scale-[0.98]"
          >
            <span>Try the 5-Minute Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => router.push("/public-profile/vidya-stationery")}
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-2 text-text font-medium text-sm transition-colors"
          >
            <Globe className="w-4 h-4 text-text-muted" />
            <span>Browse Public Store Profile</span>
          </button>
        </div>
      </div>

      {/* Role Selector Grid */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-text">Choose a Demonstration Persona</h2>
          <p className="text-xs text-text-muted mt-1">
            Experience the system through different authorized role scopes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.role}
                onClick={() => handleRoleSelect(r.role, "biz_stationery", r.target)}
                className={`rounded-xl border p-5 cursor-pointer transition-all duration-fast hover:shadow-md flex flex-col justify-between space-y-4 group ${r.accent}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-border shadow-sm group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-surface border border-border">
                      {r.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-text">{r.title}</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-ink group-hover:translate-x-1 transition-transform pt-2 border-t border-border/50">
                  <span>Enter as {r.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it Works Strip */}
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
