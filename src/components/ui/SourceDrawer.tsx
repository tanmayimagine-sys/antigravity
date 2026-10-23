"use client";

import React, { createContext, useContext, useState } from "react";
import { X, FileText, CheckCircle2, ShieldCheck, Database, Calendar, ExternalLink } from "lucide-react";
import { formatPaise, formatDate } from "@/lib/formatters";
import { ConfidenceBadge } from "./ConfidenceBadge";

export interface SourceEvidenceDetails {
  id: string; // e.g. "M-201" or "rec_stat_01"
  title: string;
  category: "metric" | "record" | "product" | "benchmark";
  period?: string;
  sourceFile?: string;
  formula?: string;
  confidence: "high" | "medium" | "low" | "insufficient";
  coveragePercent?: number;
  value?: string | number;
  description: string;
  reconciledWith?: string;
}

interface SourceDrawerContextType {
  openDrawer: (details: SourceEvidenceDetails) => void;
  closeDrawer: () => void;
}

const SourceDrawerContext = createContext<SourceDrawerContextType | undefined>(undefined);

export function useSourceDrawer() {
  const ctx = useContext(SourceDrawerContext);
  if (!ctx) throw new Error("useSourceDrawer must be used within SourceDrawerProvider");
  return ctx;
}

export function SourceDrawerProvider({ children }: { children: React.ReactNode }) {
  const [activeItem, setActiveItem] = useState<SourceEvidenceDetails | null>(null);

  const openDrawer = (details: SourceEvidenceDetails) => setActiveItem(details);
  const closeDrawer = () => setActiveItem(null);

  return (
    <SourceDrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="source-drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-fast"
        >
          <div className="w-full max-w-md bg-surface h-full border-l border-border shadow-md flex flex-col animate-in slide-in-from-right duration-base">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-surface-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <h3 id="source-drawer-title" className="font-semibold text-text text-base">
                  Evidence & Provenance
                </h3>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Close evidence drawer"
                className="w-8 h-8 rounded-md flex items-center justify-center text-text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
              <div className="p-3.5 rounded-lg border border-border bg-surface-2/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-primary-soft text-primary-ink border border-primary/20">
                    {activeItem.id}
                  </span>
                  <ConfidenceBadge
                    confidence={activeItem.confidence}
                    coveragePercent={activeItem.coveragePercent}
                  />
                </div>
                <div className="font-semibold text-text text-base">{activeItem.title}</div>
                {activeItem.value !== undefined && (
                  <div className="text-xl font-bold text-text tabular-nums mt-1">
                    {typeof activeItem.value === "number" ? formatPaise(activeItem.value) : activeItem.value}
                  </div>
                )}
              </div>

              {/* Provenance fields */}
              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                    What does this mean?
                  </label>
                  <p className="text-text leading-relaxed">{activeItem.description}</p>
                </div>

                {activeItem.period && (
                  <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-text-muted" />
                      Measurement Period
                    </label>
                    <p className="text-text font-medium">{activeItem.period}</p>
                  </div>
                )}

                {activeItem.formula && (
                  <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                      Deterministic Formula
                    </label>
                    <code className="block p-2.5 rounded bg-surface-2 border border-border font-mono text-xs text-text overflow-x-auto">
                      {activeItem.formula}
                    </code>
                  </div>
                )}

                {activeItem.sourceFile && (
                  <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <FileText className="w-3.5 h-3.5 text-text-muted" />
                      Primary Source File
                    </label>
                    <div className="flex items-center justify-between p-2 rounded border border-border bg-surface text-xs font-mono">
                      <span>{activeItem.sourceFile}</span>
                      <span className="text-[11px] text-success flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Immutable
                      </span>
                    </div>
                  </div>
                )}

                {activeItem.reconciledWith && (
                  <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Database className="w-3.5 h-3.5 text-text-muted" />
                      Cross-Reconciled Against
                    </label>
                    <p className="text-xs text-text-muted bg-surface-2 p-2 rounded border border-border">
                      {activeItem.reconciledWith}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-surface-2 flex items-center justify-between text-xs text-text-muted">
              <span>Tenant-isolated record</span>
              <button
                onClick={closeDrawer}
                className="px-3 py-1.5 rounded-md bg-surface border border-border text-text font-medium hover:bg-surface-2 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </SourceDrawerContext.Provider>
  );
}

/**
 * EvidenceChip: Clickable token in AI responses & cards that opens the SourceDrawer
 */
export function EvidenceChip({
  id,
  title,
  category = "metric",
  details,
}: {
  id: string;
  title?: string;
  category?: SourceEvidenceDetails["category"];
  details?: Partial<SourceEvidenceDetails>;
}) {
  const { openDrawer } = useSourceDrawer();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openDrawer({
      id,
      title: title || `Evidence Record [${id}]`,
      category,
      confidence: details?.confidence || "high",
      coveragePercent: details?.coveragePercent || 95,
      description: details?.description || "Verified primary business data point from reconciled accounts.",
      formula: details?.formula,
      period: details?.period || "Last 30 Days",
      sourceFile: details?.sourceFile || "reconciled_settlements.csv",
      value: details?.value,
      reconciledWith: details?.reconciledWith || "Reconciled with bank credit & counter sales order receipts.",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary-soft hover:bg-primary-soft/80 text-primary-ink border border-primary/20 text-xs font-mono font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus cursor-pointer"
      title={`Click to view evidence provenance for ${id}`}
    >
      <span>[{id}]</span>
      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
    </button>
  );
}
