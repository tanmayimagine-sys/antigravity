"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  GitCompare,
  Bot,
  Stethoscope,
  Star,
  MapPin,
  Globe,
  Coins,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Store,
  Briefcase,
  Shield,
} from "lucide-react";
import { useBusiness } from "./BusinessContext";
import { db } from "@/lib/db";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { activeBusiness, currentUser, isOwner, isInvestor, setGuidedDemoActive } = useBusiness();
  const [collapsed, setCollapsed] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleResetData = () => {
    if (confirm("Reset all synthetic business data back to clean demonstration state?")) {
      setResetting(true);
      db.reset();
      setTimeout(() => {
        setResetting(false);
        window.location.reload();
      }, 400);
    }
  };

  // Role-Aware Navigation
  const navGroups: NavGroup[] = isInvestor
    ? [
        {
          group: "Investor Discovery",
          items: [
            { label: "Marketplace & Deals", href: "/funding", icon: Coins, badge: "3 Deals" },
            { label: "Business Health & Stats", href: "/dashboard", icon: LayoutDashboard },
            { label: "AI Due Diligence", href: "/ai-workspace", icon: Bot },
          ],
        },
        {
          group: "Market Research",
          items: [
            { label: "Location Intelligence", href: "/location", icon: MapPin },
            { label: "Customer Reputation", href: "/reviews", icon: Star },
            { label: "Public Storefronts", href: "/public-profile", icon: Globe },
          ],
        },
      ]
    : [
        {
          group: "Overview",
          items: [
            { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          ],
        },
        {
          group: "Data Operations",
          items: [
            { label: "Data Centre", href: "/data-centre", icon: Database },
            { label: "Reconciliation", href: "/reconciliation", icon: GitCompare },
          ],
        },
        {
          group: "Intelligence",
          items: [
            { label: "Central AI", href: "/ai-workspace", icon: Bot },
            { label: "Doctor & Experiments", href: "/experiments", icon: Stethoscope },
            { label: "Reviews Coach", href: "/reviews", icon: Star },
          ],
        },
        {
          group: "Expansion",
          items: [
            { label: "Location Explorer", href: "/location", icon: MapPin },
          ],
        },
        {
          group: "Capital",
          items: [
            { label: "Borrowing & Ledger", href: "/funding", icon: Coins, badge: "Sim" },
          ],
        },
        {
          group: "Public",
          items: [
            { label: "Public Profile", href: "/public-profile", icon: Globe },
          ],
        },
        ...(currentUser.role === "admin"
          ? [
              {
                group: "Admin",
                items: [
                  { label: "Admin Console", href: "/admin", icon: ShieldAlert },
                ],
              },
            ]
          : []),
      ];

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-border bg-surface select-none transition-all duration-200 z-30 ${
        collapsed ? "w-14" : "w-[240px]"
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-border">
        {!collapsed && (
          <a
            href={isInvestor ? "/funding" : "/dashboard"}
            className="flex items-center gap-2.5 overflow-hidden min-w-0"
          >
            {/* Logo mark */}
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                isInvestor
                  ? "bg-accent text-white"
                  : "bg-primary text-white"
              }`}
            >
              {isInvestor ? (
                <Briefcase className="w-3.5 h-3.5" />
              ) : (
                <Store className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="truncate min-w-0">
              <div className="font-semibold text-[13px] text-text leading-snug tracking-tight truncate">
                {isInvestor ? "Investor Portal" : "Central AI OS"}
              </div>
              <div className="text-[11px] text-text-muted truncate leading-none mt-0.5">
                {isInvestor ? "Capital Discovery" : activeBusiness.name}
              </div>
            </div>
          </a>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`w-6 h-6 rounded flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors shrink-0 ${
            collapsed ? "mx-auto" : "ml-auto"
          }`}
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            {!collapsed && (
              <div className="px-2 pb-1 text-[10.5px] font-semibold uppercase tracking-wider text-text-muted/70">
                {grp.group}
              </div>
            )}
            {grp.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`relative flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-surface-2 text-text font-semibold"
                      : "text-text-muted hover:bg-surface-2 hover:text-text"
                  }`}
                >
                  {/* Active indicator — left edge */}
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-[2.5px] bg-primary rounded-r" />
                  )}

                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-primary" : "text-text-muted"
                    }`}
                  />

                  {!collapsed && (
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 rounded font-medium bg-surface-2 text-text-muted border border-border ml-1 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Tools & Profile */}
      <div className="p-2 border-t border-border space-y-0.5">
        {/* Guided Demo Button */}
        <button
          type="button"
          onClick={() => setGuidedDemoActive(true)}
          title="Start 5-Minute Guided Demo"
          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium text-primary hover:bg-primary-soft transition-colors"
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Guided Demo</span>}
        </button>

        {/* Reset Demo Data */}
        <button
          type="button"
          onClick={handleResetData}
          disabled={resetting}
          title="Reset synthetic baseline data"
          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
        >
          <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${resetting ? "animate-spin" : ""}`} />
          {!collapsed && <span>Reset Demo Data</span>}
        </button>

        {/* Settings — Only for Store Owners / Admins */}
        {!isInvestor && (
          <a
            href="/settings"
            title="Settings & Appearance"
            className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              pathname === "/settings"
                ? "bg-surface-2 text-text font-semibold"
                : "text-text-muted hover:bg-surface-2 hover:text-text"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0 text-text-muted" />
            {!collapsed && <span>Settings</span>}
          </a>
        )}
      </div>
    </aside>
  );
}
