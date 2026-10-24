"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/components/shell/BusinessContext";
import { AUTH_USERS, AuthUser } from "@/lib/auth/users";
import {
  Store,
  Coins,
  Shield,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Briefcase,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials, switchUser } = useBusiness();

  const [activeTab, setActiveTab] = useState<"owners" | "investor" | "login_form">("owners");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const shopOwners = AUTH_USERS.filter((u) => u.role === "owner");
  const investor   = AUTH_USERS.find((u) => u.role === "funder")!;

  const handleInstantLogin = (user: AuthUser) => {
    switchUser(user.id);
    router.push(user.role === "funder" ? "/funding" : "/dashboard");
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginWithCredentials(email, password);
      setIsLoading(false);

      if (!result.success) {
        setError(result.error || "Authentication failed");
        return;
      }

      router.push(email.toLowerCase().includes("investor") ? "/funding" : "/dashboard");
    }, 300);
  };

  const tabs = [
    { id: "owners" as const, label: "Shop Owners", icon: Store },
    { id: "investor" as const, label: "Investor Portal", icon: Briefcase },
    { id: "login_form" as const, label: "Sign In Form", icon: KeyRound },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-5">
      <div className="w-full max-w-3xl space-y-8">

        {/* ── Header ── */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border text-[11.5px] text-text-muted">
            <Lock className="w-3 h-3" />
            Strict Tenant Isolation & Role-Based Access
          </div>
          <h1 className="text-[28px] font-bold text-text tracking-tight">
            Central AI OS — Sign In
          </h1>
          <p className="text-[13px] text-text-muted max-w-md mx-auto leading-relaxed">
            Each shop has its own credentials and isolated database. Investors access the
            multi-business capital discovery portal.
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center justify-center">
          <div className="inline-flex border border-border rounded-lg p-1 bg-surface-2 gap-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id); setError(null); }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                    isActive
                      ? "bg-surface text-text border border-border shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab: Shop Owners ── */}
        {activeTab === "owners" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-md border border-border bg-surface text-[12px] text-text-muted">
              <Shield className="w-4 h-4 text-primary shrink-0" />
              <span>
                <strong className="text-text">Zero Cross-Tenant Bleed:</strong> Logging into a store locks your session strictly to that business. You cannot view or modify another owner&apos;s records.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shopOwners.map((owner) => (
                <div
                  key={owner.id}
                  className="rounded-lg border border-border bg-surface p-4 space-y-4 flex flex-col justify-between hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-md bg-surface-2 border border-border flex items-center justify-center font-bold text-[13px] text-text">
                        {owner.avatarInitials}
                      </div>
                      <span className="text-[10.5px] px-2 py-0.5 rounded-md border border-border bg-surface-2 text-text-muted font-medium">
                        {owner.city}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[14px] text-text">{owner.businessName}</h3>
                      <p className="text-[11.5px] text-text-muted mt-0.5">{owner.businessCategory}</p>
                    </div>

                    <div className="rounded-md bg-surface-2 border border-border p-2.5 text-[11.5px] space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Owner</span>
                        <span className="font-medium text-text">{owner.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Email</span>
                        <span className="font-mono text-primary text-[11px]">{owner.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Password</span>
                        <span className="font-mono text-text-muted">{owner.password}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInstantLogin(owner)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-[12.5px] font-semibold hover:bg-primary-hover transition-colors active:scale-[0.98]"
                  >
                    Sign In to {owner.businessName.split(" ")[0]}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Investor Portal ── */}
        {activeTab === "investor" && (
          <div className="max-w-lg mx-auto rounded-lg border border-border bg-surface p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-[10.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border border-border bg-surface-2 text-text-muted">
                  Marketplace Discovery Role
                </span>
                <h3 className="font-bold text-[18px] text-text mt-1">
                  Growth Syndicate Investor Portal
                </h3>
              </div>
            </div>

            <p className="text-[12.5px] text-text-muted leading-relaxed">
              Investors receive multi-business discovery access to evaluate verified Business
              Health Profiles (BHP 0–100), 30-day gross sales, and net cash flow across all
              listed shops.
            </p>

            <div className="rounded-md bg-surface-2 border border-border p-3 text-[12px] space-y-2">
              {[
                { label: "Accredited Investor", value: investor.name },
                { label: "Fund / Syndicate",    value: investor.businessName },
                { label: "Investor Email",       value: investor.email, mono: true, highlight: true },
                { label: "Access Scope",         value: "All 3 Listed Businesses (Simulated)", accent: true },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-text-muted">{row.label}</span>
                  <span
                    className={`font-medium ${
                      row.mono ? "font-mono text-[11px]" : ""
                    } ${row.highlight ? "text-primary" : row.accent ? "text-accent" : "text-text"}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-md border border-border bg-surface text-[11.5px] text-text-muted">
              <Lock className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p>
                Investors <strong className="text-text">cannot</strong> view internal POS registers,
                modify store reconciliation, or alter shop settings.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleInstantLogin(investor)}
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-accent text-white font-semibold text-[13px] hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Enter Investor Discovery Portal
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Tab: Sign In Form ── */}
        {activeTab === "login_form" && (
          <div className="max-w-sm mx-auto rounded-lg border border-border bg-surface p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-[16px] text-text">Sign In with Credentials</h3>
              <p className="text-[12px] text-text-muted mt-0.5">
                Enter your registered store owner or investor email.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-danger/30 bg-danger-soft text-danger text-[12px]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleFormLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium text-text block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@vidya.demo"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface-2 text-text text-[13px] placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium text-text block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                    className="w-full px-3 py-2 pr-10 rounded-md border border-border bg-surface-2 text-text text-[13px] placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:border-primary transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-text-muted">
                  Demo password:{" "}
                  <code className="font-mono text-primary">password123</code>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-white font-semibold text-[13px] hover:bg-primary-hover transition-colors active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? "Authenticating..." : "Sign In"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
