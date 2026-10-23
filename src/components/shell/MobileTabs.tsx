"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Bot,
  MapPin,
  Menu,
  X,
  GitCompare,
  Stethoscope,
  Star,
  Globe,
  Coins,
  ShieldAlert,
  Settings,
  Sparkles,
} from "lucide-react";
import { useBusiness } from "./BusinessContext";

export function MobileTabs() {
  const pathname = usePathname();
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const { setGuidedDemoActive, currentRole } = useBusiness();

  const mainTabs = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Data", href: "/data-centre", icon: Database },
    { label: "AI", href: "/ai-workspace", icon: Bot },
    { label: "Grow", href: "/location", icon: MapPin },
  ];

  const moreItems = [
    { label: "Reconciliation", href: "/reconciliation", icon: GitCompare },
    { label: "Doctor & Experiments", href: "/experiments", icon: Stethoscope },
    { label: "Reviews Coach", href: "/reviews", icon: Star },
    { label: "Public Profile", href: "/public-profile", icon: Globe },
    { label: "Funding (SIMULATED)", href: "/funding", icon: Coins, badge: "Sim" },
    ...(currentRole === "admin"
      ? [{ label: "Admin Console", href: "/admin", icon: ShieldAlert }]
      : []),
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border flex items-center justify-around px-2 z-40 shadow-lg"
      >
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <a
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? "text-primary-ink font-semibold" : "text-text-muted hover:text-text"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </a>
          );
        })}

        <button
          type="button"
          onClick={() => setShowMoreSheet(true)}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg text-[10px] font-medium ${
            showMoreSheet ? "text-primary-ink font-semibold" : "text-text-muted hover:text-text"
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* More Bottom Sheet */}
      {showMoreSheet && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowMoreSheet(false)}
        >
          <div
            className="bg-surface border-t border-border rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-bold text-base text-text">More Features & Tools</span>
              <button
                onClick={() => setShowMoreSheet(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMoreSheet(false)}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-primary-soft text-primary-ink border-primary/30 font-semibold"
                        : "bg-surface-2/60 hover:bg-surface-2 text-text border-border"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-text-muted shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </a>
                );
              })}
            </div>

            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setShowMoreSheet(false);
                  setGuidedDemoActive(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-accent-soft text-accent border border-accent/30 text-xs font-semibold"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Launch Guided Demo Tour</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
