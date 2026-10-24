"use client";

import React, { useState } from "react";
import { useTheme, ThemeMode } from "@/components/theme/ThemeProvider";
import { useBusiness } from "@/components/shell/BusinessContext";
import { db } from "@/lib/db";
import {
  Sun,
  Moon,
  Clock,
  RotateCcw,
  ShieldCheck,
  Download,
  Check,
  Sliders,
  Settings as SettingsIcon,
} from "lucide-react";

export default function SettingsPage() {
  const {
    mode,
    resolvedTheme,
    schedule,
    reduceMotion,
    setMode,
    setSchedule,
    setReduceMotion,
    nextSwitchTime,
  } = useTheme();

  const { activeBusiness } = useBusiness();
  const [activeTab, setActiveTab] = useState<"appearance" | "business" | "privacy">("appearance");
  const [toast, setToast] = useState<string | null>(null);

  const handleResetData = () => {
    if (confirm("Reset all synthetic business data back to clean baseline state?")) {
      db.reset();
      setToast("Synthetic demo data reset to clean baseline.");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db.getBusinessById(activeBusiness.id), null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `${activeBusiness.slug}_tenant_export.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    setToast("Business tenant records exported.");
    setTimeout(() => setToast(null), 3000);
  };

  const options: { id: ThemeMode; label: string; icon: typeof Sun; desc: string }[] = [
    { id: "light", label: "Light", icon: Sun, desc: "Always use the light theme" },
    { id: "dark", label: "Dark", icon: Moon, desc: "Always use the dark theme" },
    { id: "adaptive", label: "Adaptive", icon: Clock, desc: "Switch by local clock schedule" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] font-semibold text-text tracking-tight">
            Settings & Preferences
          </h1>
          <span className="text-[11px] px-2 py-0.5 rounded-md font-medium border border-border bg-surface-2 text-text-muted">
            Appearance & System
          </span>
        </div>
        <p className="text-[12.5px] text-text-muted mt-0.5">
          Theme customization, adaptive schedule, data privacy, and demo tools.
        </p>
      </div>

      {toast && (
        <div className="p-3 rounded-md border border-success/30 bg-success-soft text-success text-[12.5px] font-medium">
          ✓ {toast}
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="border-b border-border flex items-center gap-0 text-[13px]">
        {[
          { id: "appearance" as const, label: "Appearance & Theme", icon: Sliders },
          { id: "business"   as const, label: "Business Identity",  icon: SettingsIcon },
          { id: "privacy"    as const, label: "Data & Privacy",      icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 -mb-px font-medium transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Appearance & Theme */}
      {activeTab === "appearance" && (
        <div className="space-y-5">
          {/* Theme mode selector */}
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-[14px] text-text">Theme Mode</h3>
              <p className="text-[12px] text-text-muted mt-0.5">
                Select your preferred visual style or let it adapt automatically to your local time.
              </p>
            </div>

            <div
              role="radiogroup"
              aria-label="Theme mode"
              className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1 rounded-lg bg-surface-2 border border-border"
            >
              {options.map((opt) => {
                const Icon = opt.icon;
                const isSelected = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      setMode(opt.id);
                      setToast(`Theme set to ${opt.label} mode.`);
                      setTimeout(() => setToast(null), 2500);
                    }}
                    className={`p-3 rounded-md text-left transition-all flex flex-col gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                      isSelected
                        ? "bg-surface border border-border shadow-sm"
                        : "text-text hover:bg-surface/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-primary" : "text-text-muted"}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                    </div>
                    <div>
                      <div className={`text-[13px] font-semibold ${isSelected ? "text-text" : "text-text-muted"}`}>{opt.label}</div>
                      <div className="text-[11px] text-text-muted mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Adaptive schedule adjuster */}
            {mode === "adaptive" && (
              <div className="p-4 rounded-lg bg-surface-2 border border-border space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-[13px] font-medium text-text flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    Adaptive Schedule (Local Clock)
                  </div>
                  <span className="text-[11px] font-mono text-accent px-2 py-0.5 rounded-md border border-border bg-surface">
                    Now: {resolvedTheme === "dark" ? "Dark" : "Light"} · Switches at {nextSwitchTime}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                  <div>
                    <label className="text-text-muted block mb-1 font-medium">Light mode starts:</label>
                    <input
                      type="time"
                      value={schedule.lightStart}
                      onChange={(e) => setSchedule({ lightStart: e.target.value })}
                      className="px-3 py-2 rounded-md border border-border bg-surface text-text font-mono text-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    />
                  </div>
                  <div>
                    <label className="text-text-muted block mb-1 font-medium">Dark mode starts:</label>
                    <input
                      type="time"
                      value={schedule.darkStart}
                      onChange={(e) => setSchedule({ darkStart: e.target.value })}
                      className="px-3 py-2 rounded-md border border-border bg-surface text-text font-mono text-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-text-muted">
                  No location permission required. Switches automatically without page reloading.
                </p>
              </div>
            )}
          </div>

          {/* Motion & Accessibility */}
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-[14px] text-text">Motion & Accessibility</h3>
              <p className="text-[12px] text-text-muted mt-0.5">
                Fine-tune transitions and animation speed for accessibility comfort.
              </p>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-md bg-surface-2 border border-border">
              <div>
                <span className="font-medium text-[13px] text-text block">Reduce Motion</span>
                <p className="text-[11.5px] text-text-muted mt-0.5">
                  Disables page slides and transitions in favor of instant renders.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReduceMotion(!reduceMotion)}
                aria-checked={reduceMotion}
                role="switch"
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                  reduceMotion ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform absolute top-[3px] ${
                    reduceMotion ? "translate-x-[22px]" : "translate-x-[3px]"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Business Profile */}
      {activeTab === "business" && (
        <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
          <h3 className="font-semibold text-[14px] text-text">Active Business Details</h3>
          <div className="space-y-3 text-[12.5px]">
            {[
              { label: "Business Name", value: activeBusiness.name },
              { label: "Category",      value: activeBusiness.categoryLabel },
              { label: "Address",       value: `${activeBusiness.address}, ${activeBusiness.city}, ${activeBusiness.state} — ${activeBusiness.pincode}` },
            ].map((row) => (
              <div key={row.label}>
                <label className="text-[11px] font-medium text-text-muted block mb-1">{row.label}</label>
                <div className="px-3 py-2 rounded-md border border-border bg-surface-2 font-medium text-text">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Privacy & Demo Reset */}
      {activeTab === "privacy" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
            <h3 className="font-semibold text-[14px] text-text">Data Privacy & Sovereignty</h3>
            <p className="text-[12.5px] text-text-muted leading-relaxed">
              Every micro-business owns its financial records. Download your complete tenant records or wipe synthetic modifications at any time.
            </p>
            <div>
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-border hover:bg-surface-2 text-[12.5px] font-medium text-text transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-text-muted" />
                Export Tenant Records (JSON)
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-warning/30 bg-warning-soft/30 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-warning" />
              <h4 className="font-semibold text-[14px] text-text">Reset Synthetic Demo Data</h4>
            </div>
            <p className="text-[12.5px] text-text-muted leading-relaxed">
              Resets all 3 demo businesses back to the clean seed baseline. Unmatched exceptions and recommendations will re-appear for demonstration.
            </p>
            <button
              type="button"
              onClick={handleResetData}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-warning/40 text-warning text-[12.5px] font-semibold hover:bg-warning-soft transition-colors active:scale-[0.98]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Synthetic Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
