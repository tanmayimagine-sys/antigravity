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
  Building,
  KeyRound,
  CheckCircle2,
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
  const investor = AUTH_USERS.find((u) => u.role === "funder")!;

  const handleInstantLogin = (user: AuthUser) => {
    switchUser(user.id);
    if (user.role === "funder") {
      router.push("/funding");
    } else {
      router.push("/dashboard");
    }
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

      // Check user role
      if (email.toLowerCase().includes("investor")) {
        router.push("/funding");
      } else {
        router.push("/dashboard");
      }
    }, 300);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary-ink text-xs font-semibold border border-primary/20">
            <Lock className="w-3.5 h-3.5" />
            <span>Strict Tenant Isolation & Role-Based Access</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">
            Central AI Operating System Sign In
          </h1>
          <p className="text-sm text-text-muted max-w-lg mx-auto">
            Each shop has its own credentials and isolated database. Investors access the multi-business capital discovery portal.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-center gap-2 border-b border-border pb-2">
          <button
            type="button"
            onClick={() => { setActiveTab("owners"); setError(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "owners"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-text-muted hover:bg-surface-2 hover:text-text"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>🏬 Shop Owners (Har Dukaan Ka Login)</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("investor"); setError(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "investor"
                ? "bg-accent text-white shadow-sm"
                : "text-text-muted hover:bg-surface-2 hover:text-text"
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>💼 Investor & Syndicate Portal</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("login_form"); setError(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "login_form"
                ? "bg-surface-2 text-text border border-border"
                : "text-text-muted hover:bg-surface-2 hover:text-text"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Custom Sign In Form</span>
          </button>
        </div>

        {/* TAB 1: SHOP OWNERS (3 DISTINCT SHOPS) */}
        {activeTab === "owners" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-primary-soft/30 border border-primary/20 text-xs text-text-muted flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-primary-ink shrink-0" />
              <span>
                <strong>Zero Cross-Tenant Bleed:</strong> Logging into a store locks your session strictly to that business. You cannot view or modify another shop owner&apos;s records.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shopOwners.map((owner) => (
                <div
                  key={owner.id}
                  className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary-ink flex items-center justify-center font-bold text-sm">
                        {owner.avatarInitials}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 font-semibold text-text-muted border border-border">
                        {owner.city}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-text">{owner.businessName}</h3>
                      <p className="text-xs text-text-muted mt-0.5">{owner.businessCategory}</p>
                    </div>

                    <div className="p-2.5 rounded bg-surface-2 border border-border text-[11px] space-y-1">
                      <div className="flex justify-between text-text">
                        <span className="text-text-muted">Owner:</span>
                        <span className="font-semibold">{owner.name}</span>
                      </div>
                      <div className="flex justify-between text-text">
                        <span className="text-text-muted">Email:</span>
                        <span className="font-mono text-primary-ink">{owner.email}</span>
                      </div>
                      <div className="flex justify-between text-text">
                        <span className="text-text-muted">Password:</span>
                        <span className="font-mono text-text-muted">{owner.password}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInstantLogin(owner)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98]"
                  >
                    <span>Sign In to {owner.businessName.split(" ")[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INVESTOR & SYNDICATE PORTAL */}
        {activeTab === "investor" && (
          <div className="max-w-xl mx-auto rounded-xl border border-accent/40 bg-surface p-6 sm:p-8 space-y-6 shadow-md animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center shadow-sm shrink-0">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-soft text-accent">
                  Marketplace Discovery Role
                </span>
                <h3 className="font-extrabold text-xl text-text mt-1">
                  Growth Syndicate Investor Portal
                </h3>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Investors receive multi-business discovery access to evaluate verified Business Health Profiles (BHP 0-100), 30-day gross sales, and net cash flow across all listed shops.
            </p>

            <div className="p-3.5 rounded-lg bg-surface-2 border border-border text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Accredited Investor:</span>
                <span className="font-bold text-text">{investor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Fund / Syndicate:</span>
                <span className="font-medium text-text">{investor.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Investor Email:</span>
                <span className="font-mono text-accent font-semibold">{investor.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Access Scope:</span>
                <span className="font-semibold text-accent">All 3 Listed Businesses (Simulated)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-accent-soft/30 border border-accent/20 text-[11px] text-text-muted space-y-1">
              <div className="font-semibold text-accent flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>Security Assurance</span>
              </div>
              <p>
                Investors CANNOT view internal private POS registers, cannot modify store reconciliation, and cannot alter shop settings.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleInstantLogin(investor)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-bold text-sm hover:opacity-95 shadow-md transition-transform active:scale-[0.98]"
            >
              <span>Enter Investor Discovery Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 3: CUSTOM SIGN IN FORM */}
        {activeTab === "login_form" && (
          <div className="max-w-md mx-auto rounded-xl border border-border bg-surface p-6 sm:p-8 space-y-5 shadow-sm animate-in fade-in">
            <div>
              <h3 className="font-bold text-lg text-text">Sign In with Credentials</h3>
              <p className="text-xs text-text-muted mt-0.5">
                Enter your registered store owner or investor email.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-danger-soft text-danger border border-danger/30 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-text block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. owner@vidya.demo or investor@venture.demo"
                  className="w-full p-2.5 rounded-lg border border-border bg-surface text-text text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-text block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                    className="w-full p-2.5 pr-10 rounded-lg border border-border bg-surface text-text text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
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
                <span className="text-[10px] text-text-muted mt-1 block">
                  Default demonstration password: <code className="font-mono text-primary-ink">password123</code>
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? <span>Authenticating...</span> : <span>Sign In</span>}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
