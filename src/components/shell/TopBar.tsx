"use client";

import React, { useState } from "react";
import { useBusiness } from "./BusinessContext";
import { ThemeQuickToggle } from "../theme/ThemeQuickToggle";
import {
  Store,
  Calendar,
  Search,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Lock,
  Coins,
  ChevronDown,
  LogOut,
  UserCheck,
  Shield,
  Layers,
} from "lucide-react";
import { KeyboardHelpDialog } from "./CommandPalette";
import { AUTH_USERS } from "@/lib/auth/users";

export function TopBar() {
  const {
    activeBusiness,
    currentUser,
    isOwner,
    isInvestor,
    switchUser,
    logout,
    dateRange,
    setDateRange,
    setGuidedDemoActive,
  } = useBusiness();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showTenantLockInfo, setShowTenantLockInfo] = useState(false);

  const dateOptions = [
    "Last 7 Days",
    "Last 30 Days",
    "Quarter to Date (Q3 2026)",
    "Financial Year 2026-27",
  ];

  return (
    <>
      <header className="h-16 border-b border-border bg-surface px-4 flex items-center justify-between gap-3 sticky top-0 z-20">
        {/* Left: Tenant Isolated Store Banner OR Investor Portal Banner */}
        <div className="flex items-center gap-3">
          {isInvestor ? (
            // Investor Portal Indicator
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-accent/40 bg-accent-soft/30">
              <div className="w-6 h-6 rounded-md bg-accent text-surface flex items-center justify-center shrink-0 shadow-sm">
                <Coins className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-accent leading-none flex items-center gap-1.5">
                  Investor Discovery Portal
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-accent/20 text-accent font-semibold">
                    Simulated
                  </span>
                </div>
                <div className="text-[10px] text-text-muted leading-tight mt-0.5">
                  {currentUser.name} • 3 Listed Shops Accessible
                </div>
              </div>
            </div>
          ) : (
            // Shop Owner / Staff Locked Indicator (STRICT TENANT ISOLATION)
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTenantLockInfo(!showTenantLockInfo)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary-soft/20 hover:bg-primary-soft/30 transition-colors text-left group"
                title="Strict Tenant Isolation Active"
              >
                <div className="w-6 h-6 rounded-md bg-primary-soft flex items-center justify-center text-primary-ink shrink-0">
                  <Store className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-text leading-none flex items-center gap-1.5">
                    {activeBusiness.name}
                    <Lock className="w-3 h-3 text-primary-ink" />
                  </div>
                  <div className="text-[10px] text-text-muted leading-tight mt-0.5 flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <span>•</span>
                    <span className="text-primary-ink font-medium">Tenant Locked</span>
                  </div>
                </div>
              </button>

              {/* Explanatory security popover on click */}
              {showTenantLockInfo && (
                <div
                  className="absolute left-0 mt-2 w-72 rounded-lg bg-surface border border-border shadow-md p-3 z-40 text-xs space-y-2 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setShowTenantLockInfo(false)}
                >
                  <div className="flex items-center gap-2 text-primary-ink font-semibold">
                    <Shield className="w-4 h-4" />
                    <span>Strict Tenant Isolation</span>
                  </div>
                  <p className="text-text-muted text-[11px] leading-relaxed">
                    You are authenticated as <strong>{currentUser.name}</strong>. In accordance with zero-trust security standards, this session is <strong>strictly locked to {activeBusiness.name}</strong>.
                  </p>
                  <p className="text-text-muted text-[11px] leading-relaxed">
                    Other shop owners or external investors cannot view your private reconciliation or modify your settings.
                  </p>
                  <div className="pt-1 border-t border-border flex justify-end">
                    <button
                      onClick={() => setShowTenantLockInfo(false)}
                      className="text-[11px] text-primary-ink font-semibold hover:underline"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

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

        {/* Right tools: Date filter, Guided demo, Theme toggle, User & Account Switcher */}
        <div className="flex items-center gap-2">
          {/* Date range picker (for Owners/Staff) */}
          {!isInvestor && (
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
          )}

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

          {/* Authenticated User & Account Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-2 transition-colors"
              aria-haspopup="true"
              aria-expanded={userDropdownOpen}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0 ${
                isInvestor ? "bg-accent" : "bg-primary"
              }`}>
                {currentUser.avatarInitials}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-text leading-none">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5 leading-tight">
                  {currentUser.badge}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-text-muted shrink-0" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-xl bg-surface border border-border shadow-md py-2 z-50 animate-in fade-in zoom-in-95 duration-fast"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                {/* Current User Card */}
                <div className="px-3.5 py-2 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                      isInvestor ? "bg-accent" : "bg-primary"
                    }`}>
                      {currentUser.avatarInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-text truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-text-muted truncate">{currentUser.email}</div>
                      <div className="text-[10px] text-primary-ink font-medium mt-0.5">{currentUser.title}</div>
                    </div>
                  </div>
                </div>

                {/* Section Header: Switch Account */}
                <div className="px-3.5 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center justify-between">
                  <span>Switch Account / Persona</span>
                  <span className="text-[9px] font-normal lowercase text-text-muted">isolated credentials</span>
                </div>

                {/* Quick Account Switcher List */}
                <div className="space-y-0.5 px-1.5 py-1">
                  {AUTH_USERS.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    const isUserInvestor = user.role === "funder";
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          switchUser(user.id);
                          setUserDropdownOpen(false);
                          if (user.role === "funder") {
                            window.location.href = "/funding";
                          } else {
                            window.location.href = "/dashboard";
                          }
                        }}
                        className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                          isSelected
                            ? "bg-primary-soft/60 font-semibold"
                            : "hover:bg-surface-2"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5 ${
                          isUserInvestor ? "bg-accent" : "bg-primary"
                        }`}>
                          {user.avatarInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-text flex items-center gap-1.5">
                            <span className="truncate">{user.name}</span>
                            {isSelected && <span className="text-[9px] px-1 rounded bg-primary text-white">Active</span>}
                          </div>
                          <div className="text-[10px] text-text-muted truncate">
                            {user.businessName} {user.city ? `(${user.city})` : ""}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer: Sign Out */}
                <div className="pt-1.5 mt-1 border-t border-border px-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-danger hover:bg-danger-soft transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out to Login Screen</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <KeyboardHelpDialog
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
    </>
  );
}
