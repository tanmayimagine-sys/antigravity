"use client";

import React, { useState } from "react";
import { Check, X, Split, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { FinancialRecord, SalesOrder } from "@/lib/types";
import { formatPaise, formatDate } from "@/lib/formatters";

export interface ExceptionItem {
  id: string;
  settlement: FinancialRecord;
  suggestedOrders: SalesOrder[];
  differencePaise: number;
  matchConfidence: number;
  reason: string;
}

export function ExceptionQueue({
  items: initialItems,
  onResolve,
  className = "",
}: {
  items: ExceptionItem[];
  onResolve?: (itemId: string, action: "accept" | "reject" | "split") => void;
  className?: string;
}) {
  const [items, setItems] = useState<ExceptionItem[]>(initialItems);
  const [selectedId, setSelectedId] = useState<string>(initialItems[0]?.id || "");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeItem = items.find((i) => i.id === selectedId) || items[0];

  const handleAction = (itemId: string, action: "accept" | "reject" | "split") => {
    // Smooth item removal
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    setToastMessage(
      action === "accept"
        ? "Settlement matched & reconciled successfully."
        : action === "split"
        ? "Split settlement applied against selected invoice lines."
        : "Record dismissed from reconciliation queue."
    );
    setTimeout(() => setToastMessage(null), 3500);

    if (onResolve) onResolve(itemId, action);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-success-soft text-success flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-text text-base">Reconciliation Queue Clear</h3>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          All bank settlement credits match verified orders within configured tolerances. No pending discrepancies.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Banner with live N left counter */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-warning" />
          <span className="text-xs font-semibold text-text">
            Unmatched Settlements Requiring Attention:
          </span>
          <span className="px-2 py-0.5 rounded-full bg-warning-soft text-warning text-xs font-bold font-mono">
            {items.length} remaining
          </span>
        </div>
        {toastMessage && (
          <span className="text-xs font-medium text-success animate-in fade-in">
            ✓ {toastMessage}
          </span>
        )}
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Unmatched Settlements List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
            Unmatched Inflow (Bank / Aggregator)
          </label>
          {items.map((item) => {
            const isSelected = item.id === activeItem?.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary-soft/30 shadow-sm"
                    : "border-border bg-surface hover:bg-surface-2"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-text mb-1">
                  <span className="text-sm font-semibold tabular-nums">
                    {formatPaise(item.settlement.amountPaise)}
                  </span>
                  <span className="font-mono text-[11px] text-text-muted">
                    {formatDate(item.settlement.date)}
                  </span>
                </div>
                <div className="text-text font-medium truncate">{item.settlement.counterparty || "Direct Credit"}</div>
                <div className="font-mono text-[10px] text-text-muted mt-0.5">
                  Ref: {item.settlement.referenceNumber}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Suggested Match & Resolution Actions (7 cols) */}
        {activeItem && (
          <div className="lg:col-span-7 rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Suggested Match Target
                </span>
                <h4 className="font-bold text-sm text-text mt-0.5">
                  Confidence Score: {activeItem.matchConfidence}%
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-accent-soft text-accent border border-accent/30">
                Rule: {activeItem.suggestedOrders.length > 1 ? "Batch Payout" : "Direct Reference"}
              </span>
            </div>

            {/* Explanation */}
            <div className="p-3 rounded-lg bg-surface-2 text-xs text-text space-y-1">
              <span className="font-semibold block text-text-muted uppercase text-[10px]">
                Why is this flagged?
              </span>
              <p className="leading-relaxed">{activeItem.reason}</p>
            </div>

            {/* Candidate Orders List */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text block">
                Candidate Sales Invoices ({activeItem.suggestedOrders.length}):
              </label>
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {activeItem.suggestedOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="flex items-center justify-between p-2.5 rounded bg-surface-2/60 border border-border text-xs"
                  >
                    <div>
                      <span className="font-semibold font-mono text-text mr-2">{ord.orderNumber}</span>
                      <span className="text-text-muted">{formatDate(ord.date)} ({ord.channel})</span>
                    </div>
                    <span className="font-bold text-text tabular-nums">
                      {formatPaise(ord.totalPaise)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Difference breakdown */}
            <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
              <span className="text-text-muted">Variance / Deduced Fees:</span>
              <span className="font-semibold tabular-nums text-text">
                {activeItem.differencePaise === 0 ? "₹0.00 Exact Match" : formatPaise(activeItem.differencePaise)}
              </span>
            </div>

            {/* Action Buttons: Accept / Reject / Split */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleAction(activeItem.id, "reject")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-danger/30 text-danger hover:bg-danger-soft text-xs font-medium transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(activeItem.id, "split")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-surface text-text hover:bg-surface-2 text-xs font-medium transition-colors"
              >
                <Split className="w-3.5 h-3.5 text-text-muted" />
                <span>Split Settlement</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(activeItem.id, "accept")}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-primary text-on-primary hover:bg-primary-hover text-xs font-semibold shadow-sm transition-transform active:scale-[0.98]"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept Match</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
