"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme, ThemeMode } from "./ThemeProvider";
import { Sun, Moon, Clock, Check } from "lucide-react";

export function ThemeQuickToggle({ className = "" }: { className?: string }) {
  const { mode, resolvedTheme, setMode, nextSwitchTime } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const CurrentIcon = mode === "adaptive" ? Clock : resolvedTheme === "dark" ? Moon : Sun;

  const options: { id: ThemeMode; label: string; icon: typeof Sun; desc: string }[] = [
    { id: "light", label: "Light", icon: Sun, desc: "Always light" },
    { id: "dark", label: "Dark", icon: Moon, desc: "Always dark" },
    {
      id: "adaptive",
      label: "Adaptive",
      icon: Clock,
      desc: `Auto (Next: ${nextSwitchTime})`,
    },
  ];

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-md border border-border bg-surface hover:bg-surface-2 text-text transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        aria-label={`Current theme: ${mode} (${resolvedTheme}). Click to change.`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <CurrentIcon className="w-4 h-4 text-primary-ink" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-56 rounded-lg bg-surface border border-border shadow-md py-1 z-50 animate-in fade-in zoom-in-95 duration-fast"
        >
          <div className="px-3 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border">
            Appearance Mode
          </div>
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = mode === opt.id;
            return (
              <button
                key={opt.id}
                role="menuitem"
                onClick={() => {
                  setMode(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-surface-2 transition-colors ${
                  isSelected ? "font-medium text-primary-ink" : "text-text"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-primary-ink" : "text-text-muted"}`} />
                  <div>
                    <div>{opt.label}</div>
                    <div className="text-[11px] text-text-muted">{opt.desc}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary-ink" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
