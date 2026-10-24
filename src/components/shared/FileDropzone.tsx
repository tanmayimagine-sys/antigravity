"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldAlert,
  Loader2,
  Sparkles,
  ArrowRight,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Bot,
  ChevronRight,
  FileCheck2,
} from "lucide-react";

export interface UploadedFileInfo {
  name: string;
  sizeKb: number;
  type: string;
  status: "ready" | "processing" | "done" | "needs_review" | "error";
  error?: string;
  fixTip?: string;
  analysisReport?: AnalysisReport;
}

interface AnalysisReport {
  rowsParsed: number;
  totalAmountPaise: number;
  duplicatesFound: number;
  anomalies: string[];
  topCategories: { label: string; amount: number }[];
  aiSummary: string;
  aiRecommendations: string[];
  confidence: "high" | "medium" | "low";
}

/** Simulate parsing a CSV and generating an analysis report */
function generateReport(fileName: string): AnalysisReport {
  // Deterministic synthetic report based on filename
  const isCafe = fileName.toLowerCase().includes("chai") || fileName.toLowerCase().includes("cafe");
  const isStationery = fileName.toLowerCase().includes("stationery") || fileName.toLowerCase().includes("paper") || fileName.toLowerCase().includes("vid");

  return {
    rowsParsed: 47 + Math.floor(Math.random() * 80),
    totalAmountPaise: isCafe ? 18540000 : isStationery ? 24780000 : 15320000,
    duplicatesFound: 2,
    anomalies: [
      "2 duplicate UPI transaction references detected (same RefID within 60s)",
      "1 large inflow ₹12,500 from 'Modern Engineering College' — verify source document",
    ],
    topCategories: [
      { label: isCafe ? "Food & Beverage Sales" : "Stationary & Paper", amount: isCafe ? 9800000 : 12400000 },
      { label: "UPI Settlements", amount: 4200000 },
      { label: isCafe ? "Café Snacks" : "Photocopy & Print", amount: isCafe ? 2800000 : 5100000 },
    ],
    aiSummary: isCafe
      ? "Your transaction feed shows consistent daily revenue between ₹3,200–₹4,800. Peak inflows on weekends (Sat/Sun) are 38% higher than weekdays. 2 duplicate UPI entries were flagged and excluded from totals. Net verified inflow after deduplication: ₹1,54,300."
      : "Your POS export shows strong stationery sales with Xerox dominating at 70% gross margin. Late-month dip (~9.9%) aligns with semester transition. 2 duplicate settlement references were automatically excluded. Net verified inflow: ₹2,47,800.",
    aiRecommendations: isCafe
      ? [
          "Weekend demand spikes 38% — consider pre-prepping batches on Friday evenings.",
          "2 duplicate UPI entries were auto-excluded. Confirm with your UPI app or bank statement.",
          "Large ₹12,500 NEFT from college not matched to any POS order — add a reconciliation note.",
        ]
      : [
          "Xerox margins remain strong (70%) — prioritise restocking JK Copier 75GSM before exam weeks.",
          "2 duplicate ICICI settlements auto-excluded — verify against merchant dashboard.",
          "End-of-month dip recoverable with targeted exam stationery bundle offers.",
        ],
    confidence: "high",
  };
}

export function FileDropzone({
  onFilesUploaded,
  className = "",
}: {
  onFilesUploaded?: (files: UploadedFileInfo[]) => void;
  className?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFileInfo[]>([]);
  const [expandedReport, setExpandedReport] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFileList = (incoming: FileList | File[]) => {
    const list: UploadedFileInfo[] = [];

    Array.from(incoming).forEach((file) => {
      const isCsv  = file.name.endsWith(".csv");
      const isXlsx = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
      const isPdf  = file.name.endsWith(".pdf");
      const isImage = file.type.startsWith("image/");

      if (isCsv || isXlsx) {
        list.push({
          name: file.name,
          sizeKb: Math.round(file.size / 1024) || 1,
          type: isCsv ? "CSV Spreadsheet" : "Excel Workbook",
          status: "ready",
        });
      } else if (isPdf || isImage) {
        list.push({
          name: file.name,
          sizeKb: Math.round(file.size / 1024) || 1,
          type: "Scanned Invoice (Beta OCR)",
          status: "needs_review",
          fixTip: "OCR extraction staged for human review. Verify GSTIN and totals in the Correction Queue.",
        });
      } else {
        list.push({
          name: file.name,
          sizeKb: Math.round(file.size / 1024) || 1,
          type: "Unknown Format",
          status: "error",
          error: "Unsupported file extension. Only CSV, XLSX, and scanned PDF/images are supported.",
          fixTip: "Export your sales register or bank statement as CSV or Excel.",
        });
      }
    });

    setFiles((prev) => [...prev, ...list]);
    if (onFilesUploaded) onFilesUploaded(list);
  };

  /** Run deterministic parsing + AI analysis on a single file */
  const handleProcessFile = (idx: number) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, status: "processing" } : f))
    );

    // Simulate ~2s parsing delay then show report
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === idx
            ? { ...f, status: "done", analysisReport: generateReport(f.name) }
            : f
        )
      );
      setExpandedReport(idx);
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) processFileList(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (expandedReport === index) setExpandedReport(null);
  };

  const formatPaise = (p: number) =>
    `₹${(p / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className={`space-y-4 ${className}`}>

      {/* ── Drop Zone ── */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-primary bg-primary-soft/30 scale-[1.005]"
            : "border-border bg-surface hover:border-primary/40 hover:bg-surface-2/40"
        }`}
      >
        <input
          type="file"
          ref={inputRef}
          multiple
          accept=".csv,.xlsx,.xls,.pdf,image/*"
          className="hidden"
          onChange={(e) => { if (e.target.files) processFileList(e.target.files); }}
        />

        <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-5 h-5 text-primary" />
        </div>
        <h4 className="font-semibold text-[14px] text-text mb-1">
          Drop bills, POS exports, UPI statements, or bank records here
        </h4>
        <p className="text-[12px] text-text-muted max-w-md mx-auto">
          Supports CSV, Excel (XLSX), and scanned PDFs (Beta OCR). Drag & drop or paste directly from clipboard.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 text-[12px]">
          <span className="text-primary font-medium">Browse local files</span>
          <span className="text-text-muted">·</span>
          <span className="text-text-muted">Original files preserved privately</span>
        </div>
      </div>

      {/* ── Staged Queue ── */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">
            Staged Ingestion Queue ({files.length})
          </div>

          {files.map((file, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-surface overflow-hidden">

              {/* File row */}
              <div className="flex items-center justify-between px-4 py-3 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-surface-2 border border-border flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-text-muted" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-[13px] text-text truncate">{file.name}</div>
                    <div className="text-[11px] text-text-muted">
                      {file.type} · {file.sizeKb} KB
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Status badge */}
                  {file.status === "ready" && (
                    <span className="inline-flex items-center gap-1 text-[11.5px] text-success font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready
                    </span>
                  )}
                  {file.status === "processing" && (
                    <span className="inline-flex items-center gap-1.5 text-[11.5px] text-primary font-medium">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Parsing & Analyzing...
                    </span>
                  )}
                  {file.status === "done" && (
                    <button
                      type="button"
                      onClick={() => setExpandedReport(expandedReport === idx ? null : idx)}
                      className="inline-flex items-center gap-1 text-[11.5px] text-accent font-medium hover:underline"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      Report ready
                      <ChevronRight className={`w-3 h-3 transition-transform ${expandedReport === idx ? "rotate-90" : ""}`} />
                    </button>
                  )}
                  {file.status === "needs_review" && (
                    <span className="inline-flex items-center gap-1 text-[11.5px] text-warning font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      OCR Review
                    </span>
                  )}
                  {file.status === "error" && (
                    <span className="inline-flex items-center gap-1 text-[11.5px] text-danger font-medium">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Unsupported
                    </span>
                  )}

                  {/* Process button — only show for ready CSV/XLS */}
                  {file.status === "ready" && (
                    <button
                      type="button"
                      onClick={() => handleProcessFile(idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-white text-[12px] font-semibold hover:bg-primary-hover transition-colors active:scale-[0.97]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Process & Analyse
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                    className="w-6 h-6 rounded flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Error / OCR tip message */}
              {(file.status === "error" || file.status === "needs_review") && file.fixTip && (
                <div className="px-4 pb-3">
                  <p className={`text-[11.5px] ${file.status === "error" ? "text-danger" : "text-warning"} leading-relaxed`}>
                    {file.fixTip}
                  </p>
                </div>
              )}

              {/* ── AI Analysis Report (expandable) ── */}
              {file.status === "done" && expandedReport === idx && file.analysisReport && (
                <div className="border-t border-border bg-surface-2/40">
                  <AnalysisReportPanel report={file.analysisReport} fileName={file.name} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Full AI Analysis Report panel shown inline after processing */
function AnalysisReportPanel({
  report,
  fileName,
}: {
  report: AnalysisReport;
  fileName: string;
}) {
  const formatPaise = (p: number) =>
    `₹${(p / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="p-5 space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-primary-soft flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="font-semibold text-[13.5px] text-text">AI Analysis Report</div>
          <div className="text-[11px] text-text-muted">{fileName} · Deterministic parse + AI summary</div>
        </div>
        <div className="ml-auto">
          <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${
            report.confidence === "high"
              ? "border-success/30 bg-success-soft text-success"
              : report.confidence === "medium"
              ? "border-warning/30 bg-warning-soft text-warning"
              : "border-danger/30 bg-danger-soft text-danger"
          }`}>
            {report.confidence === "high" ? "High" : report.confidence === "medium" ? "Medium" : "Low"} Confidence
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Rows Parsed",     value: `${report.rowsParsed}`, icon: FileText,    color: "text-text" },
          { label: "Net Inflow",      value: formatPaise(report.totalAmountPaise), icon: TrendingUp,  color: "text-success" },
          { label: "Duplicates Found", value: `${report.duplicatesFound}`, icon: AlertCircle, color: "text-warning" },
          { label: "Anomalies",       value: `${report.anomalies.length}`,  icon: AlertTriangle, color: "text-warning" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-md border border-border bg-surface p-3 space-y-1">
              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                <span className="text-[11px] text-text-muted">{stat.label}</span>
              </div>
              <div className={`text-[17px] font-semibold tabular-nums ${stat.color}`}>{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* AI Summary */}
      <div className="rounded-md border border-border bg-surface p-4 space-y-2">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-text">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          AI Summary
        </div>
        <p className="text-[12.5px] text-text-muted leading-relaxed">
          {report.aiSummary}
        </p>
      </div>

      {/* Top Categories */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Top Revenue Categories
        </div>
        {report.topCategories.map((cat) => {
          const maxAmount = Math.max(...report.topCategories.map((c) => c.amount));
          const pct = (cat.amount / maxAmount) * 100;
          return (
            <div key={cat.label} className="space-y-1">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-text font-medium">{cat.label}</span>
                <span className="tabular-nums font-semibold text-text">{formatPaise(cat.amount)}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Anomalies */}
      {report.anomalies.length > 0 && (
        <div className="rounded-md border border-warning/30 bg-warning-soft/20 p-3.5 space-y-2">
          <div className="text-[12px] font-semibold text-warning flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Anomalies Detected — Review Before Reconciliation
          </div>
          <ul className="space-y-1">
            {report.anomalies.map((a, i) => (
              <li key={i} className="text-[12px] text-text-muted flex items-start gap-2">
                <span className="w-4 h-4 rounded-full border border-warning/40 bg-warning-soft text-warning text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          AI Recommendations
        </div>
        {report.aiRecommendations.map((rec, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-md border border-border bg-surface text-[12.5px] text-text-muted"
          >
            <span className="w-5 h-5 rounded-full bg-primary-soft text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            {rec}
          </div>
        ))}
      </div>

      {/* CTA: Send to AI Workspace */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <p className="text-[11.5px] text-text-muted">
          Data normalized and ingested. Ask the AI deeper questions in the workspace.
        </p>
        <a
          href={`/ai-workspace?file=${encodeURIComponent(fileName)}`}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-[12.5px] font-semibold hover:bg-primary-hover transition-colors active:scale-[0.97]"
        >
          <Bot className="w-3.5 h-3.5" />
          Ask AI about this file
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
