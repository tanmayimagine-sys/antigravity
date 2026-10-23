"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useTransition } from "react";

export type ThemeMode = "light" | "dark" | "adaptive";
export type ResolvedTheme = "light" | "dark";

export interface ThemeSchedule {
  lightStart: string; // "07:00"
  darkStart: string;  // "19:00"
}

interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  schedule: ThemeSchedule;
  reduceMotion: boolean;
  setMode: (mode: ThemeMode) => void;
  setSchedule: (schedule: Partial<ThemeSchedule>) => void;
  setReduceMotion: (reduce: boolean) => void;
  nextSwitchTime: string;
}

const DEFAULT_SCHEDULE: ThemeSchedule = {
  lightStart: "07:00",
  darkStart: "19:00",
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Calculates whether a given clock time should resolve to 'light' or 'dark'
 * based on HH:MM schedule strings.
 */
export function resolveAdaptiveTheme(now: Date, schedule: ThemeSchedule): ResolvedTheme {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [lH, lM] = schedule.lightStart.split(":").map(Number);
  const [dH, dM] = schedule.darkStart.split(":").map(Number);

  const lightMinutes = lH * 60 + lM;
  const darkMinutes = dH * 60 + dM;

  if (lightMinutes < darkMinutes) {
    // Normal day schedule e.g., 07:00 to 19:00
    return currentMinutes >= lightMinutes && currentMinutes < darkMinutes ? "light" : "dark";
  } else {
    // Inverted schedule e.g. dark during day, light at night
    return currentMinutes >= lightMinutes || currentMinutes < darkMinutes ? "light" : "dark";
  }
}

/**
 * Returns milliseconds until the next scheduled theme transition boundary
 */
export function getMsUntilNextBoundary(now: Date, schedule: ThemeSchedule): { ms: number; nextTarget: ResolvedTheme; nextTime: string } {
  const [lH, lM] = schedule.lightStart.split(":").map(Number);
  const [dH, dM] = schedule.darkStart.split(":").map(Number);

  const nextLight = new Date(now);
  nextLight.setHours(lH, lM, 0, 0);
  if (nextLight <= now) nextLight.setDate(nextLight.getDate() + 1);

  const nextDark = new Date(now);
  nextDark.setHours(dH, dM, 0, 0);
  if (nextDark <= now) nextDark.setDate(nextDark.getDate() + 1);

  if (nextLight < nextDark) {
    return {
      ms: nextLight.getTime() - now.getTime(),
      nextTarget: "light",
      nextTime: schedule.lightStart,
    };
  } else {
    return {
      ms: nextDark.getTime() - now.getTime(),
      nextTarget: "dark",
      nextTime: schedule.darkStart,
    };
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("adaptive");
  const [schedule, setScheduleState] = useState<ThemeSchedule>(DEFAULT_SCHEDULE);
  const [reduceMotion, setReduceMotionState] = useState<boolean>(false);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [nextSwitchTime, setNextSwitchTime] = useState<string>("19:00");
  const [, startTransition] = useTransition();

  // Apply smooth transition class temporarily
  const applyThemeToDOM = useCallback((newTheme: ResolvedTheme, animate = true) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || reduceMotion;

    if (animate && !prefersReduced) {
      root.classList.add("theme-transitioning");
      setTimeout(() => {
        root.classList.remove("theme-transitioning");
      }, 300);
    }

    if (newTheme === "dark") {
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.removeAttribute("data-theme");
      root.style.colorScheme = "light";
    }

    // Set meta theme-color for browser address bars
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", newTheme === "dark" ? "#0B1220" : "#F6F8FB");
  }, [reduceMotion]);

  // Recalculate theme based on current mode and schedule
  const reevaluateTheme = useCallback((animate = true) => {
    const now = new Date();
    let targetTheme: ResolvedTheme;

    if (mode === "light") {
      targetTheme = "light";
      setNextSwitchTime("Manual");
    } else if (mode === "dark") {
      targetTheme = "dark";
      setNextSwitchTime("Manual");
    } else {
      targetTheme = resolveAdaptiveTheme(now, schedule);
      const boundary = getMsUntilNextBoundary(now, schedule);
      setNextSwitchTime(boundary.nextTime);
    }

    setResolvedTheme(targetTheme);
    applyThemeToDOM(targetTheme, animate);
  }, [mode, schedule, applyThemeToDOM]);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const storedMode = localStorage.getItem("theme-mode") as ThemeMode | null;
      const storedSched = localStorage.getItem("theme-schedule");
      const storedMotion = localStorage.getItem("theme-reduce-motion");

      if (storedMode && ["light", "dark", "adaptive"].includes(storedMode)) {
        setModeState(storedMode);
      }
      if (storedSched) {
        const parsed = JSON.parse(storedSched);
        if (parsed.lightStart && parsed.darkStart) {
          setScheduleState(parsed);
        }
      }
      if (storedMotion) {
        setReduceMotionState(storedMotion === "true");
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Update theme when mode or schedule changes
  useEffect(() => {
    reevaluateTheme(true);
  }, [mode, schedule, reevaluateTheme]);

  // Handle live timeout boundary and visibility/focus events for Adaptive mode
  useEffect(() => {
    if (mode !== "adaptive") return;

    let timerId: NodeJS.Timeout;

    const armNextTimer = () => {
      const now = new Date();
      const boundary = getMsUntilNextBoundary(now, schedule);
      setNextSwitchTime(boundary.nextTime);

      // Add a 200ms buffer to ensure clock crossed the minute boundary
      const ms = Math.max(1000, boundary.ms + 200);

      timerId = setTimeout(() => {
        reevaluateTheme(true);
        armNextTimer();
      }, ms);
    };

    armNextTimer();

    const handleWakeup = () => {
      reevaluateTheme(false);
    };

    window.addEventListener("focus", handleWakeup);
    document.addEventListener("visibilitychange", handleWakeup);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener("focus", handleWakeup);
      document.removeEventListener("visibilitychange", handleWakeup);
    };
  }, [mode, schedule, reevaluateTheme]);

  const setMode = useCallback((newMode: ThemeMode) => {
    startTransition(() => {
      setModeState(newMode);
      try {
        localStorage.setItem("theme-mode", newMode);
      } catch {}
    });
  }, []);

  const setSchedule = useCallback((newSched: Partial<ThemeSchedule>) => {
    setScheduleState((prev) => {
      const updated = { ...prev, ...newSched };
      try {
        localStorage.setItem("theme-schedule", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const setReduceMotion = useCallback((reduce: boolean) => {
    setReduceMotionState(reduce);
    try {
      localStorage.setItem("theme-reduce-motion", String(reduce));
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        resolvedTheme,
        schedule,
        reduceMotion,
        setMode,
        setSchedule,
        setReduceMotion,
        nextSwitchTime,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
