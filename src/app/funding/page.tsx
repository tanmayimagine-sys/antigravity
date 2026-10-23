"use client";

import React, { useState } from "react";
import { useBusiness } from "@/components/shell/BusinessContext";
import { db } from "@/lib/db";
import { formatPaise, formatDate } from "@/lib/formatters";
import { SimulatedBanner } from "@/components/ui/SimulatedBanner";
import { DataTable, Column } from "@/components/shared/DataTable";
import {
  Coins,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  FileText,
} from "lucide-react";
import { FundingOffer, LedgerEntry } from "@/lib/types";

export default function FundingWorkspacePage() {
  const { activeBusiness } = useBusiness();
  const offers = db.getFundingOffers(activeBusiness.id);
  const activeOffer = offers[0] || db.getFundingOffers("biz_stationery")[0];
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(
    db.getLedgerEntries(activeBusiness.id)
  );
  const [isCalculatedDrawerOpen, setIsCalculatedDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Compute total simulated repaid and progress toward totalCapPaise
  const totalRepaidPaise = ledgerEntries.reduce((sum, e) => sum + e.repaymentDuePaise, 0);
  const totalCapPaise = activeOffer?.totalCapPaise || 11500000;
  const progressPercent = Math.min(100, Math.round((totalRepaidPaise / totalCapPaise) * 100));

  const handleCommitOffer = (offerId: string) => {
    db.acceptFundingOffer(activeBusiness.id, offerId);
    setToast("Simulated funding offer accepted. Repayment ledger activated.");
    setTimeout(() => setToast(null), 3500);
  };

  const ledgerColumns: Column<LedgerEntry>[] = [
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    {
      key: "grossSalesPaise",
      header: "Reconciled Gross Sales",
      render: (r) => (
        <span className="font-semibold text-text tabular-nums">
          {formatPaise(r.grossSalesPaise)}
        </span>
      ),
    },
    {
      key: "eligibleRevenuePaise",
      header: "Eligible Revenue",
      render: (r) => (
        <span className="tabular-nums text-text">{formatPaise(r.eligibleRevenuePaise)}</span>
      ),
    },
    {
      key: "sharePercent",
      header: "Revenue Share %",
      render: (r) => <span className="font-mono">{r.sharePercent}%</span>,
    },
    {
      key: "repaymentDuePaise",
      header: "Daily Repayment Due",
      render: (r) => (
        <span className="font-bold text-accent tabular-nums">
          {formatPaise(r.repaymentDuePaise)}
        </span>
      ),
    },
    {
      key: "cumulativeRepaidPaise",
      header: "Cumulative Repaid",
      render: (r) => (
        <span className="tabular-nums font-medium text-text">
          {formatPaise(r.cumulativeRepaidPaise)}
        </span>
      ),
    },
    {
      key: "remainingCapPaise",
      header: "Remaining Cap",
      render: (r) => (
        <span className="tabular-nums font-semibold text-text-muted">
          {formatPaise(r.remainingCapPaise)}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Simulated Funding Workspace
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-info-soft text-info border border-info/30">
            SIMULATED REVENUE SHARE
          </span>
        </div>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Transparent revenue-share calculations and deterministic repayment caps for <strong>{activeBusiness.name}</strong>
        </p>
      </div>

      {toast && (
        <div className="p-3 rounded-lg bg-success-soft text-success border border-success/30 text-xs font-semibold animate-in fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Non-Dismissable Persistent Simulated Notice */}
      <SimulatedBanner />

      {/* Row 1: Active Offer Card & Cap Progress Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active Simulated Offer Terms (6 cols) */}
        <div className="lg:col-span-6 rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
          <div className="flex items-start justify-between border-b border-border pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Simulated Offer Terms
              </span>
              <h3 className="font-bold text-base text-text mt-0.5">
                {activeOffer.funderName}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-success-soft text-success border border-success/30">
              {activeOffer.status === "simulated_active" ? "Active Demo" : "Available"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-surface-2 border border-border">
              <span className="text-text-muted block text-[10px]">Simulated Advance Amount</span>
              <span className="text-lg font-bold text-text tabular-nums">
                {formatPaise(activeOffer.offerAmountPaise)}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-2 border border-border">
              <span className="text-text-muted block text-[10px]">Revenue Share Rate</span>
              <span className="text-lg font-bold text-accent tabular-nums">
                {activeOffer.revenueSharePercent}% Daily
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-2 border border-border">
              <span className="text-text-muted block text-[10px]">Total Repayment Cap</span>
              <span className="text-lg font-bold text-text tabular-nums">
                {formatPaise(activeOffer.totalCapPaise)} ({activeOffer.repaymentCapMultiplier}x)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-2 border border-border">
              <span className="text-text-muted block text-[10px]">Platform Setup Fees</span>
              <span className="text-lg font-bold text-text tabular-nums">
                {activeOffer.feePaise === 0 ? "₹0 (Zero Fees)" : formatPaise(activeOffer.feePaise)}
              </span>
            </div>
          </div>

          <div className="text-xs text-text-muted space-y-1">
            <strong className="text-text block font-medium">Eligible Revenue Definition:</strong>
            <p className="leading-relaxed bg-surface-2 p-2 rounded border border-border text-[11px]">
              {activeOffer.eligibleRevenueDefinition}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setIsCalculatedDrawerOpen(true)}
              className="text-xs font-semibold text-primary-ink hover:underline flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>How this is calculated</span>
            </button>

            {activeOffer.status !== "simulated_active" && (
              <button
                type="button"
                onClick={() => handleCommitOffer(activeOffer.id)}
                className="px-4 py-2 rounded-md bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-sm"
              >
                Accept Simulated Terms
              </button>
            )}
          </div>
        </div>

        {/* Repayment Cap Progress Bar Card (6 cols) */}
        <div className="lg:col-span-6 rounded-xl border border-border bg-surface p-5 space-y-5 shadow-sm">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Deterministic Cap Progress
              </span>
              <h3 className="font-bold text-base text-text mt-0.5">
                Repayment Cap Ceiling
              </h3>
            </div>
            <span className="text-sm font-bold text-primary-ink font-mono">
              {progressPercent}% Complete
            </span>
          </div>

          {/* Large Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="tabular-nums text-text">{formatPaise(totalRepaidPaise)} repaid</span>
              <span className="tabular-nums text-text-muted">Cap: {formatPaise(totalCapPaise)}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-surface-2 overflow-hidden border border-border">
              <div
                className="h-full bg-primary transition-all duration-slow"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-2 border border-border text-xs text-text-muted space-y-1">
            <span className="font-semibold text-text block">Absolute Cap Rule:</span>
            <p className="leading-relaxed">
              Repayments cease immediately and automatically once cumulative daily transfers reach {formatPaise(totalCapPaise)}. Even if sales surge, no additional amount can ever be collected.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div>
              <span className="text-text-muted block text-[11px]">Remaining Cap Balance:</span>
              <span className="text-base font-bold text-text tabular-nums">
                {formatPaise(Math.max(0, totalCapPaise - totalRepaidPaise))}
              </span>
            </div>
            <div>
              <span className="text-text-muted block text-[11px]">Estimated Remaining Days:</span>
              <span className="text-base font-bold text-text tabular-nums">~72 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Deterministic Repayment Ledger Table */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div>
          <h3 className="font-bold text-base text-text">Simulated Repayment Ledger</h3>
          <p className="text-xs text-text-muted">
            Daily deductions computed strictly from reconciled POS sales
          </p>
        </div>

        <DataTable
          data={ledgerEntries}
          columns={ledgerColumns}
          exportFileName="simulated_repayment_ledger.csv"
        />
      </div>

      {/* "How This Was Calculated" Side Drawer */}
      {isCalculatedDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-md bg-surface h-full border-l border-border p-6 shadow-xl overflow-y-auto space-y-5 animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-base text-text">Deterministic Formula Details</h3>
              </div>
              <button
                onClick={() => setIsCalculatedDrawerOpen(false)}
                className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-text leading-relaxed">
              <div>
                <strong className="block text-text font-semibold mb-1">
                  1. Eligible Daily Revenue Formula
                </strong>
                <code className="block p-2 rounded bg-surface-2 border border-border font-mono text-[11px]">
                  EligibleRevenue = ReconciledGrossSales - VerifiedRefunds - DisputedCharges
                </code>
              </div>

              <div>
                <strong className="block text-text font-semibold mb-1">
                  2. Daily Repayment Due
                </strong>
                <code className="block p-2 rounded bg-surface-2 border border-border font-mono text-[11px]">
                  DailyDue = MIN(Math.round(EligibleRevenue * 6.5%), RemainingCap)
                </code>
              </div>

              <div>
                <strong className="block text-text font-semibold mb-1">
                  3. Zero-Sales Day Handling
                </strong>
                <p className="text-text-muted">
                  On days with ₹0 in verified sales, Daily Due is strictly ₹0. There is no penalty, default fee, or compounding interest; the schedule naturally extends.
                </p>
              </div>

              <div>
                <strong className="block text-text font-semibold mb-1">
                  4. Cap Guarantee
                </strong>
                <p className="text-text-muted">
                  The repayment ledger halts once CumulativeRepaid = TotalCapPaise ({formatPaise(totalCapPaise)}).
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsCalculatedDrawerOpen(false)}
                className="w-full py-2 rounded-md bg-surface border border-border font-semibold text-xs hover:bg-surface-2"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
