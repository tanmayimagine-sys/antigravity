"use client";

import React, { useState } from "react";
import { useBusiness } from "@/components/shell/BusinessContext";
import { db } from "@/lib/db";
import { DataTable, Column } from "@/components/shared/DataTable";
import { formatDate } from "@/lib/formatters";
import {
  ShieldAlert,
  Users,
  Flag,
  AlertCircle,
  Link as LinkIcon,
  History,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AuditEvent } from "@/lib/types";

export default function AdminConsolePage() {
  const { activeBusiness } = useBusiness();
  const [activeTab, setActiveTab] = useState<"flags" | "users" | "complaints" | "integrations" | "audit">("flags");
  const auditLogs = db.getAuditLogs();

  const auditColumns: Column<AuditEvent>[] = [
    { key: "timestamp", header: "Timestamp", render: (a) => formatDate(a.timestamp) },
    { key: "businessId", header: "Business Tenant" },
    { key: "userName", header: "Actor" },
    { key: "eventType", header: "Event Code" },
    { key: "action", header: "Action Taken" },
    { key: "details", header: "Security Details" },
  ];

  const mockUsers = [
    { id: "usr_1", name: "Ramesh Sharma", email: "ramesh@vidyastationery.demo", role: "Owner", business: "Vidya Stationery", status: "Active" },
    { id: "usr_2", name: "Priya Mehta", email: "priya@accounts.demo", role: "Scoped Staff / Accountant", business: "Vidya Stationery", status: "Active" },
    { id: "usr_3", name: "Kunal Shah", email: "kunal@syndicate.demo", role: "Simulated Funder", business: "Global Funder Portal", status: "Verified" },
    { id: "usr_4", name: "Platform Admin", email: "security@centralai.internal", role: "Admin", business: "All Tenants (Isolated)", status: "Active" },
  ];

  const mockIntegrations = [
    { id: "int_1", name: "Google Business Profile API", status: "Connected", scope: "Review Sync & Reply Drafts", lastSync: "10 mins ago" },
    { id: "int_2", name: "UrbanPiper Unified POS Sync", status: "Connected", scope: "Orders & Hourly Shifts", lastSync: "2 mins ago" },
    { id: "int_3", name: "ICICI Merchant UPI Webhook", status: "Connected", scope: "Direct QR Credit Notification", lastSync: "1 min ago" },
    { id: "int_4", name: "GSTN Sandbox Tax Portal", status: "Sandbox Mode", scope: "GSTR-1 Sales Verification Mock", lastSync: "1 hour ago" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Platform Admin Console
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-danger-soft text-danger border border-danger/30">
            SYSTEM GOVERNANCE
          </span>
        </div>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Role-based access, regulatory feature gates, integration health, and immutable audit logs.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex items-center gap-6 text-sm overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("flags")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
            activeTab === "flags" ? "border-primary text-primary-ink" : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Feature Flags & Gates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
            activeTab === "users" ? "border-primary text-primary-ink" : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Roles (4)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("integrations")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
            activeTab === "integrations" ? "border-primary text-primary-ink" : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>Connected APIs (4)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("complaints")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
            activeTab === "complaints" ? "border-primary text-primary-ink" : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <AlertCircle className="w-4 h-4 text-warning" />
          <span>Disputes & Complaints (0)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audit")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
            activeTab === "audit" ? "border-primary text-primary-ink" : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab: Feature Flags */}
      {activeTab === "flags" && (
        <div className="space-y-4">
          {/* HARD LOCKED REGULATORY GATE */}
          <div className="p-5 rounded-xl border-2 border-danger/40 bg-danger-soft/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-danger">
                <Lock className="w-5 h-5" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  Live Funding & Payment Collection: BLOCKED
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-danger text-white text-xs font-mono font-bold">
                LOCKED HARD GATE
              </span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              <strong>Mandatory Compliance Lock:</strong> In accordance with Indian NBFC, RBI lending guidelines, SEBI regulations, and micro-business safety requirements, all money transactions, pooled financing, and real collections remain strictly locked and disabled in this release.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-danger/20 text-xs">
              <span className="text-text-muted">Status: Non-overridable in MVP build</span>
              <span className="font-mono text-[11px] text-danger font-semibold">
                Lock Hash: SEC-RBAC-FUNDING-BLOCKED-V2
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-surface flex items-center justify-between">
              <div>
                <span className="font-semibold text-text text-sm">Deterministic Reconciliation Engine</span>
                <p className="text-xs text-text-muted mt-0.5">Tolerance & window matching</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-success-soft text-success">
                Enabled (v2.0)
              </span>
            </div>

            <div className="p-4 rounded-xl border border-border bg-surface flex items-center justify-between">
              <div>
                <span className="font-semibold text-text text-sm">Sample AI Fallback Mode</span>
                <p className="text-xs text-text-muted mt-0.5">Offline schema-valid responses</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-success-soft text-success">
                Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users & Roles */}
      {activeTab === "users" && (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-2 text-text-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Role Scope</th>
                <th className="px-4 py-3 font-semibold">Assigned Business</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {mockUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-2/40">
                  <td className="px-4 py-3 font-medium text-text">
                    <div>{u.name}</div>
                    <div className="text-[11px] text-text-muted">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-primary-ink">{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{u.business}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-success text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Integrations */}
      {activeTab === "integrations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockIntegrations.map((int) => (
            <div key={int.id} className="p-4 rounded-xl border border-border bg-surface space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-text text-sm">{int.name}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-success-soft text-success">
                  {int.status}
                </span>
              </div>
              <p className="text-xs text-text-muted">Scope: {int.scope}</p>
              <div className="text-[10px] text-text-muted font-mono pt-1 border-t border-border">
                Last Heartbeat: {int.lastSync}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Complaints */}
      {activeTab === "complaints" && (
        <div className="rounded-xl border border-border bg-surface p-8 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
          <h4 className="font-bold text-text text-sm">Zero Active Complaints</h4>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            No customer disputes or reconciliation escalation tickets currently logged.
          </p>
        </div>
      )}

      {/* Tab: Audit Log */}
      {activeTab === "audit" && (
        <div className="space-y-3">
          <DataTable
            data={auditLogs}
            columns={auditColumns}
            exportFileName="platform_governance_audit_log.csv"
          />
        </div>
      )}
    </div>
  );
}
