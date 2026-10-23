"use client";

import React from "react";
import { MetricConfidence, EvidenceTagType } from "@/lib/types";
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle, Sparkles, Check, Equal } from "lucide-react";

/**
 * ConfidenceBadge: Never relies on colour alone.
 * Displays explicit icon + text + optional reason tooltip.
 */
export function ConfidenceBadge({
  confidence,
  coveragePercent,
  className = "",
}: {
  confidence: MetricConfidence;
  coveragePercent?: number;
  className?: string;
}) {
  const configs: Record<
    MetricConfidence,
    { label: string; icon: typeof CheckCircle2; bg: string; text: string; border: string; tooltip: string }
  > = {
    high: {
      label: "High confidence",
      icon: CheckCircle2,
      bg: "bg-success-soft",
      text: "text-success",
      border: "border-success/30",
      tooltip: `Ground-truth verified. Reconciled with ${coveragePercent ?? 95}%+ source document coverage.`,
    },
    medium: {
      label: "Medium confidence",
      icon: AlertTriangle,
      bg: "bg-warning-soft",
      text: "text-warning",
      border: "border-warning/30",
      tooltip: `Cross-checked across ${coveragePercent ?? 80}% of records. Minor field estimates applied.`,
    },
    low: {
      label: "Low confidence",
      icon: AlertCircle,
      bg: "bg-danger-soft",
      text: "text-danger",
      border: "border-danger/30",
      tooltip: `Sparse data coverage (${coveragePercent ?? 50}%). Upload missing statements to verify.`,
    },
    insufficient: {
      label: "Insufficient data",
      icon: HelpCircle,
      bg: "bg-surface-2",
      text: "text-text-muted",
      border: "border-border",
      tooltip: "Missing primary financial records. Cannot calculate statistical confidence.",
    },
  };

  const c = configs[confidence] || configs.medium;
  const Icon = c.icon;

  return (
    <span
      title={c.tooltip}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border} ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{c.label}</span>
      {coveragePercent !== undefined && (
        <span className="opacity-75 font-normal tabular-nums">({coveragePercent}%)</span>
      )}
    </span>
  );
}

/**
 * EvidenceTag: 3 distinct visual styles
 * 1. Verified fact: Solid green check icon
 * 2. Estimate: Dashed amber outline with ≈ icon
 * 3. AI hypothesis: Sparkle icon, teal accent tint
 */
export function EvidenceTag({
  type,
  label,
  className = "",
}: {
  type: EvidenceTagType;
  label?: string;
  className?: string;
}) {
  if (type === "fact") {
    return (
      <span
        title="Verified against reconciled financial source documents"
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-success-soft text-success border border-success/30 ${className}`}
      >
        <Check className="w-3 h-3 stroke-[2.5]" />
        <span>{label || "Verified fact"}</span>
      </span>
    );
  }

  if (type === "estimate") {
    return (
      <span
        title="Calculated estimate based on industry benchmarks & historical moving averages"
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-warning-soft text-warning border border-dashed border-warning/50 ${className}`}
      >
        <Equal className="w-3 h-3" />
        <span>{label || "Estimate"}</span>
      </span>
    );
  }

  // Hypothesis
  return (
    <span
      title="AI scenario hypothesis; requires owner validation"
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-accent-soft text-accent border border-accent/40 ${className}`}
    >
      <Sparkles className="w-3 h-3 text-accent" />
      <span>{label || "AI hypothesis"}</span>
    </span>
  );
}
