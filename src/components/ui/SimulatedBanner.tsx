"use client";

import React from "react";
import { Info, Lock } from "lucide-react";

export function SimulatedBanner({ className = "" }: { className?: string }) {
  return (
    <div
      role="alert"
      className={`rounded-lg bg-info-soft border border-info/30 p-3 flex items-start sm:items-center gap-3 text-xs text-info ${className}`}
    >
      <div className="w-5 h-5 rounded-full bg-info/10 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
        <Lock className="w-3.5 h-3.5 text-info" />
      </div>
      <div className="flex-1">
        <strong className="font-semibold uppercase tracking-wider text-[11px] mr-1">
          SIMULATED.
        </strong>
        <span>
          No real money is collected, lent or paid out in this version. All offers, commitments, and repayment calculations are simulated for testing and demonstration purposes only.
        </span>
      </div>
    </div>
  );
}
