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
  Trash2,
  Check,
  Eye,
  Activity,
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Settings & Preferences
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-surface-2 border border-border text-text-muted">
            Appearance & System
          </span>
        </div>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Theme customization, adaptive schedule, data privacy, and demo tools.
        </p>
      </div>

      {toast && (
        <div className="p-3 rounded-lg bg-success-soft text-success border border-success/30 text-xs font-semibold animate-in fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="border-b border-border flex items-center gap-6 text-sm">
        <button
          type="button"
          onClick={() => setActiveTab("appearance")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "appearance"
              ? "border-primary text-primary-ink"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Appearance & Theme</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("business")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "business"
              ? "border-primary text-primary-ink"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Business Identity</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("privacy")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "privacy"
              ? "border-primary text-primary-ink"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Data, Privacy & Demo Reset</span>
        </button>
      </div>

      {/* Tab 1: Appearance & Theme (Required by Section 6) */}
      {activeTab === "appearance" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Segmented Control */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-text">Theme Mode</h3>
              <p className="text-xs text-text-muted">
                Select your preferred visual style or let it adapt automatically to your local time.
              </p>
            </div>

            {/* 3-Option Segmented Control */}
            <div
              role="radiogroup"
              aria-label="Theme mode"
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1 rounded-xl bg-surface-2 border border-border"
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
                    className={`p-3 rounded-lg text-left transition-all duration-fast flex flex-col justify-between space-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                      isSelected
                        ? "bg-surface text-primary-ink shadow-sm border border-border/80 font-semibold"
                        : "text-text hover:bg-surface/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-5 h-5 ${isSelected ? "text-primary-ink" : "text-text-muted"}`} />
                      {isSelected && <Check className="w-4 h-4 text-primary-ink" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{opt.label}</div>
                      <div className="text-[11px] text-text-muted font-normal mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Adaptive Mode Schedule Adjuster */}
            {mode === "adaptive" && (
              <div className="p-4 rounded-xl bg-surface-2/60 border border-border space-y-3 pt-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="font-semibold text-xs text-text flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>Adaptive Schedule (Local Clock)</span>
                  </div>
                  {/* Live Status Preview */}
                  <span className="text-xs font-mono font-bold text-accent px-2 py-0.5 rounded bg-surface border border-border">
                    Right now: {resolvedTheme === "dark" ? "Dark" : "Light"} • Switches at {nextSwitchTime}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <label className="text-text-muted block mb-1 font-medium">Light mode starts at:</label>
                    <input
                      type="time"
                      value={schedule.lightStart}
                      onChange={(e) => setSchedule({ lightStart: e.target.value })}
                      className="p-2 rounded-lg border border-border bg-surface text-text font-mono font-semibold text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    />
                  </div>
                  <div>
                    <label className="text-text-muted block mb-1 font-medium">Dark mode starts at:</label>
                    <input
                      type="time"
                      value={schedule.darkStart}
                      onChange={(e) => setSchedule({ darkStart: e.target.value })}
                      className="p-2 rounded-lg border border-border bg-surface text-text font-mono font-semibold text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-text-muted leading-tight">
                  No location permission required. Switches automatically across boundary times without page reloading.
                </p>
              </div>
            )}
          </div>

          {/* Accessibility & Motion Settings */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-text">Motion & Accessibility</h3>
              <p className="text-xs text-text-muted">
                Fine-tune transitions and animation speed for accessibility comfort.
              </p>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-2/60 border border-border">
              <div className="space-y-0.5">
                <span className="font-semibold text-xs text-text">Reduce Motion</span>
                <p className="text-xs text-text-muted">
                  Disables page slides and number count-ups in favor of instant transitions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  reduceMotion ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform transform ${
                    reduceMotion ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Business Profile */}
      {activeTab === "business" && (
        <div className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm animate-in fade-in">
          <h3 className="font-bold text-base text-text">Active Business Details</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-text-muted block mb-1 font-medium">Business Name</label>
              <div className="p-2.5 rounded-lg border border-border bg-surface-2 font-semibold text-text">
                {activeBusiness.name}
              </div>
            </div>
            <div>
              <label className="text-text-muted block mb-1 font-medium">Category</label>
              <div className="p-2.5 rounded-lg border border-border bg-surface-2 font-medium text-text">
                {activeBusiness.categoryLabel}
              </div>
            </div>
            <div>
              <label className="text-text-muted block mb-1 font-medium">Address</label>
              <div className="p-2.5 rounded-lg border border-border bg-surface-2 font-medium text-text">
                {activeBusiness.address}, {activeBusiness.city}, {activeBusiness.state} - {activeBusiness.pincode}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Privacy & Demo Reset */}
      {activeTab === "privacy" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-text">Data Privacy & Sovereignty</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Every micro-business owns its financial records. You can download your complete tenant records or wipe synthetic modifications at any time.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-2 text-xs font-semibold text-text transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-text-muted" />
                <span>Export Tenant Records (JSON)</span>
              </button>
            </div>
          </div>

          {/* Reset Demo Data Button (Section 11) */}
          <div className="rounded-xl border border-warning/40 bg-warning-soft/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-warning">
              <RotateCcw className="w-4 h-4" />
              <h4 className="font-bold text-sm">Reset Synthetic Demo Data</h4>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Resets all 3 demo businesses (Vidya Stationery, Scoops & Swirls, Chai & Chutney) back to the clean seed baseline. Unmatched exceptions and recommendations will re-appear for demonstration.
            </p>
            <button
              type="button"
              onClick={handleResetData}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-warning text-white text-xs font-bold hover:bg-warning/90 shadow-sm transition-transform active:scale-[0.98]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Synthetic Data</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
