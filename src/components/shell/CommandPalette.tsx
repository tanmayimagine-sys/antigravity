"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  HelpCircle,
  FileUp,
  Search,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName))) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const commands = [
    { name: "Owner Dashboard", group: "Navigation", path: "/dashboard", icon: LayoutDashboard },
    { name: "Data Centre (Upload & Parse)", group: "Navigation", path: "/data-centre", icon: Database },
    { name: "Reconciliation Workspace", group: "Navigation", path: "/reconciliation", icon: GitCompare },
    { name: "Central AI Assistant", group: "Navigation", path: "/ai-workspace", icon: Bot },
    { name: "Business Doctor & Experiments", group: "Navigation", path: "/experiments", icon: Stethoscope },
    { name: "Reviews & Reputation Coach", group: "Navigation", path: "/reviews", icon: Star },
    { name: "Location Explorer", group: "Navigation", path: "/location", icon: MapPin },
    { name: "Public Business Profile", group: "Navigation", path: "/public-profile", icon: Globe },
    { name: "Funding Workspace (SIMULATED)", group: "Navigation", path: "/funding", icon: Coins },
    { name: "Admin Console & Audit Log", group: "Navigation", path: "/admin", icon: ShieldAlert },
    { name: "Settings & Appearance", group: "Settings", path: "/settings", icon: Settings },
    { name: "Upload Messy Sample File", group: "Actions", path: "/data-centre?action=upload", icon: FileUp },
    { name: "Ask Central AI a Question", group: "Actions", path: "/ai-workspace?focus=1", icon: Bot },
  ];

  const filtered = query.trim() === ""
    ? commands
    : commands.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.group.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (path: string) => {
    setOpen(false);
    setQuery("");
    router.push(path);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-fast"
    >
      <div
        className="w-full max-w-xl rounded-xl bg-surface border border-border shadow-md overflow-hidden animate-in zoom-in-95 duration-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-border bg-surface">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Type a screen, command, or action... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full py-3.5 px-3 bg-transparent text-text text-sm focus:outline-none placeholder:text-text-muted"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-text-muted bg-surface-2 rounded border border-border">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border/40">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-text-muted">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm text-text hover:bg-surface-2 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-surface-2 group-hover:bg-primary-soft flex items-center justify-center text-text-muted group-hover:text-primary-ink transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <span className="text-xs text-text-muted uppercase font-mono tracking-wider">
                    {item.group}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-border bg-surface-2 text-xs text-text-muted flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Navigation: <kbd className="px-1.5 py-0.5 bg-surface border rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-surface border rounded text-[10px]">↓</kbd></span>
            <span>Select: <kbd className="px-1.5 py-0.5 bg-surface border rounded text-[10px]">Enter</kbd></span>
          </div>
          <span>Tip: Press <kbd className="px-1 py-0.5 bg-surface border rounded font-mono">?</kbd> for help</span>
        </div>
      </div>
    </div>
  );
}

export function KeyboardHelpDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Ctrl + K / ⌘K", desc: "Open global command palette & search" },
    { key: "?", desc: "Open keyboard shortcuts cheat sheet" },
    { key: "Esc", desc: "Close open modal, drawer, or popover" },
    { key: "Tab / Shift+Tab", desc: "Navigate interactive controls & cards" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in"
    >
      <div className="w-full max-w-md rounded-xl bg-surface border border-border shadow-md p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary-ink" />
            <h3 className="font-semibold text-text text-base">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5 text-sm">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded bg-surface-2 border border-border">
              <span className="text-text">{s.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-surface border border-border font-mono text-xs text-text font-semibold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
