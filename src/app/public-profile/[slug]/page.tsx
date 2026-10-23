import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Store, ShieldCheck, MapPin, Sparkles, ExternalLink } from "lucide-react";
import { ThemeQuickToggle } from "@/components/theme/ThemeQuickToggle";

export default function PublicBusinessSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const business = db.getBusinessBySlug(params.slug);
  if (!business) {
    // If not found by slug, fallback to first demo business
    const fallback = db.getBusinessById("biz_stationery");
    if (!fallback) notFound();
  }

  const activeBiz = business || db.getBusinessById("biz_stationery")!;
  const profile = db.getPublicProfile(activeBiz.id) || db.getPublicProfile("biz_stationery")!;

  return (
    <div className="min-h-screen bg-bg text-text py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Minimal Bar */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-text">Central AI Business Network</span>
          </div>
          <ThemeQuickToggle />
        </div>

        {/* Business Hero Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                {activeBiz.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-soft text-success border border-success/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Merchant</span>
              </span>
            </div>

            <p className="text-sm font-medium text-text-muted">{activeBiz.categoryLabel}</p>

            {profile.locationAreaApproved && (
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span>{profile.areaLabel}</span>
              </div>
            )}
          </div>

          {/* Story */}
          {profile.storyApproved && (
            <div className="space-y-1.5 pt-2 border-t border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                About the Business
              </h3>
              <p className="text-sm text-text leading-relaxed">{profile.storyText}</p>
            </div>
          )}

          {/* Specialities / Services */}
          {profile.servicesApproved && (
            <div className="space-y-2 pt-2 border-t border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Highlighted Services & Products
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.servicesList.map((service, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-surface-2 border border-border text-text text-xs font-medium"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verified Metrics (if approved by owner) */}
          {profile.metricsApproved && (
            <div className="p-4 rounded-xl bg-surface-2/60 border border-border space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text">
                Verified Operational Track Record
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-text-muted block text-[11px]">Monthly Order Volume</span>
                  <span className="font-bold text-text text-sm tabular-nums">2,410+ Completed Bills</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Reconciliation Coverage</span>
                  <span className="font-bold text-text text-sm tabular-nums">94% Bank Verified</span>
                </div>
              </div>
            </div>
          )}

          {/* Demo Offer / Customer Pass */}
          {profile.demoOfferApproved && (
            <div className="p-4 rounded-xl bg-accent-soft border border-accent/40 space-y-1 text-xs">
              <div className="font-bold text-accent flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>{profile.demoOfferTitle}</span>
              </div>
              <p className="text-text-muted leading-relaxed">{profile.demoOfferDetail}</p>
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <div className="text-center text-xs text-text-muted space-y-2">
          <p>
            This public profile contains only owner-approved information. Sensitive bank statements, tax IDs, and private margins are strictly isolated and never published.
          </p>
          <div>
            <a href="/" className="font-semibold text-primary-ink hover:underline">
              ← Return to Central AI OS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
