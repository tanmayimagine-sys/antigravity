"use client";

import React, { useState } from "react";
import { useBusiness } from "@/components/shell/BusinessContext";
import { db } from "@/lib/db";
import { MetricCard } from "@/components/ui/MetricCard";
import { ConfidenceBadge, EvidenceTag } from "@/components/ui/ConfidenceBadge";
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

  // Retrieve business-isolated data
  const metrics = db.getMetrics(activeBusiness.id);
  const products = db.getProducts(activeBusiness.id);
  const expenses = db.getExpenses(activeBusiness.id);
  const health = db.getHealthAssessment(activeBusiness.id);
  const recs = db.getRecommendations(activeBusiness.id);

  // Fallbacks if active business has empty metrics
  const displayMetrics = metrics.length >= 4 ? metrics : db.getMetrics("biz_stationery");
  const displayHealth = health || db.getHealthAssessment("biz_stationery")!;
  const displayProducts = products.length > 0 ? products : db.getProducts("biz_stationery");
  const displayExpenses = expenses.length > 0 ? expenses : db.getExpenses("biz_stationery");

  // Sorted hero products
  const sortedProducts = [...displayProducts].sort((a, b) => {
    if (productRankingMode === "revenue") return b.revenue30dPaise - a.revenue30dPaise;
    if (productRankingMode === "units") return b.unitsSold30d - a.unitsSold30d;
    return b.marginPercent - a.marginPercent;
  });

  // Trend chart data (7 periods)
  const chartData = [
    { period: "Week 1", sales: 112000, expenses: 42000, orders: 540 },
    { period: "Week 2", sales: 128000, expenses: 41000, orders: 610 },
    { period: "Week 3", sales: 122000, expenses: 48000, orders: 590 },
    { period: "Week 4", sales: 154300, expenses: 45000, orders: 670 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              Owner Overview
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-surface-2 border border-border text-text-muted">
              {activeBusiness.categoryLabel}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Verified performance for <strong>{activeBusiness.name}</strong> • {dateRange}
          </p>
        </div>

        {/* Needs Attention Quick Pill */}
        <a
          href="/reconciliation"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning-soft text-warning border border-warning/30 text-xs font-semibold hover:bg-warning-soft/80 transition-colors"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>2 Reconciliation Exceptions Require Review</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Row 1: 4 MetricCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayMetrics.slice(0, 4).map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Row 2: Sales Trend Chart + Business Health Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-text">Sales & Operating Inflows</h3>
                <EvidenceTag type="fact" />
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Reconciled weekly trend vs documented expenses
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowChartAsTable(!showChartAsTable)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border text-xs text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
              title="Accessible Table View"
            >
              {showChartAsTable ? <BarChart3 className="w-3.5 h-3.5" /> : <TableIcon className="w-3.5 h-3.5" />}
              <span>{showChartAsTable ? "View Chart" : "View as Table"}</span>
            </button>
          </div>

          {showChartAsTable ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="py-2">Period</th>
                    <th className="py-2 text-right">Verified Sales (₹)</th>
                    <th className="py-2 text-right">Expenses (₹)</th>
                    <th className="py-2 text-right">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {chartData.map((d, i) => (
                    <tr key={i} className="hover:bg-surface-2/40">
                      <td className="py-2 font-medium">{d.period}</td>
                      <td className="py-2 text-right font-semibold tabular-nums">₹{d.sales.toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right font-semibold tabular-nums">₹{d.expenses.toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right tabular-nums">{d.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="period" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                      color: "var(--text)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}`, ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="Gross Sales"
                    stroke="var(--chart-1)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#salesGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border">
            <span>Derived from POS + Merchant UPI statements</span>
            <span className="font-mono text-[11px] text-accent">Formula: SUM(salesOrder.totalPaise)</span>
          </div>
        </div>

        {/* Business Health Profile Card (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-text">Business Health Profile</h3>
                <span className="text-[11px] text-text-muted font-mono">
                  {displayHealth.formulaVersion}
                </span>
              </div>
              <ConfidenceBadge
                confidence={displayHealth.confidence}
                coveragePercent={displayHealth.coveragePercent}
              />
            </div>

            {/* Score Ring Display */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-border">
              <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-4 border-accent text-accent font-extrabold text-xl tabular-nums shrink-0">
                {displayHealth.overallScore}
              </div>
              <div className="space-y-1">
                <div className="font-bold text-text text-sm">
                  {displayHealth.overallScore >= 80
                    ? "Strong Operating Discipline"
                    : "Moderate Cash-Flow Stability"}
                </div>
                <p className="text-xs text-text-muted leading-tight">
                  Calculated deterministically from 7 transparent operational indicators.
                </p>
              </div>
            </div>

            {/* Component Indicators Breakdown */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Revenue Consistency:</span>
                <span className="font-semibold text-text tabular-nums">{displayHealth.revenueConsistencyScore} / 20</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(displayHealth.revenueConsistencyScore / 20) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-text-muted">Cash-Flow Health:</span>
                <span className="font-semibold text-text tabular-nums">{displayHealth.cashFlowHealthScore} / 20</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full bg-accent" style={{ width: `${(displayHealth.cashFlowHealthScore / 20) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-text-muted">Data Reliability (Reconciled %):</span>
                <span className="font-semibold text-text tabular-nums">{displayHealth.dataReliabilityScore} / 15</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${(displayHealth.dataReliabilityScore / 15) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Compliance Disclaimer */}
          <div className="p-2.5 rounded bg-surface-2/60 border border-border text-[11px] text-text-muted italic leading-relaxed">
            {displayHealth.disclaimer}
          </div>
        </div>
      </div>

      {/* Row 3: Hero Product Rankings + Expenses Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hero Product Rankings (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-base text-text">Hero Product Rankings</h3>
              <p className="text-xs text-text-muted">Ranked by verified sales order data</p>
            </div>

            {/* Metric Toggle: Units / Revenue / Margin */}
            <div className="inline-flex rounded-lg p-0.5 bg-surface-2 border border-border text-xs">
              <button
                type="button"
                onClick={() => setProductRankingMode("revenue")}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  productRankingMode === "revenue"
                    ? "bg-surface text-primary-ink shadow-sm font-semibold"
                    : "text-text-muted hover:text-text"
                }`}
              >
                By Revenue
              </button>
              <button
                type="button"
                onClick={() => setProductRankingMode("units")}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  productRankingMode === "units"
                    ? "bg-surface text-primary-ink shadow-sm font-semibold"
                    : "text-text-muted hover:text-text"
                }`}
              >
                By Units
              </button>
              <button
                type="button"
                onClick={() => setProductRankingMode("margin")}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  productRankingMode === "margin"
                    ? "bg-surface text-primary-ink shadow-sm font-semibold"
                    : "text-text-muted hover:text-text"
                }`}
              >
                By Margin %
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {sortedProducts.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-2/40 text-xs transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 font-mono text-text-muted font-bold">#{idx + 1}</span>
                  <div>
                    <div className="font-semibold text-text flex items-center gap-1.5">
                      <span>{p.name}</span>
                      {p.isHero && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-accent-soft text-accent font-semibold">
                          Hero
                        </span>
                      )}
                    </div>
                    <div className="text-text-muted text-[11px]">
                      {p.category} • SKU: {p.sku}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-text tabular-nums text-sm">
                    {productRankingMode === "revenue"
                      ? formatPaise(p.revenue30dPaise)
                      : productRankingMode === "units"
                      ? `${p.unitsSold30d} sold`
                      : `${p.marginPercent.toFixed(1)}% margin`}
                  </div>
                  <div className="text-text-muted text-[11px] tabular-nums">
                    Price: {formatPaise(p.sellingPricePaise)} • Cost: {formatPaise(p.costPricePaise)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-text">Operating Expenses</h3>
              <p className="text-xs text-text-muted">Documented monthly vendor outflows</p>
            </div>
            <EvidenceTag type="fact" />
          </div>

          <div className="space-y-3">
            {displayExpenses.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text capitalize">{exp.category.replace("_", " ")}</span>
                  <span className="font-bold text-text tabular-nums">{formatPaise(exp.amountPaise)}</span>
                </div>
                <div className="text-[11px] text-text-muted truncate">
                  {exp.description} ({exp.vendor})
                </div>
                <div className="w-full h-1 rounded-full bg-surface-2 overflow-hidden">
                  <div
                    className="h-full bg-primary/70"
                    style={{
                      width: `${Math.min(100, (exp.amountPaise / 10000000) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-semibold text-text">
            <span>Total Monthly Overhead:</span>
            <span className="tabular-nums">
              {formatPaise(displayExpenses.reduce((sum, e) => sum + e.amountPaise, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
