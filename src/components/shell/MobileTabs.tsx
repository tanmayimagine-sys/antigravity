"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Bot,
  MapPin,
  MoreHorizontal,
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
    { label: "Data",      href: "/data-centre", icon: Database },
    { label: "AI",        href: "/ai-workspace", icon: Bot },
    { label: "Grow",      href: "/location",     icon: MapPin },
  ];

  const moreItems = [
    { label: "Reconciliation",       href: "/reconciliation", icon: GitCompare },
    { label: "Doctor & Experiments", href: "/experiments",    icon: Stethoscope },
    { label: "Reviews Coach",        href: "/reviews",        icon: Star },
    { label: "Public Profile",       href: "/public-profile", icon: Globe },
    { label: "Funding (Simulated)",  href: "/funding",        icon: Coins, badge: "Sim" },
    ...(currentRole === "admin"
      ? [{ label: "Admin Console", href: "/admin", icon: ShieldAlert }]
      : []),
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Bottom tab bar */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-surface border-t border-border flex items-center justify-around px-2 z-40"
      >
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <a
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 h-11 rounded-lg text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </a>
          );
        })}

        <button
          type="button"
          onClick={() => setShowMoreSheet(true)}
          className={`flex flex-col items-center justify-center gap-0.5 w-14 h-11 rounded-lg text-[10px] font-medium transition-colors ${
            showMoreSheet ? "text-primary" : "text-text-muted hover:text-text"
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>

      {/* More bottom sheet */}
      {showMoreSheet && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm"
          onClick={() => setShowMoreSheet(false)}
        >
          <div
            className="bg-surface border-t border-border rounded-t-xl p-5 max-h-[80vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-semibold text-[15px] text-text">More Features</span>
              <button
                onClick={() => setShowMoreSheet(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-2 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMoreSheet(false)}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-[12.5px] font-medium transition-colors ${
                      isActive
                        ? "bg-primary-soft text-primary-ink border-primary/30"
                        : "border-border hover:bg-surface-2 text-text"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-text-muted shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span className="text-[10px] px-1.5 rounded border border-border bg-surface text-text-muted ml-auto shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>

            <div className="pt-1 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setShowMoreSheet(false);
                  setGuidedDemoActive(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary/30 bg-primary-soft text-primary text-[12.5px] font-semibold transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Launch Guided Demo Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
