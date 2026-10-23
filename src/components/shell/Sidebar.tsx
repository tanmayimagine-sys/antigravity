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
  const { activeBusiness, currentRole, setGuidedDemoActive } = useBusiness();
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

  const navGroups: NavGroup[] = [
    {
      group: "Overview",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      group: "Data",
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
      group: "Grow",
      items: [
        { label: "Location Explorer", href: "/location", icon: MapPin },
      ],
    },
    {
      group: "Finance",
      items: [
        { label: "Funding (SIMULATED)", href: "/funding", icon: Coins, badge: "Sim" },
      ],
    },
    {
      group: "Public",
      items: [
        { label: "Public Profile", href: "/public-profile", icon: Globe },
      ],
    },
    ...(currentRole === "admin"
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
      className={`hidden lg:flex flex-col border-r border-border bg-surface select-none transition-all duration-base z-30 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <a href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-bold text-sm text-text leading-tight tracking-tight">
                Central AI OS
              </div>
              <div className="text-[11px] text-text-muted truncate">
                {activeBusiness.name}
              </div>
            </div>
          </a>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors mx-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {navGroups.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
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
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-soft text-primary-ink font-semibold"
                      : "text-text hover:bg-surface-2 text-opacity-90"
                  }`}
                >
                  {/* Sliding 3px active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-primary rounded-r" />
                  )}

                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-primary-ink" : "text-text-muted"
                    }`}
                  />

                  {!collapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-info-soft text-info font-mono border border-info/30">
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

      {/* Bottom Sticky Tools & Profile */}
      <div className="p-3 border-t border-border bg-surface-2/40 space-y-1.5">
        {/* Guided Demo Button */}
        <button
          type="button"
          onClick={() => setGuidedDemoActive(true)}
          title="Start 5-Minute Guided Demo"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold bg-accent-soft text-accent hover:bg-accent-soft/80 border border-accent/30 transition-colors"
        >
          <Sparkles className="w-4 h-4 shrink-0 text-accent" />
          {!collapsed && <span>Guided Demo (5 Min)</span>}
        </button>

        {/* Reset Demo Data Button */}
        <button
          type="button"
          onClick={handleResetData}
          disabled={resetting}
          title="Reset synthetic baseline data"
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
        >
          <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${resetting ? "animate-spin" : ""}`} />
          {!collapsed && <span>Reset Demo Data</span>}
        </button>

        {/* Settings */}
        <a
          href="/settings"
          title="Settings & Appearance"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-text hover:bg-surface-2 transition-colors ${
            pathname === "/settings" ? "bg-primary-soft text-primary-ink font-semibold" : ""
          }`}
        >
          <Settings className="w-4 h-4 shrink-0 text-text-muted" />
          {!collapsed && <span>Settings</span>}
        </a>
      </div>
    </aside>
  );
}
