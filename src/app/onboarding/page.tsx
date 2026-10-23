"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/shared/Stepper";
import { FileDropzone } from "@/components/shared/FileDropzone";
import {
  Store,
  FileCheck2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  Building,
  Coffee,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("stationery");
  const [city, setCity] = useState("Pune");
  const [gstin, setGstin] = useState("");

  // Consent states: Explicit per source & purpose, DEFAULT TO OFF
  const [consentPos, setConsentPos] = useState(false);
  const [consentBank, setConsentBank] = useState(false);
  const [consentReviews, setConsentReviews] = useState(false);

  const steps = [
    { number: 1, label: "Basics", description: "Business identity" },
    { number: 2, label: "Template", description: "Industry presets" },
    { number: 3, label: "Consent", description: "Explicit data permissions" },
    { number: 4, label: "Connect", description: "Upload initial files" },
  ];

  const templates = [
    { id: "stationery", name: "Stationery & Xerox Hub", icon: BookOpen, desc: "Configured for exam seasonality, ream stockouts, bulk printing contracts." },
    { id: "cafe", name: "Café & Quick Service", icon: Coffee, desc: "Pre-configured for aggregator delays, breakfast rush, recipe ingredient cost." },
    { id: "ice_cream", name: "Artisanal Ice Cream", icon: Sparkles, desc: "Tuned for summer evening surge, dairy refrigeration power costs." },
    { id: "retail", name: "Local Kirana & Retail", icon: Store, desc: "High SKU inventory, credit ledger (udhaar), fast-moving FMCG tracking." },
  ];

  const handleFinish = () => {
    router.push("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
          Welcome to Central AI
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          Setup your business in 4 easy steps. Complete privacy and tenant isolation guaranteed.
        </p>
      </div>

      {/* Stepper */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step < currentStep) setCurrentStep(step);
        }}
      />

      {/* Step Content */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Step 1: Business Basics */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-base text-text">Business Identification</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-text block mb-1">Business Operating Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Vidya Stationery & Xerox"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-surface text-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-text block mb-1">City / Town *</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-surface text-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  />
                </div>
                <div>
                  <label className="font-semibold text-text block mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="27AABCU9603R1ZM"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-surface text-text text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Industry Template */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-base text-text">Select Industry Profile</h3>
            <p className="text-xs text-text-muted">
              Applies domain-specific unit economics, benchmark ratios, and growth playbooks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                const isSelected = category === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setCategory(tpl.id)}
                    className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? "border-primary bg-primary-soft/30 shadow-sm"
                        : "border-border bg-surface hover:bg-surface-2"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-primary-ink" : "text-text-muted"}`} />
                      <span className="font-bold text-text text-sm">{tpl.name}</span>
                    </div>
                    <p className="text-text-muted leading-relaxed">{tpl.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Explicit Consent Toggles (Default OFF) */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-border pb-2">
              <h3 className="font-bold text-base text-text">Granular Data Consent</h3>
              <p className="text-xs text-text-muted">
                In strict accordance with data privacy standards, all permissions default to OFF. You control what the Central AI accesses.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Consent 1: POS / Sales Records */}
              <div className="p-3.5 rounded-xl border border-border bg-surface-2/60 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-semibold text-text">POS & Counter Sales Ingestion</div>
                  <p className="text-text-muted">
                    Authorize reading of itemized bills to calculate hero product rankings, unit margins, and AOV.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConsentPos(!consentPos)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    consentPos ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform transform ${
                      consentPos ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Consent 2: Bank Statement Reconciliation */}
              <div className="p-3.5 rounded-xl border border-border bg-surface-2/60 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-semibold text-text">Bank Credit & Settlement Matching</div>
                  <p className="text-text-muted">
                    Authorize deterministic reconciliation between QR/card payouts and counter sales.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConsentBank(!consentBank)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    consentBank ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform transform ${
                      consentBank ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Consent 3: Google Reviews */}
              <div className="p-3.5 rounded-xl border border-border bg-surface-2/60 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-semibold text-text">Google Business Reviews Coaching</div>
                  <p className="text-text-muted">
                    Authorize read access to public customer reviews to identify service bottlenecks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConsentReviews(!consentReviews)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    consentReviews ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform transform ${
                      consentReviews ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Connect / Upload Data */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-base text-text">Upload Initial Operating Data</h3>
            <p className="text-xs text-text-muted">
              Add your recent sales register or statement. You can also start with our pre-loaded synthetic demo records.
            </p>

            <FileDropzone />
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-2 text-xs font-semibold text-text transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98]"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Launch Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
