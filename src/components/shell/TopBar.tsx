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
  Shield,
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
      <header className="h-14 border-b border-border bg-surface px-4 flex items-center justify-between gap-3 sticky top-0 z-20">

        {/* Left: Store / Investor context */}
        <div className="flex items-center gap-2.5 min-w-0">
          {isInvestor ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-2 border border-border">
              <Coins className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-[12px] font-semibold text-text hidden sm:inline">
                Investor Discovery
              </span>
              <span className="text-[10px] px-1.5 rounded bg-accent-soft text-accent font-medium border border-accent/30">
                Simulated
              </span>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTenantLockInfo(!showTenantLockInfo)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-md hover:bg-surface-2 transition-colors text-left"
                title="Strict Tenant Isolation Active"
              >
                <div className="w-5 h-5 rounded bg-primary-soft flex items-center justify-center shrink-0">
                  <Store className="w-3 h-3 text-primary-ink" />
                </div>
                <div className="hidden sm:block min-w-0">
                  <div className="text-[12.5px] font-semibold text-text leading-none flex items-center gap-1">
                    {activeBusiness.name}
                    <Lock className="w-2.5 h-2.5 text-text-muted" />
                  </div>
                  <div className="text-[10.5px] text-text-muted leading-none mt-0.5">
                    {currentUser.name} · Tenant Locked
                  </div>
                </div>
              </button>

              {/* Security popover */}
              {showTenantLockInfo && (
                <div
                  className="absolute left-0 top-full mt-1.5 w-72 rounded-lg bg-surface border border-border shadow-md p-3.5 z-40 text-xs space-y-2"
                  onMouseLeave={() => setShowTenantLockInfo(false)}
                >
                  <div className="flex items-center gap-2 font-semibold text-text">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span>Strict Tenant Isolation</span>
                  </div>
                  <p className="text-text-muted leading-relaxed">
                    Authenticated as <strong className="text-text">{currentUser.name}</strong>. This session is locked to{" "}
                    <strong className="text-text">{activeBusiness.name}</strong> — no other shop's data is accessible.
                  </p>
                  <div className="pt-1.5 border-t border-border flex justify-end">
                    <button
                      onClick={() => setShowTenantLockInfo(false)}
                      className="text-[11px] text-primary font-semibold hover:underline"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Synthetic demo badge */}
          <div className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border text-[11px] text-text-muted shrink-0">
            <ShieldCheck className="w-3 h-3" />
            <span>Synthetic demo</span>
          </div>
        </div>

        {/* Center: Search / Command palette trigger */}
        <div className="flex-1 max-w-sm hidden md:block">
          <button
            type="button"
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
              document.dispatchEvent(event);
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-md border border-border bg-surface-2/60 hover:bg-surface-2 text-text-muted text-[12px] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search or jump to...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Date, Demo, Help, Theme, User */}
        <div className="flex items-center gap-1.5">
          {/* Date range */}
          {!isInvestor && (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border hover:bg-surface-2 text-[12px] font-medium text-text transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-text-muted" />
                <span>{dateRange}</span>
                <ChevronDown className="w-3 h-3 text-text-muted" />
              </button>

              {dateDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-56 rounded-lg bg-surface border border-border shadow-md py-1 z-40"
                  onMouseLeave={() => setDateDropdownOpen(false)}
                >
                  {dateOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setDateRange(opt);
                        setDateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-surface-2 ${
                        opt === dateRange
                          ? "font-semibold text-primary"
                          : "text-text"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Guided Demo button */}
          <button
            type="button"
            onClick={() => setGuidedDemoActive(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary text-white text-[12px] font-semibold hover:bg-primary-hover transition-colors active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo</span>
          </button>

          {/* Keyboard Help */}
          <button
            type="button"
            onClick={() => setShowKeyboardHelp(true)}
            title="Keyboard shortcuts (?)"
            className="w-8 h-8 rounded-md flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <ThemeQuickToggle />

          {/* User Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-md hover:bg-surface-2 transition-colors"
              aria-haspopup="true"
              aria-expanded={userDropdownOpen}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isInvestor ? "bg-accent text-white" : "bg-primary text-white"
                }`}
              >
                {currentUser.avatarInitials}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-[12px] font-semibold text-text leading-none">
                  {currentUser.name.split(" ")[0]}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-1.5 w-72 rounded-lg bg-surface border border-border shadow-md py-1.5 z-50"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                {/* Current user */}
                <div className="px-3 py-2 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        isInvestor ? "bg-accent text-white" : "bg-primary text-white"
                      }`}
                    >
                      {currentUser.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-text truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-text-muted truncate">
                        {currentUser.email}
                      </div>
                      <div className="text-[10px] text-primary font-medium mt-0.5">
                        {currentUser.title}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Switch account */}
                <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Switch Account
                </div>

                <div className="px-1.5 space-y-0.5">
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
                          window.location.href =
                            user.role === "funder" ? "/funding" : "/dashboard";
                        }}
                        className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-left transition-colors ${
                          isSelected
                            ? "bg-surface-2 font-semibold"
                            : "hover:bg-surface-2"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isUserInvestor ? "bg-accent text-white" : "bg-primary text-white"
                          }`}
                        >
                          {user.avatarInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[12px] text-text flex items-center gap-1.5">
                            <span className="truncate">{user.name}</span>
                            {isSelected && (
                              <span className="text-[9px] px-1 rounded bg-surface-2 border border-border text-text-muted shrink-0">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[10.5px] text-text-muted truncate">
                            {user.businessName}
                            {user.city ? ` · ${user.city}` : ""}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sign out */}
                <div className="pt-1.5 mt-1 border-t border-border px-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] font-medium text-danger hover:bg-danger-soft transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
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
