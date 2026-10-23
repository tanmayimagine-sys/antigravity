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
  Building,
  PlusCircle,
  TrendingUp,
  Star,
  Users,
  Check,
  Briefcase,
} from "lucide-react";
import { FundingOffer, LedgerEntry, BorrowingListing } from "@/lib/types";

export default function FundingWorkspacePage() {
  const { activeBusiness } = useBusiness();
  const [activeTab, setActiveTab] = useState<"repayments" | "list_business" | "marketplace">("marketplace");

  const offers = db.getFundingOffers(activeBusiness.id);
  const activeOffer = offers[0] || db.getFundingOffers("biz_stationery")[0];
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(
    db.getLedgerEntries(activeBusiness.id)
  );
  const [isCalculatedDrawerOpen, setIsCalculatedDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Marketplace Listings State
  const [listings, setListings] = useState<BorrowingListing[]>(db.getBorrowingListings());

  // Owner Listing Form State
  const [borrowAmount, setBorrowAmount] = useState<number>(150000);
  const [useOfFunds, setUseOfFunds] = useState<string>("");
  const [revSharePercent, setRevSharePercent] = useState<number>(6.5);
  const [termMonths, setTermMonths] = useState<number>(6);
  const [isSubmittingListing, setIsSubmittingListing] = useState<boolean>(false);

  // Investor Commit Modal State
  const [investModalListing, setInvestModalListing] = useState<BorrowingListing | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(50000);
  const [investorName, setInvestorName] = useState<string>("Venture Catalyst Syndicate (SIMULATED)");
  const [isSubmittingInvest, setIsSubmittingInvest] = useState<boolean>(false);

  // Business stats for listing
  const health = db.getHealthAssessment(activeBusiness.id) || db.getHealthAssessment("biz_stationery")!;
  const metrics = db.getMetrics(activeBusiness.id);
  const grossSales = metrics.find((m) => m.metricCode === "M-201" || m.metricCode === "M-301")?.value || 51630000;
  const netCashFlow = metrics.find((m) => m.metricCode === "M-204" || m.metricCode === "M-304")?.value || 17230000;

  // Repayment Cap Progress
  const totalRepaidPaise = ledgerEntries.reduce((sum, e) => sum + e.repaymentDuePaise, 0);
  const totalCapPaise = activeOffer?.totalCapPaise || 11500000;
  const progressPercent = Math.min(100, Math.round((totalRepaidPaise / totalCapPaise) * 100));

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!useOfFunds.trim()) {
      alert("Please specify the purpose / use of funds.");
      return;
    }

    setIsSubmittingListing(true);
    try {
      const res = await fetch("/api/funding/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: activeBusiness.id,
          amountRequestedPaise: borrowAmount * 100,
          useOfFunds,
          offeredRevenueSharePercent: revSharePercent,
          estimatedTermMonths: termMonths,
          expectedMonthlyProfitPaise: Math.round(borrowAmount * 100 * 0.25),
        }),
      });

      if (!res.ok) throw new Error("Failed to create listing");
      const data = await res.json();

      setListings(db.getBorrowingListings());
      setToast("Business successfully listed on the Investor Marketplace!");
      setActiveTab("marketplace");
      setTimeout(() => setToast(null), 4000);
    } catch {
      setToast("Error submitting listing.");
    } finally {
      setIsSubmittingListing(false);
    }
  };

  const handleCommitInvestment = async () => {
    if (!investModalListing) return;
    setIsSubmittingInvest(true);

    try {
      const res = await fetch("/api/funding/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: investModalListing.id,
          funderName: investorName,
          amountPaise: investAmount * 100,
          revenueSharePercent: investModalListing.offeredRevenueSharePercent,
        }),
      });

      if (!res.ok) throw new Error("Investment commit failed");
      const data = await res.json();

      setListings(db.getBorrowingListings());
      setInvestModalListing(null);
      setToast(`Simulated capital of ₹${investAmount.toLocaleString("en-IN")} committed to ${investModalListing.businessName}!`);
      setTimeout(() => setToast(null), 4500);
    } catch {
      setToast("Failed to commit investment.");
    } finally {
      setIsSubmittingInvest(false);
    }
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
            Funding & Capital Marketplace
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-info-soft text-info border border-info/30">
            SIMULATED REVENUE SHARE
          </span>
        </div>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          List your business for growth funding, explore investor discovery marketplace, and track repayment caps.
        </p>
      </div>

      {toast && (
        <div className="p-3 rounded-lg bg-success-soft text-success border border-success/30 text-xs font-semibold animate-in fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Non-Dismissable Persistent Simulated Notice */}
      <SimulatedBanner />

      {/* Navigation Tabs */}
      <div className="border-b border-border flex items-center gap-6 text-sm overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("marketplace")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
            activeTab === "marketplace"
              ? "border-primary text-primary-ink font-bold"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <Briefcase className="w-4 h-4 text-primary-ink" />
          <span>Investor Marketplace & Discovery ({listings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("list_business")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
            activeTab === "list_business"
              ? "border-primary text-primary-ink font-bold"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <PlusCircle className="w-4 h-4 text-accent" />
          <span>List My Business for Borrowing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("repayments")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
            activeTab === "repayments"
              ? "border-primary text-primary-ink font-bold"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Active Repayments & Cap Ledger</span>
        </button>
      </div>

      {/* TAB 1: INVESTOR MARKETPLACE & DISCOVERY PANEL */}
      {activeTab === "marketplace" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-text">
                Businesses Seeking Growth Capital (Simulated Marketplace)
              </h2>
              <p className="text-xs text-text-muted">
                Review verified financial statistics, Business Health Profile score, and commit simulated funding.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("list_business")}
              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Your Business</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((item) => {
              const fundedPct = Math.min(100, Math.round(((item.fundedAmountPaise || 0) / item.amountRequestedPaise) * 100));
              const isTargetBusiness = item.businessId === activeBusiness.id;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Row: Business Name & Health Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-text leading-tight">{item.businessName}</h3>
                          {isTargetBusiness && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-primary-soft text-primary-ink font-semibold">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-text-muted">{item.city} • {item.businessCategory}</span>
                      </div>

                      <div className="text-right">
                        <div className="px-2 py-0.5 rounded-full bg-accent-soft text-accent text-xs font-bold font-mono">
                          BHP {item.healthScore}/100
                        </div>
                        <div className="flex text-amber-500 justify-end text-xs mt-0.5">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span className="ml-1 text-[11px] text-text-muted font-medium">{item.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Capital Requested */}
                    <div className="p-3 rounded-lg bg-surface-2 border border-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                          Seeking Capital
                        </span>
                        <span className="text-lg font-extrabold text-text tabular-nums">
                          {formatPaise(item.amountRequestedPaise)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                          Offered Terms
                        </span>
                        <span className="text-xs font-bold text-accent">
                          {item.offeredRevenueSharePercent}% daily rev-share
                        </span>
                      </div>
                    </div>

                    {/* Purpose / Use of Funds */}
                    <div className="text-xs space-y-1">
                      <span className="font-semibold text-text-muted text-[11px] uppercase tracking-wider block">
                        Use of Funds:
                      </span>
                      <p className="text-text leading-relaxed line-clamp-3 bg-surface-2/40 p-2 rounded border border-border/60">
                        {item.useOfFunds}
                      </p>
                    </div>

                    {/* Verified Financial Indicators */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded bg-surface-2/60 border border-border">
                        <span className="text-text-muted block text-[10px]">30d Verified Sales</span>
                        <span className="font-bold text-text tabular-nums">
                          {formatPaise(item.grossSales30dPaise)}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-surface-2/60 border border-border">
                        <span className="text-text-muted block text-[10px]">Net Cash Flow</span>
                        <span className="font-bold text-success tabular-nums">
                          {formatPaise(item.netCashFlow30dPaise)}
                        </span>
                      </div>
                    </div>

                    {/* Funding Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-text-muted">Simulated Funding Progress:</span>
                        <span className="font-semibold text-text">{fundedPct}% ({formatPaise(item.fundedAmountPaise || 0)})</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden border border-border">
                        <div
                          className="h-full bg-primary transition-all duration-slow"
                          style={{ width: `${fundedPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Investor Action */}
                  <div className="pt-3 border-t border-border mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setInvestModalListing(item);
                        setInvestAmount(Math.min(50000, item.amountRequestedPaise / 100));
                      }}
                      className="w-full py-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Invest / Commit Capital (Simulated)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LIST BUSINESS FOR BORROWING */}
      {activeTab === "list_business" && (
        <div className="max-w-3xl mx-auto rounded-xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-bold text-text">List Business for Capital Advance</h2>
            <p className="text-xs text-text-muted">
              Submit your growth capital requirement to the simulated investor syndicate. Your verified metrics will be automatically attached.
            </p>
          </div>

          {/* Auto-Attached Financial Transparency Strip */}
          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2 text-xs">
            <span className="font-bold text-text text-xs uppercase tracking-wider block">
              Auto-Verified Financial Credentials Attached to Listing:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded bg-surface border border-border">
                <span className="text-text-muted block text-[10px]">Business Health Score</span>
                <span className="font-extrabold text-accent text-sm">{health.overallScore}/100 (Strong)</span>
              </div>
              <div className="p-2.5 rounded bg-surface border border-border">
                <span className="text-text-muted block text-[10px]">30-Day Gross Sales</span>
                <span className="font-extrabold text-text text-sm">{formatPaise(grossSales)}</span>
              </div>
              <div className="p-2.5 rounded bg-surface border border-border">
                <span className="text-text-muted block text-[10px]">Net Operating Cash Flow</span>
                <span className="font-extrabold text-success text-sm">{formatPaise(netCashFlow)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-text block mb-1">
                How much money do you need to borrow? (in Rupees) *
              </label>
              <input
                type="number"
                min="10000"
                step="5000"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-border bg-surface text-text text-base font-bold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                placeholder="150000"
                required
              />
              <span className="text-[11px] text-text-muted">
                Equivalent to ₹{(borrowAmount).toLocaleString("en-IN")}
              </span>
            </div>

            <div>
              <label className="font-semibold text-text block mb-1">
                How will you use this money? (Equipment, Inventory, Store Renovation) *
              </label>
              <textarea
                rows={4}
                value={useOfFunds}
                onChange={(e) => setUseOfFunds(e.target.value)}
                placeholder="e.g. Purchase dual high-speed photocopier & pre-order bulk JK Copier paper to handle Pune University semester exam rush without bottleneck."
                className="w-full p-2.5 rounded-lg border border-border bg-surface text-text text-xs leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-text block mb-1">
                  Proposed Daily Revenue Share (%)
                </label>
                <input
                  type="number"
                  min="3"
                  max="15"
                  step="0.5"
                  value={revSharePercent}
                  onChange={(e) => setRevSharePercent(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-border bg-surface text-text text-sm font-semibold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                />
                <span className="text-[10px] text-text-muted">Typical micro-business rate is 5% – 8%</span>
              </div>

              <div>
                <label className="font-semibold text-text block mb-1">
                  Expected Repayment Horizon
                </label>
                <select
                  value={termMonths}
                  onChange={(e) => setTermMonths(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-border bg-surface text-text text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  <option value={3}>3 Months (Fast Turnaround)</option>
                  <option value={6}>6 Months (Standard)</option>
                  <option value={9}>9 Months</option>
                  <option value={12}>12 Months</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-text-muted">
                Simulated marketplace entry. No real liability incurred.
              </span>
              <button
                type="submit"
                disabled={isSubmittingListing}
                className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmittingListing ? "Publishing..." : "Publish Listing to Investor Panel"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: ACTIVE REPAYMENTS & CAP LEDGER */}
      {activeTab === "repayments" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Active Simulated Offer Terms & Cap Meter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Active Facility Terms
                  </span>
                  <h3 className="font-bold text-base text-text mt-0.5">
                    {activeOffer.funderName}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-success-soft text-success border border-success/30">
                  Active Facility
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-surface-2 border border-border">
                  <span className="text-text-muted block text-[10px]">Simulated Advance</span>
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
                  <span className="text-text-muted block text-[10px]">Setup Fees</span>
                  <span className="text-lg font-bold text-text tabular-nums">₹0</span>
                </div>
              </div>

              <div className="text-xs text-text-muted space-y-1">
                <strong className="text-text block font-medium">Eligible Revenue Definition:</strong>
                <p className="leading-relaxed bg-surface-2 p-2 rounded border border-border text-[11px]">
                  {activeOffer.eligibleRevenueDefinition}
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsCalculatedDrawerOpen(true)}
                  className="text-xs font-semibold text-primary-ink hover:underline flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>How this is calculated</span>
                </button>
              </div>
            </div>

            {/* Repayment Cap Progress Bar Card */}
            <div className="lg:col-span-6 rounded-xl border border-border bg-surface p-5 space-y-5 shadow-sm">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Deterministic Cap Ceiling
                  </span>
                  <h3 className="font-bold text-base text-text mt-0.5">
                    Cumulative Repaid vs Absolute Cap
                  </h3>
                </div>
                <span className="text-sm font-bold text-primary-ink font-mono">
                  {progressPercent}% Complete
                </span>
              </div>

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
                  Repayments stop automatically when cumulative deductions reach {formatPaise(totalCapPaise)}. Even if sales surge, no further deductions are ever made.
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

          {/* Ledger Table */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="font-bold text-base text-text">Daily Reconciled Ledger Deductions</h3>
            <DataTable
              data={ledgerEntries}
              columns={ledgerColumns}
              exportFileName="simulated_repayment_ledger.csv"
            />
          </div>
        </div>
      )}

      {/* INVESTOR COMMITMENT MODAL */}
      {investModalListing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div className="w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  Simulated Investor Commitment
                </span>
                <h3 className="font-bold text-base text-text mt-0.5">
                  Fund {investModalListing.businessName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInvestModalListing(null)}
                className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-2 border border-border space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-muted">Business Health Score:</span>
                  <span className="font-bold text-accent font-mono">{investModalListing.healthScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">30-Day Verified Sales:</span>
                  <span className="font-bold text-text tabular-nums">{formatPaise(investModalListing.grossSales30dPaise)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Requirement:</span>
                  <span className="font-bold text-text tabular-nums">{formatPaise(investModalListing.amountRequestedPaise)}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-text block mb-1">
                  Investor / Syndicate Name
                </label>
                <input
                  type="text"
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-surface text-text text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                />
              </div>

              <div>
                <label className="font-semibold text-text block mb-1">
                  How much capital do you wish to commit? (in Rupees)
                </label>
                <input
                  type="number"
                  min="5000"
                  step="5000"
                  max={investModalListing.amountRequestedPaise / 100}
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-border bg-surface text-text text-sm font-bold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                />
                <span className="text-[10px] text-text-muted">
                  Committing ₹{investAmount.toLocaleString("en-IN")} at {investModalListing.offeredRevenueSharePercent}% daily revenue share @ 1.15x cap.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-info-soft border border-info/30 text-[11px] text-info">
              Notice: This commitment is entirely SIMULATED for hackathon evaluation. No real money or bank transfers occur.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setInvestModalListing(null)}
                className="px-4 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-surface-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCommitInvestment}
                disabled={isSubmittingInvest || investAmount <= 0}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmittingInvest ? "Confirming..." : "Confirm Simulated Investment"}
              </button>
            </div>
          </div>
        </div>
      )}

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
