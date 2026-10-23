"use client";

import React from "react";
import { Check } from "lucide-react";

export interface StepItem {
  number: number;
  label: string;
  description?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className = "",
}: {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex items-center justify-between">
        {/* Animated Background Progress Line */}
        <div className="absolute left-6 right-6 top-4 -translate-y-1/2 h-0.5 bg-border z-0">
          <div
            className="h-full bg-primary transition-all duration-slow"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((s) => {
          const isDone = s.number < currentStep;
          const isCurrent = s.number === currentStep;

          return (
            <div
              key={s.number}
              onClick={() => onStepClick && onStepClick(s.number)}
              className={`relative z-10 flex flex-col items-center group ${
                onStepClick ? "cursor-pointer" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-base ${
                  isDone
                    ? "bg-primary text-on-primary"
                    : isCurrent
                    ? "bg-surface border-2 border-primary text-primary-ink shadow-sm"
                    : "bg-surface-2 border border-border text-text-muted"
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.number}
              </div>

              <div className="text-center mt-2">
                <div
                  className={`text-xs font-semibold ${
                    isCurrent ? "text-primary-ink" : "text-text"
                  }`}
                >
                  {s.label}
                </div>
                {s.description && (
                  <div className="text-[10px] text-text-muted hidden sm:block">
                    {s.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
