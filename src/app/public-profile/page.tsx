"use client";

import React, { useState } from "react";
import { useBusiness } from "@/components/shell/BusinessContext";
import { db } from "@/lib/db";
import { formatPaise } from "@/lib/formatters";
import {
  Globe,
  Eye,
  ShieldCheck,
  Lock,
  Smartphone,
  Monitor,
  Check,
  ExternalLink,
  Store,
  Sparkles,
} from "lucide-react";
import { PublicProfileSettings } from "@/lib/types";

export default function PublicProfileEditorPage() {
  const { activeBusiness } = useBusiness();
  const profile = db.getPublicProfile(activeBusiness.id) || db.getPublicProfile("biz_stationery")!;
  const [settings, setSettings] = useState<PublicProfileSettings>(profile);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [toast, setToast] = useState<string | null>(null);

  const handleToggle = (field: keyof PublicProfileSettings) => {
    const updated = { ...settings, [field]: !settings[field] };
    setSettings(updated);
    db.updatePublicProfile(activeBusiness.id, { [field]: updated[field] });
    setToast("Public profile settings updated.");
    setTimeout(() => setToast(null), 2500);
  };

  const neverShownFields = [
    "Bank statements and account ledger numbers",
    "Customer phone numbers & itemized payment tokens",
    "Private GST portal filing credentials & supplier price contracts",
    "Net operating cash margins and landlord lease terms",
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              Public Business Profile
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-surface-2 border border-border text-text-muted">
              Owner-Controlled Visibility
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Decide exactly what prospective customers and funders can see for <strong>{activeBusiness.name}</strong>
          </p>
        </div>

        <a
          href={`/public-profile/${activeBusiness.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98]"
        >
          <span>Open Public Link</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {toast && (
        <div className="p-3 rounded-lg bg-success-soft text-success border border-success/30 text-xs font-semibold animate-in fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Main Split: Left Editor (6 cols) / Right Live Preview (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Field Approvals Editor (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
            <div className="border-b border-border pb-3">
              <h3 className="font-bold text-base text-text">Field-by-Field Privacy Controls</h3>
              <p className="text-xs text-text-muted">
                Every public data field requires your explicit opt-in switch.
              </p>
            </div>

            {/* Toggle 1: Business Story */}
            <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-surface-2/60 border border-border">
              <div className="space-y-1">
                <span className="font-semibold text-text text-xs block">Business Story & Tagline</span>
                <p className="text-xs text-text-muted">{settings.storyText}</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("storyApproved")}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  settings.storyApproved ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform transform ${
                    settings.storyApproved ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Area-Level Location */}
            <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-surface-2/60 border border-border">
              <div className="space-y-1">
                <span className="font-semibold text-text text-xs block">Area-Level Location</span>
                <p className="text-xs text-text-muted">{settings.areaLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("locationAreaApproved")}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  settings.locationAreaApproved ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform transform ${
                    settings.locationAreaApproved ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Services & Hero Products */}
            <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-surface-2/60 border border-border">
              <div className="space-y-1">
                <span className="font-semibold text-text text-xs block">Highlighted Services & Specialties</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {settings.servicesList.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-surface border border-border text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("servicesApproved")}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  settings.servicesApproved ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform transform ${
                    settings.servicesApproved ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 4: Public Performance Metrics */}
            <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-surface-2/60 border border-border">
              <div className="space-y-1">
                <span className="font-semibold text-text text-xs block">Display Verified Sales Volume</span>
                <p className="text-xs text-text-muted">
                  Displays order volume and aggregate gross sales. Net cash margins remain hidden.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("metricsApproved")}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  settings.metricsApproved ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform transform ${
                    settings.metricsApproved ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 5: Demo Visitor Offer */}
            <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-surface-2/60 border border-border">
              <div className="space-y-1">
                <span className="font-semibold text-text text-xs block">Customer Demo Offer</span>
                <p className="text-xs text-text-muted font-medium">{settings.demoOfferTitle}</p>
                <p className="text-xs text-text-muted">{settings.demoOfferDetail}</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("demoOfferApproved")}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  settings.demoOfferApproved ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform transform ${
                    settings.demoOfferApproved ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Never Shown Publicly Box */}
          <div className="rounded-xl border border-danger/30 bg-danger-soft/20 p-4 space-y-2 text-xs">
            <div className="font-bold text-danger flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Strict Privacy Guardrails — Never Shown Publicly</span>
            </div>
            <ul className="space-y-1 text-text-muted list-disc pl-4 text-[11px]">
              {neverShownFields.map((field, idx) => (
                <li key={idx}>{field}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Live Preview Panel (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Live Public Preview
            </span>

            {/* Desktop / Mobile Preview Toggle */}
            <div className="inline-flex rounded-lg p-0.5 bg-surface-2 border border-border text-xs">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={`p-1.5 rounded transition-colors ${
                  previewMode === "desktop" ? "bg-surface text-primary-ink shadow-sm" : "text-text-muted"
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                className={`p-1.5 rounded transition-colors ${
                  previewMode === "mobile" ? "bg-surface text-primary-ink shadow-sm" : "text-text-muted"
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview Container Frame */}
          <div
            className={`border border-border bg-surface rounded-2xl shadow-md p-6 space-y-5 mx-auto transition-all ${
              previewMode === "mobile" ? "max-w-[375px] text-xs" : "w-full text-sm"
            }`}
          >
            {/* Header */}
            <div className="space-y-2 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-text text-base leading-tight">
                    {activeBusiness.name}
                  </h2>
                  <div className="text-xs text-text-muted">
                    {activeBusiness.categoryLabel}
                  </div>
                </div>
              </div>

              {settings.locationAreaApproved && (
                <p className="text-xs text-text-muted">{settings.areaLabel}</p>
              )}
            </div>

            {/* Story */}
            {settings.storyApproved && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                  About the Business
                </span>
                <p className="text-text leading-relaxed text-xs">{settings.storyText}</p>
              </div>
            )}

            {/* Services */}
            {settings.servicesApproved && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                  Specialties & Products
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {settings.servicesList.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-surface-2 border border-border text-text text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics */}
            {settings.metricsApproved && (
              <div className="space-y-2 p-3 rounded-xl bg-surface-2/60 border border-border">
                <div className="flex items-center justify-between text-xs font-semibold text-text">
                  <span>Verified Operating Volume</span>
                  <span className="text-success text-[11px] font-medium">✓ Verified</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-text-muted block text-[10px]">Monthly Orders</span>
                    <span className="font-bold text-text tabular-nums">2,410+ Completed Bills</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">Data Coverage</span>
                    <span className="font-bold text-text tabular-nums">94% Bank Verified</span>
                  </div>
                </div>
              </div>
            )}

            {/* Demo Offer */}
            {settings.demoOfferApproved && (
              <div className="p-3.5 rounded-xl bg-accent-soft/40 border border-accent/30 space-y-1">
                <span className="text-xs font-bold text-accent flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {settings.demoOfferTitle}
                </span>
                <p className="text-xs text-text-muted">{settings.demoOfferDetail}</p>
              </div>
            )}

            <div className="pt-2 text-center text-[10px] text-text-muted border-t border-border">
              Powered by Central AI Micro-Business OS • Verified Merchant Profile
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
