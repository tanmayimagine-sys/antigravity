"use client";

import React, { useState } from "react";
import { useBusiness } from "@/components/shell/BusinessContext";
import { db } from "@/lib/db";
import { FileDropzone, UploadedFileInfo } from "@/components/shared/FileDropzone";
import { formatPaise, formatDate } from "@/lib/formatters";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Download,
  Check,
  ShieldCheck,
  Database,
} from "lucide-react";

export default function DataCentrePage() {
  const { activeBusiness } = useBusiness();
  const [activeTab, setActiveTab] = useState<"sources" | "corrections">("sources");
  const [sources, setSources] = useState(db.getDataSources(activeBusiness.id));
  const [financialRecords, setFinancialRecords] = useState(
    db.getFinancialRecords(activeBusiness.id)
  );
  const [toast, setToast] = useState<string | null>(null);

  const uncertainRecords = financialRecords.filter(
    (r) => r.status === "uncertain" || r.confidence < 75
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleCorrectionSubmit = (recordId: string, updatedAmount: number) => {
    db.updateFinancialRecord(activeBusiness.id, recordId, {
      amountPaise: updatedAmount,
      status: "verified",
      confidence: 98,
      note: "Field verified and corrected by business owner.",
    });
    setFinancialRecords(db.getFinancialRecords(activeBusiness.id));
    showToast("Record updated and marked as verified.");
  };

  const handleDownloadSample = () => {
    const csv =
      "data:text/csv;charset=utf-8," +
      "Date,Reference,Counterparty,Gross_Amount,Channel\n" +
      "2026-10-18,UPI-ICICI-994812,ICICI Merchant Settlement,450.00,UPI\n" +
      "2026-10-18,UPI-ICICI-994812,ICICI Merchant Settlement,450.00,UPI\n" + // Duplicate
      "2026-10-19,NEFT-UNIV-ENG-4412,Modern Engineering College,12500.00,Bank_Transfer\n" +
      "2026-10-20,UPI-PAYTM-33104,Direct QR Scanner,1850.00,UPI\n";

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", "microos_sample_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-semibold text-text tracking-tight">
              Data Centre
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-md font-medium border border-border bg-surface-2 text-text-muted">
              Ingestion & Correction
            </span>
          </div>
          <p className="text-[12.5px] text-text-muted mt-0.5">
            Normalized data feeds for{" "}
            <span className="font-medium text-text">{activeBusiness.name}</span>{" "}
            · Immutable source preservation
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border hover:bg-surface-2 text-[12.5px] font-medium text-text transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-text-muted" />
          Download Sample Messy File
        </button>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="px-4 py-3 rounded-md border border-success/30 bg-success-soft text-success text-[12.5px] font-medium">
          ✓ {toast}
        </div>
      )}

      {/* ── File Dropzone (with inline Process & Analyse) ── */}
      <FileDropzone
        onFilesUploaded={(newFiles) => {
          const readyCount = newFiles.filter((f) => f.status === "ready").length;
          if (readyCount > 0)
            showToast(
              `${readyCount} file(s) staged. Click "Process & Analyse" to run deterministic parser + AI report.`
            );
        }}
      />

      {/* ── Tabs: Data Sources | Correction Queue ── */}
      <div className="border-b border-border flex items-center gap-0 text-[13px]">
        <button
          type="button"
          onClick={() => setActiveTab("sources")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 -mb-px font-medium transition-colors ${
            activeTab === "sources"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          Configured Data Sources ({sources.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("corrections")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 -mb-px font-medium transition-colors ${
            activeTab === "corrections"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <AlertTriangle
            className={`w-3.5 h-3.5 ${
              uncertainRecords.length > 0 ? "text-warning" : "text-text-muted"
            }`}
          />
          Correction Queue
          {uncertainRecords.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-warning-soft text-warning text-[10px] font-bold font-mono ml-1">
              {uncertainRecords.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Tab 1: Configured Sources ── */}
      {activeTab === "sources" && (
        <div className="space-y-2">
          {sources.length === 0 ? (
            <div className="py-12 text-center text-[12.5px] text-text-muted rounded-lg border border-border bg-surface">
              No data sources configured yet. Upload a file above to get started.
            </div>
          ) : (
            sources.map((src) => (
              <div
                key={src.id}
                className="flex items-start sm:items-center justify-between gap-4 flex-wrap px-4 py-3.5 rounded-lg border border-border bg-surface hover:bg-surface-2/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-surface-2 border border-border flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-text-muted" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[13.5px] text-text">{src.name}</span>
                      {src.type === "pdf" && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-accent-soft text-accent border border-accent/30">
                          Beta OCR
                        </span>
                      )}
                    </div>
                    <div className="text-[11.5px] text-text-muted mt-0.5">
                      {src.fileName} · {src.recordCount} records · {src.periodStart} → {src.periodEnd}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-[13px] text-text tabular-nums">
                    {src.confidence}% Parser Confidence
                  </div>
                  <div className="text-[11px] text-success flex items-center gap-1 justify-end mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    Privately Stored
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Tab 2: Correction Queue ── */}
      {activeTab === "corrections" && (
        <div className="space-y-4">
          <div className="px-3.5 py-2.5 rounded-md border border-border bg-surface-2 text-[12.5px] text-text-muted">
            The OCR / CSV parser identified low-confidence values or smudged GST fields. Confirm or
            correct them below before metrics recalculate.
          </div>

          {uncertainRecords.length === 0 ? (
            <div className="py-12 text-center text-[12.5px] text-text-muted rounded-lg border border-border bg-surface">
              All parsed fields are verified. Correction queue is clear.
            </div>
          ) : (
            uncertainRecords.map((rec) => (
              <div
                key={rec.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-lg border border-warning/30 bg-surface"
              >
                {/* Left: OCR original */}
                <div className="md:col-span-5 rounded-md bg-surface-2 border border-border p-3 text-[12px] space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-2">
                    Original Document Capture
                  </span>
                  <div className="font-mono text-text space-y-1">
                    <div>Reference: <span className="text-text-muted">{rec.referenceNumber}</span></div>
                    <div>Vendor: <span className="text-text-muted">{rec.counterparty}</span></div>
                    <div>Date: <span className="text-text-muted">{formatDate(rec.date)}</span></div>
                    <div>
                      Raw Amount:{" "}
                      <span className="font-semibold text-warning">
                        ₹{(rec.amountPaise / 100).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border text-[11.5px] text-warning">
                    ⚠ {rec.note}
                  </div>
                </div>

                {/* Right: editable form */}
                <div className="md:col-span-7 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[12.5px] font-medium text-text block">
                      Confirm Reconciled Amount (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={rec.amountPaise / 100}
                      id={`input_${rec.id}`}
                      className="w-full px-3 py-2 rounded-md border border-border bg-surface-2 text-text text-[13px] font-semibold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-[11px] text-text-muted">Audit trail will log your approval.</span>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(`input_${rec.id}`) as HTMLInputElement;
                        const val = parseFloat(el?.value || "0");
                        handleCorrectionSubmit(rec.id, Math.round(val * 100));
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-primary text-white text-[12.5px] font-semibold hover:bg-primary-hover transition-colors active:scale-[0.97]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Verify & Accept
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
