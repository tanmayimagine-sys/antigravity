"use client";

import React, { useState } from "react";
import { useBusiness } from "@/components/shell/BusinessContext";
import { db } from "@/lib/db";
import { ScenarioSwitch, ScenarioType } from "@/components/shared/ScenarioSwitch";
import { formatPaise } from "@/lib/formatters";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import {
  MapPin,
  Building2,
  CheckSquare,
  Square,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
  ShieldCheck,
  Check,
  Sparkles,
  MessageSquare,
  Users,
  Compass,
} from "lucide-react";
import { LocationCandidate } from "@/lib/types";

export default function LocationExplorerPage() {
  const { activeBusiness } = useBusiness();
  const [candidates, setCandidates] = useState<LocationCandidate[]>(
    db.getLocations(activeBusiness.id)
  );
  const [selectedCandidate, setSelectedCandidate] = useState<LocationCandidate>(
    candidates[0] || db.getLocations("biz_stationery")[0]
  );
  const [scenario, setScenario] = useState<ScenarioType>("base");
  const [toast, setToast] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiRationale, setAiRationale] = useState<string | null>(null);

  // Review Themes & Reviews
  const reviewThemes = db.getReviewThemes(activeBusiness.id);

  const handleToggleChecklist = (checkId: string) => {
    db.toggleLocationChecklistItem(activeBusiness.id, selectedCandidate.id, checkId);
    const updatedLocs = db.getLocations(activeBusiness.id);
    const updated = updatedLocs.find((l) => l.id === selectedCandidate.id);
    if (updated) setSelectedCandidate({ ...updated });
    setToast("Checklist item updated and persisted.");
    setTimeout(() => setToast(null), 2500);
  };

  const handleSuggestLocation = async (customGoal?: string) => {
    setIsGenerating(true);
    setToast("Central AI is analyzing Google reviews, customer pain points, and catchment demographics...");
    try {
      const res = await fetch("/api/locations/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: activeBusiness.id,
          customGoal: customGoal || "Suggest high-demand expansion near target student/office hubs.",
        }),
      });

      if (!res.ok) throw new Error("Location suggestion failed");
      const data = await res.json();

      if (data.candidate) {
        setCandidates(db.getLocations(activeBusiness.id));
        setSelectedCandidate(data.candidate);
        setAiRationale(data.rationale);
        setToast(`New location candidate added: ${data.candidate.areaName}!`);
        setTimeout(() => setToast(null), 4000);
      }
    } catch {
      setToast("Could not generate location. Using deterministic fallback.");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Scenario revenue and net projection
  const projectedRevenue =
    scenario === "conservative"
      ? selectedCandidate.conservativeRevenuePaise
      : scenario === "optimistic"
      ? selectedCandidate.optimisticRevenuePaise
      : selectedCandidate.baseRevenuePaise;

  const projectedNet =
    scenario === "conservative"
      ? selectedCandidate.conservativeNetPaise
      : scenario === "optimistic"
      ? selectedCandidate.optimisticNetPaise
      : selectedCandidate.baseNetPaise;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              Location Explorer
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-surface-2 border border-border text-text-muted">
              Expansion Feasibility
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Evaluate unit economics and candidate sites for <strong>{activeBusiness.name}</strong>
          </p>
        </div>

        {/* Suggest New Location with AI Button */}
        <button
          type="button"
          onClick={() => handleSuggestLocation()}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-sm disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
          <span>{isGenerating ? "Analyzing Reviews & Demographics..." : "Suggest New Location with Gemini AI"}</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 rounded-lg bg-success-soft text-success border border-success/30 text-xs font-semibold animate-in fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Target Audience & Google Reviews Insights Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary-soft/30 p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-primary-ink font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Target Audience & Google Reviews Intelligence</span>
          </div>
          <span className="text-[11px] font-semibold text-accent flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            Synthesized from {reviewThemes.length} customer review themes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
            <span className="text-text-muted block font-semibold text-[10px] uppercase">
              Target Audience
            </span>
            <p className="text-text font-medium leading-snug">
              {activeBusiness.category === "stationery"
                ? "Engineering students, thesis researchers, campus competitive exam aspirants."
                : activeBusiness.category === "ice_cream"
                ? "Young adults, couples, weekend evening diners in commercial high-street clusters."
                : "Morning commuters, tech park workers, and casual breakfast groups."}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
            <span className="text-text-muted block font-semibold text-[10px] uppercase">
              Reviews Pain Point Bottleneck
            </span>
            <p className="text-warning font-medium leading-snug">
              {reviewThemes.find((t) => t.sentiment === "negative")?.theme ||
                "Peak-hour counter queue congestion during 1 PM - 2 PM."}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
            <span className="text-text-muted block font-semibold text-[10px] uppercase">
              AI Location Strategy
            </span>
            <p className="text-accent font-medium leading-snug">
              Open satellite express outlet within 5 km near sister college campuses to offload queue overflow.
            </p>
          </div>
        </div>

        {aiRationale && (
          <div className="p-3 rounded-lg bg-accent-soft border border-accent/40 text-xs text-text space-y-1 animate-in fade-in">
            <div className="font-bold text-accent flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Recommendation Rationale:</span>
            </div>
            <p className="text-text-muted leading-relaxed">{aiRationale}</p>
          </div>
        )}
      </div>

      {/* Strict Compliance Warning on Footfall */}
      <div className="p-3.5 rounded-xl bg-surface-2 border border-border flex items-start gap-3 text-xs text-text-muted">
        <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text block font-semibold mb-0.5">
            Honest Footfall Standard
          </strong>
          <span>
            Exact pedestrian footfall and competitor revenues cannot be measured without physical counter sensors. All candidates strictly display <strong>"Footfall: not measured"</strong> and rely solely on verified rent assumptions and target student catchment indicators.
          </span>
        </div>
      </div>

      {/* Main Grid: Candidate Site Selector + Scenario Modeling */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Sites List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
            Candidate Expansion Sites ({candidates.length})
          </label>
          {candidates.map((loc) => {
            const isSelected = loc.id === selectedCandidate.id;
            return (
              <div
                key={loc.id}
                onClick={() => {
                  setSelectedCandidate(loc);
                  setAiRationale(null);
                }}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? "border-primary bg-primary-soft/30 shadow-sm"
                    : "border-border bg-surface hover:bg-surface-2"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="font-bold text-text text-sm">{loc.areaName}</div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-surface-2 text-text font-semibold">
                    {loc.distanceKm} km away
                  </span>
                </div>

                <div className="text-text-muted leading-tight">
                  {loc.nearbyCollegesOffices}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border text-[11px]">
                  <span className="text-text-muted">Monthly Rent:</span>
                  <span className="font-bold text-text tabular-nums">
                    {formatPaise(loc.monthlyRentPaise)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-muted">Footfall Metric:</span>
                  <span className="font-mono text-warning font-semibold">
                    {loc.footfallLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Candidate Detail & Scenario Modeling (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-border bg-surface p-5 space-y-6 shadow-sm">
          {/* Header of selected candidate */}
          <div className="flex items-start sm:items-center justify-between gap-3 border-b border-border pb-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-text">{selectedCandidate.areaName}</h3>
                <ConfidenceBadge confidence={selectedCandidate.confidence} />
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Catchment: {selectedCandidate.nearbyCollegesOffices}
              </p>
            </div>

            {/* Scenario Switch Tabs */}
            <ScenarioSwitch
              activeScenario={scenario}
              onChange={(s) => setScenario(s)}
            />
          </div>

          {/* Unit Economics Projection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
              <span className="text-xs text-text-muted block">Projected Monthly Revenue</span>
              <div className="text-xl font-bold text-text tabular-nums">
                {formatPaise(projectedRevenue)}
              </div>
              <span className="text-[11px] text-accent font-medium capitalize">{scenario} case</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
              <span className="text-xs text-text-muted block">Estimated Net Cash Flow</span>
              <div className="text-xl font-bold text-success tabular-nums">
                {formatPaise(projectedNet)}
              </div>
              <span className="text-[11px] text-text-muted">After lease & staff costs</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
              <span className="text-xs text-text-muted block">Capex Break-Even Horizon</span>
              <div className="text-xl font-bold text-primary-ink tabular-nums">
                {selectedCandidate.breakEvenMonths} Months
              </div>
              <span className="text-[11px] text-text-muted">Setup: {formatPaise(selectedCandidate.estimatedCapexPaise)}</span>
            </div>
          </div>

          {/* Field-Validation Checklist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-text flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary-ink" />
                <span>On-Site Field Validation Checklist</span>
              </h4>
              <span className="text-xs font-mono text-text-muted">
                {selectedCandidate.fieldVisitChecklist.filter((c) => c.done).length} of{" "}
                {selectedCandidate.fieldVisitChecklist.length} verified
              </span>
            </div>

            <div className="space-y-2">
              {selectedCandidate.fieldVisitChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                    item.done
                      ? "bg-success-soft/20 border-success/30 text-text"
                      : "bg-surface-2 border-border text-text hover:bg-surface-2/80"
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-primary shrink-0 focus:outline-none"
                    aria-label={`Toggle ${item.task}`}
                  >
                    {item.done ? (
                      <CheckSquare className="w-4 h-4 text-success" />
                    ) : (
                      <Square className="w-4 h-4 text-text-muted" />
                    )}
                  </button>
                  <span className={item.done ? "line-through text-text-muted" : "font-medium"}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
