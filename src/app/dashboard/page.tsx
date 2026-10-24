"use client";

import React, { useState } from "react";
import { useBusiness } from "@/components/shell/BusinessContext";
import { db } from "@/lib/db";
import { MetricCard } from "@/components/ui/MetricCard";
import { ConfidenceBadge, EvidenceTag } from "@/components/ui/ConfidenceBadge";
import { LocationTile } from "@/components/ui/LocationTile";
import { formatPaise, formatPercent } from "@/lib/formatters";
import {
  TrendingUp,
  AlertCircle,
  FileCheck2,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Table as TableIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const { activeBusiness, dateRange } = useBusiness();
  const [productRankingMode, setProductRankingMode] = useState<"revenue" | "units" | "margin">("revenue");
  const [showChartAsTable, setShowChartAsTable] = useState(false);

  const metrics    = db.getMetrics(activeBusiness.id);
  const products   = db.getProducts(activeBusiness.id);
  const expenses   = db.getExpenses(activeBusiness.id);
  const health     = db.getHealthAssessment(activeBusiness.id);
  const recs       = db.getRecommendations(activeBusiness.id);

  const displayMetrics   = metrics.length >= 4 ? metrics : db.getMetrics("biz_stationery");
  const displayHealth    = health || db.getHealthAssessment("biz_stationery")!;
  const displayProducts  = products.length > 0 ? products : db.getProducts("biz_stationery");
  const displayExpenses  = expenses.length > 0 ? expenses : db.getExpenses("biz_stationery");

  const sortedProducts = [...displayProducts].sort((a, b) => {
    if (productRankingMode === "revenue") return b.revenue30dPaise - a.revenue30dPaise;
    if (productRankingMode === "units")   return b.unitsSold30d - a.unitsSold30d;
    return b.marginPercent - a.marginPercent;
  });

  const chartData = [
    { period: "Week 1", sales: 112000, expenses: 42000, orders: 540 },
    { period: "Week 2", sales: 128000, expenses: 41000, orders: 610 },
    { period: "Week 3", sales: 122000, expenses: 48000, orders: 590 },
    { period: "Week 4", sales: 154300, expenses: 45000, orders: 670 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-semibold text-text tracking-tight">
              Owner Overview
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-md font-medium border border-border bg-surface-2 text-text-muted">
              {activeBusiness.categoryLabel}
            </span>
          </div>
          <p className="text-[12.5px] text-text-muted mt-0.5">
            Verified performance for{" "}
            <span className="font-medium text-text">{activeBusiness.name}</span>{" "}
            · {dateRange}
          </p>
        </div>

        {/* Attention pill */}
        <a
          href="/reconciliation"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-warning/40 bg-warning-soft text-warning text-[12px] font-medium hover:border-warning/60 transition-colors"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>2 Reconciliation Exceptions</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* ── Row 1: 4 MetricCards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayMetrics.slice(0, 4).map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* ── Row 2: Sales Trend + Business Health ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Sales Trend Chart */}
        <div className="lg:col-span-7 rounded-lg border border-border bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[14px] text-text">Sales & Operating Inflows</h3>
                <EvidenceTag type="fact" />
              </div>
              <p className="text-[11.5px] text-text-muted mt-0.5">
                Reconciled weekly trend vs documented expenses
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowChartAsTable(!showChartAsTable)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border text-[11.5px] text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
              title="Toggle table view"
            >
              {showChartAsTable ? (
                <BarChart3 className="w-3.5 h-3.5" />
              ) : (
                <TableIcon className="w-3.5 h-3.5" />
              )}
              <span>{showChartAsTable ? "View Chart" : "Table"}</span>
            </button>
          </div>

          {showChartAsTable ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px] border-collapse">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="py-2 font-medium">Period</th>
                    <th className="py-2 text-right font-medium">Verified Sales (₹)</th>
                    <th className="py-2 text-right font-medium">Expenses (₹)</th>
                    <th className="py-2 text-right font-medium">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {chartData.map((d, i) => (
                    <tr key={i} className="hover:bg-surface-2/50">
                      <td className="py-2 font-medium">{d.period}</td>
                      <td className="py-2 text-right font-semibold tabular-nums">₹{d.sales.toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right tabular-nums text-text-muted">₹{d.expenses.toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right tabular-nums">{d.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--chart-1)" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="period"
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                      color: "var(--text)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      boxShadow: "var(--shadow-md)",
                    }}
                    formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}`, ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="Gross Sales"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#salesGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border">
            <span>Derived from POS + Merchant UPI statements</span>
            <span className="font-mono text-accent">SUM(salesOrder.totalPaise)</span>
          </div>
        </div>

        {/* Business Health Profile */}
        <div className="lg:col-span-5 rounded-lg border border-border bg-surface p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[14px] text-text">Business Health Profile</h3>
                <span className="text-[10.5px] text-text-muted font-mono block mt-0.5">
                  {displayHealth.formulaVersion}
                </span>
              </div>
              <ConfidenceBadge
                confidence={displayHealth.confidence}
                coveragePercent={displayHealth.coveragePercent}
              />
            </div>

            {/* Score ring */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-2 border border-border">
              <div className="relative w-16 h-16 shrink-0">
                <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                  <circle
                    cx="32" cy="32" r="26"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="32" cy="32" r="26"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(displayHealth.overallScore / 100) * 163} 163`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[17px] font-bold text-text tabular-nums">
                  {displayHealth.overallScore}
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-[13px] text-text">
                  {displayHealth.overallScore >= 80
                    ? "Strong Operating Discipline"
                    : "Moderate Cash-Flow Stability"}
                </div>
                <p className="text-[11.5px] text-text-muted leading-snug">
                  Calculated from 7 transparent operational indicators.
                </p>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="space-y-3 text-[12px]">
              {[
                { label: "Revenue Consistency", score: displayHealth.revenueConsistencyScore, max: 20, color: "bg-primary" },
                { label: "Cash-Flow Health",    score: displayHealth.cashFlowHealthScore,    max: 20, color: "bg-accent" },
                { label: "Data Reliability",    score: displayHealth.dataReliabilityScore,   max: 15, color: "bg-success" },
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">{row.label}</span>
                    <span className="font-semibold text-text tabular-nums">
                      {row.score} / {row.max}
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-surface-2 overflow-hidden">
                    <div
                      className={`h-full ${row.color} rounded-full`}
                      style={{ width: `${(row.score / row.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-text-muted italic leading-relaxed border-t border-border pt-3">
            {displayHealth.disclaimer}
          </p>
        </div>
      </div>

      {/* ── Row 3: Hero Products + Expenses ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Hero Product Rankings */}
        <div className="lg:col-span-7 rounded-lg border border-border bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-semibold text-[14px] text-text">Hero Product Rankings</h3>
              <p className="text-[11.5px] text-text-muted mt-0.5">Ranked by verified sales order data</p>
            </div>

            {/* Toggle pill */}
            <div className="inline-flex rounded-md border border-border bg-surface-2 p-0.5 text-[11.5px]">
              {(["revenue", "units", "margin"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setProductRankingMode(mode)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors capitalize ${
                    productRankingMode === mode
                      ? "bg-surface text-text shadow-sm border border-border"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  {mode === "revenue" ? "Revenue" : mode === "units" ? "Units" : "Margin %"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {sortedProducts.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-surface-2/60 text-[12px] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 font-mono text-[11px] text-text-muted shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium text-text flex items-center gap-1.5">
                      <span className="truncate">{p.name}</span>
                      {p.isHero && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary-soft text-primary-ink font-semibold shrink-0">
                          Hero
                        </span>
                      )}
                    </div>
                    <div className="text-text-muted text-[11px] truncate">
                      {p.category} · SKU: {p.sku}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <div className="font-semibold text-text tabular-nums text-[13px]">
                    {productRankingMode === "revenue"
                      ? formatPaise(p.revenue30dPaise)
                      : productRankingMode === "units"
                      ? `${p.unitsSold30d} sold`
                      : `${p.marginPercent.toFixed(1)}%`}
                  </div>
                  <div className="text-text-muted text-[11px] tabular-nums">
                    ₹{formatPaise(p.sellingPricePaise)} · {formatPaise(p.costPricePaise)} cost
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="lg:col-span-5 rounded-lg border border-border bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[14px] text-text">Operating Expenses</h3>
              <p className="text-[11.5px] text-text-muted mt-0.5">Documented monthly vendor outflows</p>
            </div>
            <EvidenceTag type="fact" />
          </div>

          <div className="space-y-3">
            {displayExpenses.map((exp) => {
              const pct = Math.min(100, (exp.amountPaise / 10000000) * 100);
              return (
                <div key={exp.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-medium text-text capitalize">
                      {exp.category.replace("_", " ")}
                    </span>
                    <span className="font-semibold text-text tabular-nums">
                      {formatPaise(exp.amountPaise)}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-muted truncate">
                    {exp.description} · {exp.vendor}
                  </div>
                  <div className="w-full h-1 rounded-full bg-surface-2 overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-[13px] font-semibold text-text">
            <span>Total Monthly Overhead</span>
            <span className="tabular-nums">
              {formatPaise(displayExpenses.reduce((sum, e) => sum + e.amountPaise, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 4: Business Location & Area Growth ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <LocationTile businessId={activeBusiness.id} />

        {/* Area context note */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-surface p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[14px] text-text">Why Location Matters for Your Business</h3>
              <span className="text-[10.5px] px-2 py-0.5 rounded-md border border-border bg-surface-2 text-text-muted font-medium">
                Mock · Area Intelligence
              </span>
            </div>
            <p className="text-[12.5px] text-text-muted leading-relaxed max-w-xl">
              Land appreciation and footfall density directly affect your store&apos;s long-term lease
              negotiation leverage, expansion timing, and funding attractiveness. Investors on this
              platform compare your location health as part of the Business Health Profile (BHP) score.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { label: "Lease Renewal Leverage", value: "Medium–High", hint: "Rising land values strengthen your position" },
                { label: "Expansion Timing",       value: "Now–12 mo",   hint: "Rental rates still below metro-zone average" },
                { label: "BHP Location Weight",    value: "10 / 100 pts", hint: "Platform allocates 10 points for area score" },
              ].map((item) => (
                <div key={item.label} className="rounded-md bg-surface-2 border border-border p-3 space-y-1">
                  <div className="text-[10px] text-text-muted font-medium uppercase tracking-wide">
                    {item.label}
                  </div>
                  <div className="font-semibold text-[13px] text-text">{item.value}</div>
                  <div className="text-[11px] text-text-muted leading-snug">{item.hint}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border text-[11px] text-text-muted/60 italic">
            ⚠ All area intelligence is mock data for demonstration purposes only. Not financial or real estate advice.
          </div>
        </div>
      </div>
    </div>
  );
}
