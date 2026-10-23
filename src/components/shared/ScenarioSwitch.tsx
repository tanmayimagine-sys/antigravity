"use client";

import React from "react";

export type ScenarioType = "conservative" | "base" | "optimistic";

export function ScenarioSwitch({
  activeScenario,
  onChange,
  className = "",
}: {
  activeScenario: ScenarioType;
  onChange: (scenario: ScenarioType) => void;
  className?: string;
}) {
  const scenarios: { id: ScenarioType; label: string; tag: string }[] = [
    { id: "conservative", label: "Conservative", tag: "Downside / Slow Month" },
    { id: "base", label: "Base Case", tag: "Expected Steady State" },
    { id: "optimistic", label: "Optimistic", tag: "High Semester Rush" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Growth and Rent Scenarios"
      className={`inline-flex rounded-lg p-1 bg-surface-2 border border-border ${className}`}
    >
      {scenarios.map((s) => {
        const isSelected = activeScenario === s.id;
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(s.id)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-fast flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
              isSelected
                ? "bg-surface text-primary-ink shadow-sm border border-border/80"
                : "text-text-muted hover:text-text"
            }`}
          >
            <span>{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}
