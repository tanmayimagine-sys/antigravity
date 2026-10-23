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
  Edit2,
  ShieldCheck,
  Database,
  ArrowRight,
} from "lucide-react";

export default function DataCentrePage() {
  const { activeBusiness } = useBusiness();
  const [activeTab, setActiveTab] = useState<"sources" | "corrections">("sources");
  const [sources, setSources] = useState(db.getDataSources(activeBusiness.id));
  const [financialRecords, setFinancialRecords] = useState(db.getFinancialRecords(activeBusiness.id));
  const [toast, setToast] = useState<string | null>(null);

  // Uncertain / needs review records
  const uncertainRecords = financialRecords.filter(
    (r) => r.status === "uncertain" || r.confidence < 75
  );

  const handleCorrectionSubmit = (recordId: string, updatedAmount: number) => {
    db.updateFinancialRecord(activeBusiness.id, recordId, {
      amountPaise: updatedAmount,
      status: "verified",
      confidence: 98,
      note: "Field verified and corrected by business owner.",
    });

    setFinancialRecords(db.getFinancialRecords(activeBusiness.id));
    setToast("Record field updated and marked as verified.");
    setTimeout(() => setToast(null), 3500);
  };

  const handleDownloadSample = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Reference,Counterparty,Gross_Amount,Channel\n" +
      "2026-10-18,UPI-ICICI-994812,ICICI Merchant Settlement,450.00,UPI\n" +
      "2026-10-18,UPI-ICICI-994812,ICICI Merchant Settlement,450.00,UPI\n" + // Dupe
      "2026-10-19,NEFT-UNIV-ENG-4412,Modern Engineering College,12500.00,Bank_Transfer\n" +
      "2026-10-20,UPI-PAYTM-33104,Direct QR Scanner,1850.00,UPI\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_messy_pos_settlements.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              Data Centre
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-surface-2 border border-border text-text-muted">
              Ingestion & Correction
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Normalized data feeds for <strong>{activeBusiness.name}</strong> • Immutable source preservation
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-2 text-xs font-medium text-text transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-text-muted" />
          <span>Download Sample Messy File</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 rounded-lg bg-success-soft text-success border border-success/30 text-xs font-medium animate-in fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Large Ingestion Dropzone */}
      <FileDropzone
        onFilesUploaded={(newFiles) => {
          setToast(`Uploaded ${newFiles.length} file(s). Running deterministic parser.`);
          setTimeout(() => setToast(null), 3500);
        }}
      />

      {/* Navigation Tabs: Data Sources vs Correction Queue */}
      <div className="border-b border-border flex items-center gap-6 text-sm">
        <button
          type="button"
          onClick={() => setActiveTab("sources")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "sources"
              ? "border-primary text-primary-ink"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Configured Data Sources ({sources.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("corrections")}
          className={`py-2.5 font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "corrections"
              ? "border-primary text-primary-ink"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span>Correction Queue</span>
          {uncertainRecords.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-warning-soft text-warning text-xs font-mono font-bold">
              {uncertainRecords.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Connected Sources */}
      {activeTab === "sources" && (
        <div className="space-y-3">
          {sources.map((src) => (
            <div
              key={src.id}
              className="p-4 rounded-xl border border-border bg-surface hover:bg-surface-2/40 transition-colors flex items-start sm:items-center justify-between gap-4 flex-wrap"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-text-muted mt-0.5 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text text-sm">{src.name}</span>
                    {src.type === "pdf" && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-accent-soft text-accent border border-accent/30">
                        Beta OCR
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {src.fileName} • {src.recordCount} records parsed • Period: {src.periodStart} to {src.periodEnd}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  <div className="font-bold text-text tabular-nums">{src.confidence}% Parser Confidence</div>
                  <span className="text-[11px] text-success flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3 h-3" /> Privately Stored
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Correction Queue (Side-by-side verification) */}
      {activeTab === "corrections" && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-surface-2 text-xs text-text-muted">
            The OCR / CSV parser identified low-confidence values or smudged GST fields. Confirm or correct them below before metrics recalculate.
          </div>

          {uncertainRecords.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted bg-surface rounded-xl border border-border">
              All parsed fields are verified. Correction queue is clear.
            </div>
          ) : (
            uncertainRecords.map((rec) => (
              <div
                key={rec.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 rounded-xl border border-warning/40 bg-surface shadow-sm"
              >
                {/* Left: Original File Preview (5 cols) */}
                <div className="md:col-span-5 space-y-2 p-3 rounded-lg bg-surface-2 border border-border text-xs">
                  <span className="font-semibold text-text-muted block uppercase text-[10px]">
                    Original Document Capture (Beta OCR)
                  </span>
                  <div className="font-mono text-text space-y-1">
                    <div>Reference: {rec.referenceNumber}</div>
                    <div>Extracted Vendor: {rec.counterparty}</div>
                    <div>Date: {formatDate(rec.date)}</div>
                    <div>Raw OCR Amount: ₹{(rec.amountPaise / 100).toLocaleString("en-IN")}</div>
                  </div>
                  <div className="text-warning text-[11px] pt-1 border-t border-border">
                    Flag: {rec.note}
                  </div>
                </div>

                {/* Right: Editable Verification Form (7 cols) */}
                <div className="md:col-span-7 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text block">
                      Confirm Reconciled Amount (in Rupees):
                    </label>
                    <input
                      type="number"
                      defaultValue={rec.amountPaise / 100}
                      id={`input_${rec.id}`}
                      className="w-full p-2 rounded-md border border-border bg-surface text-text text-sm font-semibold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-[11px] text-text-muted">
                      Audit trail will log your approval.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const inputEl = document.getElementById(`input_${rec.id}`) as HTMLInputElement;
                        const val = parseFloat(inputEl?.value || "0");
                        handleCorrectionSubmit(rec.id, Math.round(val * 100));
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify & Accept</span>
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
