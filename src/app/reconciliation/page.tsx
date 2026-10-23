"use client";

import React, { useState } from "react";
import { useBusiness } from "@/components/shell/BusinessContext";
import { db } from "@/lib/db";
import { ExceptionQueue, ExceptionItem } from "@/components/shared/ExceptionQueue";
import { DataTable, Column } from "@/components/shared/DataTable";
import { formatPaise, formatDate } from "@/lib/formatters";
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  Copy,
  History,
  ShieldCheck,
} from "lucide-react";
import { FinancialRecord, AuditEvent } from "@/lib/types";

export default function ReconciliationPage() {
  const { activeBusiness } = useBusiness();
  const [activeTab, setActiveTab] = useState<"unmatched" | "matched" | "duplicates" | "audit">("unmatched");

  const financialRecords = db.getFinancialRecords(activeBusiness.id);
  const auditLogs = db.getAuditLogs(activeBusiness.id);
  const orders = db.getOrders(activeBusiness.id);

  const duplicates = financialRecords.filter((r) => r.isDuplicate || r.status === "duplicate");
  const matched = financialRecords.filter((r) => r.status === "verified" || r.status === "matched");

  // Format exception queue items
  const exceptionItems: ExceptionItem[] = [
    {
      id: "exc_stat_01",
      settlement: {
        id: "rec_stat_03_unmatched",
        businessId: activeBusiness.id,
        dataSourceId: "ds_stat_upi",
        type: "settlement",
        amountPaise: 1250000, // ₹12,500
        rawAmount: 12500.0,
        date: "2026-10-19",
        referenceNumber: "NEFT-UNIV-ENG-4412",
        counterparty: "Modern Engineering College Pune",
        channel: "bank_transfer",
        status: "unmatched",
        confidence: 72,
      },
      suggestedOrders: [
        {
          id: "ord_stat_102",
          businessId: activeBusiness.id,
          orderNumber: "ORD-2026-102",
          date: "2026-10-19",
          time: "11:30",
          channel: "bank_transfer",
          totalPaise: 650000,
          taxPaise: 32500,
          status: "completed",
          linesCount: 3,
        },
        {
          id: "ord_stat_103",
          businessId: activeBusiness.id,
          orderNumber: "ORD-2026-103",
          date: "2026-10-19",
          time: "12:00",
          channel: "bank_transfer",
          totalPaise: 600000,
          taxPaise: 30000,
          status: "completed",
          linesCount: 2,
        },
      ],
      differencePaise: 0, // Exact 6500 + 6000 = 12500 match!
      matchConfidence: 96,
      reason: "Bulk university semester exam printing bill split across two order slips (₹6,500 + ₹6,000 = ₹12,500).",
    },
    {
      id: "exc_stat_02",
      settlement: {
        id: "rec_stat_04_unmatched",
        businessId: activeBusiness.id,
        dataSourceId: "ds_stat_upi",
        type: "settlement",
        amountPaise: 185000, // ₹1,850
        rawAmount: 1850.0,
        date: "2026-10-20",
        referenceNumber: "UPI-PAYTM-33104",
        counterparty: "Direct UPI Scanner",
        channel: "upi",
        status: "unmatched",
        confidence: 68,
      },
      suggestedOrders: [
        {
          id: "ord_stat_104",
          businessId: activeBusiness.id,
          orderNumber: "ORD-2026-104",
          date: "2026-10-20",
          time: "14:20",
          channel: "upi",
          totalPaise: 170000, // ₹1,700
          taxPaise: 8500,
          status: "completed",
          linesCount: 2,
        },
      ],
      differencePaise: 15000, // ₹150 tip/fee variance
      matchConfidence: 84,
      reason: "Customer scanned counter QR with ₹150 tip/fee difference vs POS total ₹1,700.",
    },
  ];

  const matchedColumns: Column<FinancialRecord>[] = [
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    { key: "referenceNumber", header: "Reference" },
    { key: "counterparty", header: "Counterparty / Channel" },
    {
      key: "amountPaise",
      header: "Reconciled Amount",
      render: (r) => (
        <span className="font-semibold text-text tabular-nums">
          {formatPaise(r.amountPaise)}
        </span>
      ),
    },
    {
      key: "confidence",
      header: "Status",
      render: () => (
        <span className="inline-flex items-center gap-1 text-success text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled
        </span>
      ),
    },
  ];

  const duplicateColumns: Column<FinancialRecord>[] = [
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    { key: "referenceNumber", header: "Duplicate Reference" },
    { key: "counterparty", header: "Channel" },
    {
      key: "amountPaise",
      header: "Flagged Amount",
      render: (r) => (
        <span className="font-semibold text-danger tabular-nums">
          {formatPaise(r.amountPaise)}
        </span>
      ),
    },
    {
      key: "note",
      header: "Conservative Reason",
      render: (r) => <span className="text-xs text-text-muted">{r.note}</span>,
    },
  ];

  const auditColumns: Column<AuditEvent>[] = [
    { key: "timestamp", header: "Timestamp", render: (a) => formatDate(a.timestamp) },
    { key: "userName", header: "User / Operator" },
    { key: "eventType", header: "Event" },
    { key: "action", header: "Action Taken" },
    { key: "details", header: "Provenance Details" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Reconciliation Workspace
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-surface-2 border border-border text-text-muted">
            Bank vs POS Matches
          </span>
        </div>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Deterministic settlement matching for <strong>{activeBusiness.name}</strong>
        </p>
      </div>

      {/* Top Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Settlement Match Rate</span>
            <ShieldCheck className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold text-text tabular-nums">98.2%</div>
          <div className="text-[11px] text-success font-medium">Reconciled to verified orders</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Unmatched Inflows</span>
            <AlertTriangle className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-bold text-warning tabular-nums">2 Records</div>
          <div className="text-[11px] text-text-muted">Awaiting Exception Queue approval</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Duplicates Flagged</span>
            <Copy className="w-4 h-4 text-text-muted" />
          </div>
          <div className="text-2xl font-bold text-text tabular-nums">{duplicates.length} Blocked</div>
          <div className="text-[11px] text-text-muted">Zero duplicate revenue inflation</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex items-center gap-6 text-sm">
        <button
          type="button"
          onClick={() => setActiveTab("unmatched")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "unmatched"
              ? "border-primary text-primary-ink"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span>Exception Queue (2)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("matched")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "matched"
              ? "border-primary text-primary-ink"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span>Matched Records ({matched.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("duplicates")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "duplicates"
              ? "border-primary text-primary-ink"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <Copy className="w-4 h-4" />
          <span>Flagged Duplicates ({duplicates.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audit")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "audit"
              ? "border-primary text-primary-ink"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit History</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "unmatched" && (
        <ExceptionQueue
          items={exceptionItems}
          onResolve={(id, action) => {
            db.logAudit({
              businessId: activeBusiness.id,
              userId: "usr_owner_1",
              userName: "Ramesh Sharma",
              eventType: "RECONCILIATION_EXCEPTION",
              action: `Action '${action}' applied on exception item ${id}`,
              details: "Reconciliation match resolved via ExceptionQueue",
            });
          }}
        />
      )}

      {activeTab === "matched" && (
        <DataTable
          data={matched}
          columns={matchedColumns}
          exportFileName="matched_reconciliations.csv"
        />
      )}

      {activeTab === "duplicates" && (
        <DataTable
          data={duplicates}
          columns={duplicateColumns}
          exportFileName="duplicate_settlements_blocked.csv"
        />
      )}

      {activeTab === "audit" && (
        <DataTable
          data={auditLogs}
          columns={auditColumns}
          exportFileName="reconciliation_audit_log.csv"
        />
      )}
    </div>
  );
}
