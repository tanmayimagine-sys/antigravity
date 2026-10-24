"use client";

import React from "react";
import { MapPin, TrendingUp, Building2, ExternalLink } from "lucide-react";

interface LocationMeta {
  area: string;
  district: string;
  mapUrl: string;
  footfallRating: string;
  landGrowth: string;        // YoY % 
  landGrowthLabel: string;   // directional label
  rentalRange: string;       // ₹/sqft/month
  nearbyAnchors: string[];
  insight: string;
}

const LOCATION_META: Record<string, LocationMeta> = {
  biz_stationery: {
    area: "FC Road / Pune University Zone",
    district: "Shivajinagar, Pune – MH",
    mapUrl: "https://maps.google.com/?q=Pune+University+FC+Road+Pune",
    footfallRating: "High",
    landGrowth: "+14.2",
    landGrowthLabel: "Strong",
    rentalRange: "₹80–₹120 / sqft / mo",
    nearbyAnchors: ["Pune University", "Ferguson College", "SPPU Campus"],
    insight:
      "Student-dense education corridor. Consistent footfall Sep–Apr (academic year). Land appreciation driven by metro Phase-2 extension towards Shivajinagar station.",
  },
  biz_icecream: {
    area: "5th Block, Koramangala",
    district: "South Bengaluru – KA",
    mapUrl: "https://maps.google.com/?q=Koramangala+5th+Block+Bengaluru",
    footfallRating: "Very High",
    landGrowth: "+18.7",
    landGrowthLabel: "Rapid",
    rentalRange: "₹140–₹220 / sqft / mo",
    nearbyAnchors: ["Forum Mall", "IIMB Gate", "Jyoti Nivas College"],
    insight:
      "Koramangala is one of Bengaluru's fastest-appreciating micro-markets. Tech-worker density and weekend dining traffic keep evening dwell time very high, supporting premium dessert ticket sizes.",
  },
  biz_cafe: {
    area: "M-Block Market, GK-2",
    district: "Greater Kailash 2, New Delhi – DL",
    mapUrl: "https://maps.google.com/?q=M+Block+Market+Greater+Kailash+2+New+Delhi",
    footfallRating: "High",
    landGrowth: "+11.3",
    landGrowthLabel: "Steady",
    rentalRange: "₹160–₹260 / sqft / mo",
    nearbyAnchors: ["GK-2 M-Block Market", "DLF Avenue Saket", "AIIMS Metro"],
    insight:
      "Established South Delhi market with affluent residential catchment. Limited new commercial supply keeps rental yields stable and land values firm. Breakfast and chai peak 8–11 AM on weekdays.",
  },
};

const FALLBACK_META: LocationMeta = {
  area: "Local Market Area",
  district: "India",
  mapUrl: "https://maps.google.com",
  footfallRating: "Medium",
  landGrowth: "+9.5",
  landGrowthLabel: "Moderate",
  rentalRange: "₹60–₹100 / sqft / mo",
  nearbyAnchors: ["Local Anchor", "Nearby Market"],
  insight: "Location context unavailable. Upload address data to get area-level growth estimates.",
};

const growthColor = (val: string) => {
  const n = parseFloat(val);
  if (n >= 15) return { bar: "bg-success", text: "text-success", badge: "bg-success-soft border-success/30 text-success" };
  if (n >= 10) return { bar: "bg-primary", text: "text-primary", badge: "bg-primary-soft border-primary/30 text-primary" };
  return { bar: "bg-warning", text: "text-warning", badge: "bg-warning-soft border-warning/30 text-warning" };
};

export function LocationTile({ businessId }: { businessId: string }) {
  const meta = LOCATION_META[businessId] ?? FALLBACK_META;
  const gc   = growthColor(meta.landGrowth);
  const growthNum = parseFloat(meta.landGrowth);

  return (
    <div className="rounded-lg border border-border bg-surface p-4 space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-surface-2 border border-border flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <div className="font-semibold text-[13.5px] text-text leading-tight">{meta.area}</div>
            <div className="text-[11.5px] text-text-muted">{meta.district}</div>
          </div>
        </div>

        <a
          href={meta.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] text-text-muted hover:text-primary transition-colors shrink-0"
        >
          <ExternalLink className="w-3 h-3" />
          Map
        </a>
      </div>

      {/* Land growth stat */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-1.5 text-text-muted">
            <TrendingUp className="w-3.5 h-3.5" />
            Area Land Growth (YoY)
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`font-bold text-[15px] tabular-nums ${gc.text}`}>
              {meta.landGrowth}%
            </span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${gc.badge}`}>
              {meta.landGrowthLabel}
            </span>
          </div>
        </div>

        {/* Growth bar */}
        <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <div
            className={`h-full ${gc.bar} rounded-full transition-all duration-700`}
            style={{ width: `${Math.min(100, (growthNum / 25) * 100)}%` }}
          />
        </div>

        <div className="text-[11px] text-text-muted">Estimated retail-zone appreciation · Mock data</div>
      </div>

      {/* 2-col stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-surface-2 border border-border px-3 py-2 space-y-0.5">
          <div className="text-[10px] text-text-muted uppercase tracking-wide font-medium">Footfall</div>
          <div className="font-semibold text-[13px] text-text">{meta.footfallRating}</div>
        </div>
        <div className="rounded-md bg-surface-2 border border-border px-3 py-2 space-y-0.5">
          <div className="text-[10px] text-text-muted uppercase tracking-wide font-medium">Rental Est.</div>
          <div className="font-semibold text-[12px] text-text">{meta.rentalRange}</div>
        </div>
      </div>

      {/* Nearby anchors */}
      <div className="space-y-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <Building2 className="w-3 h-3" />
          Nearby Anchors
        </div>
        <div className="flex flex-wrap gap-1.5">
          {meta.nearbyAnchors.map((anchor) => (
            <span
              key={anchor}
              className="text-[11px] px-2 py-0.5 rounded-md border border-border bg-surface-2 text-text-muted"
            >
              {anchor}
            </span>
          ))}
        </div>
      </div>

      {/* Insight */}
      <div className="pt-2 border-t border-border text-[11.5px] text-text-muted leading-relaxed">
        {meta.insight}
      </div>

      <div className="text-[10px] text-text-muted/50 italic">
        ⚠ Mock estimates — not real estate advice
      </div>
    </div>
  );
}
