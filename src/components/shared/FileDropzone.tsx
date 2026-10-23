"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, X, ShieldAlert } from "lucide-react";

export interface UploadedFileInfo {
  name: string;
  sizeKb: number;
  type: string;
  status: "ready" | "needs_review" | "error";
  error?: string;
  fixTip?: string;
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
  const inputRef = useRef<HTMLInputElement>(null);

  const processFileList = (incoming: FileList | File[]) => {
    const list: UploadedFileInfo[] = [];

    Array.from(incoming).forEach((file) => {
      const isCsv = file.name.endsWith(".csv");
      const isXlsx = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
      const isPdf = file.name.endsWith(".pdf");
      const isImage = file.type.startsWith("image/");

      if (isCsv || isXlsx) {
        list.push({
          name: file.name,
          sizeKb: Math.round(file.size / 1024),
          type: isCsv ? "CSV Spreadsheet" : "Excel Workbook",
          status: "ready",
        });
      } else if (isPdf || isImage) {
        // Staged OCR Beta
        list.push({
          name: file.name,
          sizeKb: Math.round(file.size / 1024),
          type: "Scanned Invoice (Beta OCR)",
          status: "needs_review",
          fixTip: "OCR extraction staged for human review. Verify GSTIN and totals in the Correction Queue.",
        });
      } else {
        list.push({
          name: file.name,
          sizeKb: Math.round(file.size / 1024),
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone Box */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-fast ${
          isDragging
            ? "border-primary bg-primary-soft/40 scale-[1.01]"
            : "border-border bg-surface hover:bg-surface-2/60"
        }`}
      >
        <input
          type="file"
          ref={inputRef}
          multiple
          accept=".csv,.xlsx,.xls,.pdf,image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) processFileList(e.target.files);
          }}
        />

        <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center mx-auto text-primary-ink mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <h4 className="font-semibold text-text text-sm mb-1">
          Drop bills, POS exports, UPI statements, or bank records here
        </h4>
        <p className="text-xs text-text-muted max-w-md mx-auto">
          Supports CSV, Excel (XLSX), and scanned PDFs (Beta OCR). Drag & drop or paste directly from clipboard.
        </p>

        <div className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold text-primary-ink">
          <span>Browse local files</span>
          <span>•</span>
          <span className="text-text-muted font-normal">Original files preserved privately</span>
        </div>
      </div>

      {/* Uploaded Files Queue */}
      {files.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
            Staged Ingestion Queue ({files.length})
          </label>
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-3 rounded-lg border border-border bg-surface text-xs space-y-1"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded bg-surface-2 flex items-center justify-center text-text-muted mt-0.5 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-text">{file.name}</div>
                    <div className="text-[11px] text-text-muted">
                      {file.type} • {file.sizeKb} KB
                    </div>

                    {file.status === "ready" && (
                      <span className="inline-flex items-center gap-1 text-success text-[11px] mt-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready for deterministic normalization
                      </span>
                    )}

                    {file.status === "needs_review" && (
                      <div className="text-warning text-[11px] mt-1 flex items-start gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{file.fixTip}</span>
                      </div>
                    )}

                    {file.status === "error" && (
                      <div className="text-danger text-[11px] mt-1 flex items-start gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <div>
                          <span>{file.error}</span>
                          {file.fixTip && (
                            <span className="block underline mt-0.5">{file.fixTip}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="text-text-muted hover:text-text p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
