"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useBusiness } from "./BusinessContext";
import { Sparkles, ChevronRight, X, Check, ArrowRight } from "lucide-react";

export function GuidedDemoTour() {
  const {
    guidedDemoActive,
    setGuidedDemoActive,
    currentDemoStep,
    setCurrentDemoStep,
    setActiveBusinessId,
  } = useBusiness();
  const router = useRouter();

  if (!guidedDemoActive) return null;

  const demoSteps = [
    {
      step: 1,
      title: "1. Owner Dashboard & Verified Health",
      route: "/dashboard",
      bizId: "biz_stationery",
      instruction:
        "We are inspecting Vidya Stationery & Xerox. Observe the 4 MetricCards with exact formulas, the verified sales charts, hero product rankings, and the explainable Business Health Profile.",
      actionLabel: "Next: Go to Data Centre",
      nextRoute: "/data-centre",
    },
    {
      step: 2,
      title: "2. Data Ingestion & Correction Queue",
      route: "/data-centre",
      bizId: "biz_stationery",
      instruction:
        "See how messy merchant statements & OCR bills are parsed. Low-confidence fields appear in the Correction Queue with side-by-side editing before entering financial records.",
      actionLabel: "Next: Go to Reconciliation",
      nextRoute: "/reconciliation",
    },
    {
      step: 3,
      title: "3. Deterministic Reconciliation & Exception Queue",
      route: "/reconciliation",
      bizId: "biz_stationery",
      instruction:
        "Deterministic reconciliation matches POS orders to bank credits within tolerances. Notice duplicate detection and the split view Exception Queue to resolve unmatched bulk transfers.",
      actionLabel: "Next: Ask Central AI",
      nextRoute: "/ai-workspace",
    },
    {
      step: 4,
      title: "4. Central AI & Ground-Truth Evidence Chips",
      route: "/ai-workspace",
      bizId: "biz_stationery",
      instruction:
        "Central AI answers with strict evidence citations. Click any [M-201] or [rec_stat_01] chip to open the SourceDrawer showing the raw record, period, and confidence score.",
      actionLabel: "Next: Review Doctor Recommendations",
      nextRoute: "/experiments",
    },
    {
      step: 5,
      title: "5. Doctor Approval & Growth Experiments Board",
      route: "/experiments",
      bizId: "biz_stationery",
      instruction:
        "AI recommendations require explicit owner approval via ApprovalCards. Once approved, actions move to the 4-column Experiment Board (Baseline → Running → Result → Decision) with measured outcomes.",
      actionLabel: "Next: Location Explorer & Funding",
      nextRoute: "/location",
    },
    {
      step: 6,
      title: "6. Location Scenarios & Simulated Funding Cap",
      route: "/location",
      bizId: "biz_stationery",
      instruction:
        "Compare candidate locations across Conservative / Base / Optimistic scenarios with explicit 'Footfall: not measured' labels. Then visit Funding to inspect the deterministic repayment cap ledger.",
      actionLabel: "Finish Demo Tour",
      nextRoute: "/funding",
    },
  ];

  const currentStepData = demoSteps[currentDemoStep - 1] || demoSteps[0];

  const handleNext = () => {
    if (currentDemoStep < 6) {
      const nextStep = currentDemoStep + 1;
      setCurrentDemoStep(nextStep);
      const nextTarget = demoSteps[nextStep - 1];
      if (nextTarget.bizId) setActiveBusinessId(nextTarget.bizId);
      router.push(nextTarget.route);
    } else {
      router.push(currentStepData.nextRoute);
      setGuidedDemoActive(false);
      setCurrentDemoStep(1);
    }
  };

  const handleStepJump = (stepNum: number) => {
    setCurrentDemoStep(stepNum);
    const target = demoSteps[stepNum - 1];
    if (target.bizId) setActiveBusinessId(target.bizId);
    router.push(target.route);
  };

  return (
    <div
      role="region"
      aria-label="Guided Demo Tour Modal"
      className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:w-[440px] z-50 bg-surface border-2 border-primary/40 shadow-xl rounded-xl p-4 animate-in slide-in-from-bottom duration-base"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary-soft flex items-center justify-center text-primary-ink">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-ink">
            5-Minute Guided Demo ({currentDemoStep} of 6)
          </span>
        </div>
        <button
          onClick={() => setGuidedDemoActive(false)}
          className="text-text-muted hover:text-text p-1 rounded"
          aria-label="Exit tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between gap-1.5 py-3">
        {demoSteps.map((s) => (
          <button
            key={s.step}
            onClick={() => handleStepJump(s.step)}
            title={s.title}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              s.step === currentDemoStep
                ? "bg-primary"
                : s.step < currentDemoStep
                ? "bg-primary/40"
                : "bg-surface-2"
            }`}
          />
        ))}
      </div>

      {/* Body Content */}
      <div className="space-y-2 py-1">
        <h4 className="font-bold text-text text-sm">{currentStepData.title}</h4>
        <p className="text-xs text-text-muted leading-relaxed">
          {currentStepData.instruction}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
        <button
          onClick={() => setGuidedDemoActive(false)}
          className="text-xs text-text-muted hover:text-text px-2 py-1"
        >
          Skip Tour
        </button>
        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover transition-transform active:scale-[0.98]"
        >
          <span>{currentStepData.actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
