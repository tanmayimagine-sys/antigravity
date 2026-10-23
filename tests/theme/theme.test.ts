import { describe, it, expect } from "vitest";
import { resolveAdaptiveTheme, getMsUntilNextBoundary } from "@/components/theme/ThemeProvider";

describe("Theme System & Adaptive Logic", () => {
  const defaultSchedule = {
    lightStart: "07:00",
    darkStart: "19:00",
  };

  it("resolves to Light theme during the day at 10:00 AM", () => {
    const morning = new Date("2026-10-23T10:00:00");
    const theme = resolveAdaptiveTheme(morning, defaultSchedule);
    expect(theme).toBe("light");
  });

  it("resolves to Dark theme during the night at 22:00 PM (10:00 PM)", () => {
    const night = new Date("2026-10-23T22:00:00");
    const theme = resolveAdaptiveTheme(night, defaultSchedule);
    expect(theme).toBe("dark");
  });

  it("resolves to Dark theme in early morning before 07:00 (e.g. 05:30 AM)", () => {
    const earlyMorning = new Date("2026-10-23T05:30:00");
    const theme = resolveAdaptiveTheme(earlyMorning, defaultSchedule);
    expect(theme).toBe("dark");
  });

  it("resolves precisely at boundary: 07:00 is Light, 19:00 is Dark", () => {
    const atLightBoundary = new Date("2026-10-23T07:00:00");
    expect(resolveAdaptiveTheme(atLightBoundary, defaultSchedule)).toBe("light");

    const atDarkBoundary = new Date("2026-10-23T19:00:00");
    expect(resolveAdaptiveTheme(atDarkBoundary, defaultSchedule)).toBe("dark");
  });

  it("correctly calculates next boundary time and duration", () => {
    const afternoon = new Date("2026-10-23T14:00:00");
    const boundary = getMsUntilNextBoundary(afternoon, defaultSchedule);
    expect(boundary.nextTarget).toBe("dark");
    expect(boundary.nextTime).toBe("19:00");
    // 5 hours until 19:00 = 5 * 3600 * 1000 = 18,000,000 ms
    expect(boundary.ms).toBe(5 * 60 * 60 * 1000);
  });

  it("handles custom schedules configured by the user", () => {
    const customSchedule = {
      lightStart: "08:30",
      darkStart: "17:30",
    };
    const lateMorning = new Date("2026-10-23T09:00:00");
    expect(resolveAdaptiveTheme(lateMorning, customSchedule)).toBe("light");

    const evening = new Date("2026-10-23T18:00:00");
    expect(resolveAdaptiveTheme(evening, customSchedule)).toBe("dark");
  });
});
