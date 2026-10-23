"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Info, X, ShieldCheck } from "lucide-react";
import { formatPaise, formatPercent } from "@/lib/formatters";
import { ConfidenceBadge, EvidenceTag } from "./ConfidenceBadge";
import { MetricSnapshot } from "@/lib/types";

export function MetricCard({
  metric,
  className = "",
}: {
  metric: MetricSnapshot;
  className?: string;
}) {
  const [showInfo, setShowInfo] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const isPositive = metric.changePercent >= 0;

  // Close info on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowInfo(false);
      }
    }
    if (showInfo) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showInfo]);

  // Format the big value depending on metric unit
  const formattedValue =
    metric.unit === "paise"
      ? formatPaise(metric.value)
      : metric.unit === "percent"
      ? `${metric.value.toFixed(1)}%`
      : metric.value.toLocaleString("en-IN");

  return (
    <div
      tabIndex={0}
      className={`relative rounded-xl border border-border bg-surface p-5 shadow-sm hover:shadow-md transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus group ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-medium text-text-muted truncate">{metric.name}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <EvidenceTag type={metric.tagType} />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }}
            aria-label={`What does ${metric.name} mean?`}
            className="w-6 h-6 rounded flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Big Number + Sparkline */}
      <div className="flex items-baseline justify-between gap-4 mt-1">
        <div className="text-2xl sm:text-3xl font-semibold text-text tabular-nums tracking-tight">
          {formattedValue}
        </div>

        {/* Tiny SVG Sparkline */}
        {metric.sparklineData && metric.sparklineData.length > 1 && (
          <div className="w-16 h-8 shrink-0">
            <svg viewBox="0 0 70 30" className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke={isPositive ? "var(--primary)" : "var(--danger)"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={metric.sparklineData
                  .map((val, idx) => {
                    const min = Math.min(...metric.sparklineData!);
                    const max = Math.max(...metric.sparklineData!);
                    const range = max - min || 1;
                    const x = (idx / (metric.sparklineData!.length - 1)) * 68 + 1;
                    const y = 28 - ((val - min) / range) * 24;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
            </svg>
          </div>
        )}
      </div>

      {/* Bottom Trend & Confidence Indicator */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border/60 text-xs">
        <div
          className={`flex items-center gap-1 font-medium tabular-nums ${
            isPositive ? "text-success" : "text-danger"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{formatPercent(metric.changePercent)}</span>
          <span className="text-text-muted font-normal ml-0.5">vs prior period</span>
        </div>

        <ConfidenceBadge
          confidence={metric.confidence}
          coveragePercent={metric.sourceCoveragePercent}
        />
      </div>

      {/* Explanatory Popover (Definition, Formula, Period, Coverage, Confidence) */}
      {showInfo && (
        <div
          ref={popoverRef}
          role="tooltip"
          className="absolute left-0 right-0 top-full mt-2 p-4 rounded-lg bg-surface border border-border shadow-md z-30 text-xs text-text space-y-2.5 animate-in fade-in zoom-in-95 duration-fast"
        >
          <div className="flex items-center justify-between border-b border-border pb-1.5 font-semibold text-text">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Metric Definition & Provenance
            </span>
            <button
              onClick={() => setShowInfo(false)}
              className="text-text-muted hover:text-text"
              aria-label="Close metric details"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <span className="font-semibold text-text-muted block uppercase text-[10px] tracking-wider mb-0.5">
              Meaning
            </span>
            <p className="leading-relaxed text-text">{metric.definition}</p>
          </div>

          <div>
            <span className="font-semibold text-text-muted block uppercase text-[10px] tracking-wider mb-0.5">
              Deterministic Formula
            </span>
            <code className="block bg-surface-2 p-1.5 rounded font-mono text-[11px] text-text border border-border">
              {metric.formula}
            </code>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border text-[11px]">
            <div>
              <span className="text-text-muted block">Period:</span>
              <span className="font-medium">{metric.period}</span>
            </div>
            <div>
              <span className="text-text-muted block">Data Coverage:</span>
              <span className="font-medium tabular-nums">{metric.sourceCoveragePercent}% verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
