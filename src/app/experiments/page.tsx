"use client";

import React, { useState } from "react";
import { useBusiness } from "@/components/shell/BusinessContext";
import { db } from "@/lib/db";
import { ApprovalCard } from "@/components/ui/ApprovalCard";
import { formatPaise } from "@/lib/formatters";
import {
  Stethoscope,
  Sparkles,
  TrendingUp,
  Layers,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Plus,
} from "lucide-react";
import { Experiment, ExperimentStage } from "@/lib/types";

export default function ExperimentsPage() {
  const { activeBusiness } = useBusiness();
  const [recommendations, setRecommendations] = useState(db.getRecommendations(activeBusiness.id));
  const [experiments, setExperiments] = useState(db.getExperiments(activeBusiness.id));
  const [toast, setToast] = useState<string | null>(null);

  const handleApprove = (recId: string) => {
    db.updateRecommendationStatus(activeBusiness.id, recId, "approved");
    setRecommendations(db.getRecommendations(activeBusiness.id));
    setExperiments(db.getExperiments(activeBusiness.id));
    setToast("Recommendation approved! Added to active Experiments Kanban board.");
    setTimeout(() => setToast(null), 4000);
  };

  const handleDecline = (recId: string) => {
    db.updateRecommendationStatus(activeBusiness.id, recId, "declined");
    setRecommendations(db.getRecommendations(activeBusiness.id));
    setToast("Recommendation dismissed.");
    setTimeout(() => setToast(null), 3000);
  };

  const handleStageChange = (expId: string, newStage: ExperimentStage, decision?: Experiment["decision"]) => {
    db.updateExperimentStage(activeBusiness.id, expId, newStage, decision);
    setExperiments(db.getExperiments(activeBusiness.id));
  };

  const kanbanColumns: { stage: ExperimentStage; label: string; desc: string }[] = [
    { stage: "baseline", label: "1. Baseline", desc: "Setting pre-experiment metric" },
    { stage: "running", label: "2. Running", desc: "Execution underway" },
    { stage: "result", label: "3. Measured Result", desc: "Comparing outcome vs baseline" },
    { stage: "decision", label: "4. Keep / Stop", desc: "Owner operational verdict" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Business Doctor & Experiments
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-surface-2 border border-border text-text-muted">
            Hypothesis Testing
          </span>
        </div>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Ground-truth growth actions and measured outcome tracking for <strong>{activeBusiness.name}</strong>
        </p>
      </div>

      {toast && (
        <div className="p-3 rounded-lg bg-success-soft text-success border border-success/30 text-xs font-semibold animate-in fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Section 1: Pending Doctor Recommendations (ApprovalCards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Diagnostic Recommendations</span>
            </h2>
            <p className="text-xs text-text-muted">
              Ranked actions requiring your explicit approval before execution.
            </p>
          </div>
          <span className="text-xs font-mono text-text-muted">
            {recommendations.length} proposed
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <ApprovalCard
              key={rec.id}
              recommendation={rec}
              onApprove={handleApprove}
              onDecline={handleDecline}
            />
          ))}
        </div>
      </div>

      {/* Section 2: Experiment Kanban Board */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div>
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary-ink" />
            <span>Active Experiment Board</span>
          </h2>
          <p className="text-xs text-text-muted">
            Track Baseline → Execution → Result → Decision. No assumptions without measurement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const colExperiments = experiments.filter((e) => e.stage === col.stage);
            return (
              <div
                key={col.stage}
                className="rounded-xl border border-border bg-surface-2/40 p-4 space-y-3 flex flex-col justify-between min-h-[380px]"
              >
                <div className="space-y-3">
                  {/* Column Header */}
                  <div className="border-b border-border pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xs text-text">{col.label}</h3>
                      <span className="text-[10px] text-text-muted">{col.desc}</span>
                    </div>
                    <span className="w-5 h-5 rounded-full bg-surface text-text font-mono font-bold text-[11px] flex items-center justify-center border border-border">
                      {colExperiments.length}
                    </span>
                  </div>

                  {/* Experiment Cards */}
                  <div className="space-y-2.5">
                    {colExperiments.map((exp) => (
                      <div
                        key={exp.id}
                        className="rounded-lg border border-border bg-surface p-3 space-y-2.5 shadow-sm text-xs hover:border-primary/40 transition-colors"
                      >
                        <div className="font-bold text-text text-xs leading-snug">
                          {exp.title}
                        </div>

                        {/* Metric Comparison */}
                        <div className="p-2 rounded bg-surface-2 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-text-muted">{exp.baselineMetric}:</span>
                            <span className="font-bold text-text tabular-nums">
                              {exp.currentValue} {exp.unit}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-text-muted">
                            <span>Baseline: {exp.baselineValue} {exp.unit}</span>
                            <span className="font-semibold text-accent">
                              Target: {exp.targetValue} {exp.unit}
                            </span>
                          </div>
                        </div>

                        {/* Budget & Spend */}
                        {exp.budgetCapPaise > 0 && (
                          <div className="text-[11px] text-text-muted flex items-center justify-between">
                            <span>Budget Cap:</span>
                            <span className="font-semibold tabular-nums text-text">
                              {formatPaise(exp.budgetCapPaise)}
                            </span>
                          </div>
                        )}

                        {/* Stage Progress Controls */}
                        <div className="pt-2 border-t border-border flex items-center justify-between">
                          {col.stage === "running" && (
                            <button
                              type="button"
                              onClick={() => handleStageChange(exp.id, "result")}
                              className="text-[11px] font-semibold text-primary-ink hover:underline flex items-center gap-1"
                            >
                              <span>Measure Result</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {col.stage === "result" && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleStageChange(exp.id, "decision", "keep")}
                                className="px-2 py-1 rounded bg-success-soft text-success text-[10px] font-bold border border-success/30"
                              >
                                Keep Policy
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStageChange(exp.id, "decision", "stop")}
                                className="px-2 py-1 rounded bg-danger-soft text-danger text-[10px] font-bold border border-danger/30"
                              >
                                Stop
                              </button>
                            </div>
                          )}

                          {col.stage === "decision" && (
                            <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-2 text-text">
                              Verdict: {exp.decision?.toUpperCase() || "RECORDED"}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-text-muted text-center pt-2">
                  Audited outcome logging active
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
