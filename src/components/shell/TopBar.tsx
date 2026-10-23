"use client";

import React, { useState } from "react";
import { useBusiness } from "./BusinessContext";
import { ThemeQuickToggle } from "../theme/ThemeQuickToggle";
import {
  Store,
  ChevronDown,
  Calendar,
  Search,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Check,
} from "lucide-react";
import { KeyboardHelpDialog } from "./CommandPalette";

export function TopBar() {
  const {
    activeBusiness,
    setActiveBusinessId,
    allBusinesses,
    dateRange,
    setDateRange,
    setGuidedDemoActive,
  } = useBusiness();

  const [bizDropdownOpen, setBizDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const dateOptions = [
    "Last 7 Days",
    "Last 30 Days",
    "Quarter to Date (Q3 2026)",
    "Financial Year 2026-27",
  ];

  return (
    <>
      <header className="h-16 border-b border-border bg-surface px-4 flex items-center justify-between gap-3 sticky top-0 z-20">
        {/* Left: Business Switcher + Synthetic Demo Badge */}
        <div className="flex items-center gap-3">
          {/* Business Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setBizDropdownOpen(!bizDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-2 transition-colors text-left"
              aria-haspopup="true"
              aria-expanded={bizDropdownOpen}
            >
              <div className="w-6 h-6 rounded-md bg-primary-soft flex items-center justify-center text-primary-ink shrink-0">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-text leading-none">
                  {activeBusiness.name}
                </div>
                <div className="text-[10px] text-text-muted leading-tight mt-0.5">
                  {activeBusiness.categoryLabel}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted shrink-0" />
            </button>

            {bizDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-72 rounded-lg bg-surface border border-border shadow-md py-1 z-40 animate-in fade-in zoom-in-95 duration-fast"
                onMouseLeave={() => setBizDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border">
                  Select Demo Business (Tenant Isolated)
                </div>
                {allBusinesses.map((biz) => {
                  const isSelected = biz.id === activeBusiness.id;
                  return (
                    <button
                      key={biz.id}
                      onClick={() => {
                        setActiveBusinessId(biz.id);
                        setBizDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 px-3 py-2 text-left hover:bg-surface-2 transition-colors ${
                        isSelected ? "bg-primary-soft/50 font-semibold" : ""
                      }`}
                    >
                      <div className="w-6 h-6 rounded bg-surface-2 flex items-center justify-center text-text-muted mt-0.5 shrink-0">
                        <Store className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-text truncate">{biz.name}</div>
                        <div className="text-[10px] text-text-muted">{biz.city} • {biz.categoryLabel}</div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary-ink mt-0.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Persistent Synthetic Demo Data Chip */}
          <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-soft text-accent border border-accent/30 text-[11px] font-medium shrink-0">
            <ShieldCheck className="w-3 h-3 text-accent" />
            <span>Synthetic demo data</span>
          </div>
        </div>

        {/* Center / Search bar for Command Palette */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            type="button"
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
              document.dispatchEvent(event);
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-border bg-surface-2/60 hover:bg-surface-2 text-text-muted text-xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search metrics, screens, actions...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right tools: Date range filter, Guided demo, Help, Theme toggle */}
        <div className="flex items-center gap-2">
          {/* Date range picker */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-2 text-xs font-medium text-text transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </button>

            {dateDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-lg bg-surface border border-border shadow-md py-1 z-40"
                onMouseLeave={() => setDateDropdownOpen(false)}
              >
                {dateOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setDateRange(opt);
                      setDateDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-surface-2 ${
                      opt === dateRange ? "font-semibold text-primary-ink bg-primary-soft/40" : "text-text"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Guided Demo Button */}
          <button
            type="button"
            onClick={() => setGuidedDemoActive(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guided demo</span>
          </button>

          {/* Keyboard Help */}
          <button
            type="button"
            onClick={() => setShowKeyboardHelp(true)}
            title="Keyboard shortcuts (?)"
            className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Quick Theme Toggle */}
          <ThemeQuickToggle />
        </div>
      </header>

      <KeyboardHelpDialog
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
    </>
  );
}
