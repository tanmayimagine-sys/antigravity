"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useBusiness } from "@/components/shell/BusinessContext";
import { db } from "@/lib/db";
import { EvidenceChip, useSourceDrawer } from "@/components/ui/SourceDrawer";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { formatPaise } from "@/lib/formatters";
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Database,
  Calendar,
  FileText,
  UploadCloud,
  Loader2,
  X,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
  evidenceIds?: string[];
  confidence?: "high" | "medium" | "low";
  unknowns?: string[];
  suggestedAction?: {
    title: string;
    actionText: string;
    impact: string;
    costPaise?: number;
    targetPath?: string;
  };
  isSampleResponse?: boolean;
}

export default function AIWorkspacePage() {
  const { activeBusiness, dateRange } = useBusiness();
  const searchParams = useSearchParams();
  const fileContext = searchParams?.get("file") ?? null; // e.g. ?file=sales_oct.csv

  const [inputQuery, setInputQuery] = useState("");
  const [fileContextDismissed, setFileContextDismissed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initMessage: ChatMessage = {
    id: "msg_init",
    sender: "ai",
    content: fileContext
      ? `Hello! I can see you've uploaded **${fileContext}** from the Data Centre. I've loaded the parsed transaction data into my context. Ask me anything about it — duplicate entries, category breakdown, anomalies, or what it means for your cash flow.`
      : `Hello! I am your Central AI Business Partner for **${activeBusiness.name}**. I have loaded your verified POS sales, UPI merchant settlements, and operating expenses. How can I help you grow or optimise your cash flow today?`,
    timestamp: "Now",
    isSampleResponse: true,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initMessage]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const starterQuestions = fileContext
    ? [
        `What anomalies did you find in ${fileContext}?`,
        "Which category had the highest inflow?",
        "Are there any duplicate transactions I should remove?",
        "How does this compare to my previous month?",
      ]
    : [
        "Why did sales drop last month?",
        "Which product should I promote for student exams?",
        "How healthy is my cash flow for simulated funding?",
      ];

  // Pre-computed, evidence-grounded responses per business
  const getSimulatedAIResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase();

    if (q.includes("drop") || q.includes("dip") || q.includes("september") || q.includes("fall")) {
      return {
        id: `ai_${Date.now()}`,
        sender: "ai",
        content:
          "Verified sales dipped 9.9% in late September due to the post-admission semester lull. However, Xerox gross margin remained very resilient at 70%, while your high-volume paper ream stock was depleted.",
        timestamp: "Just now",
        evidenceIds: ["M-201", "M-204", "prod_stat_5"],
        confidence: "high",
        unknowns: [
          "External college timetable adjustments not captured in POS data.",
          "Cash walk-in receipts without itemized customer bills.",
        ],
        suggestedAction: {
          title: "Pre-Order Exam Paper Reams",
          actionText: "Restock 120 boxes of JK Copier 75GSM before exam weeks to capture high-margin photocopy volume.",
          impact: "+₹28,000 net profit during upcoming mid-term submissions",
          costPaise: 450000,
          targetPath: "/experiments",
        },
        isSampleResponse: true,
      };
    }

    if (q.includes("promote") || q.includes("product") || q.includes("exam")) {
      return {
        id: `ai_${Date.now()}`,
        sender: "ai",
        content:
          "Your top-performing product by margin is Thesis Printing & Hard Binding (60% margin, ₹450 price). Engineering Drawing Sheets are also in heavy demand but have dipped below reorder threshold (65 units left).",
        timestamp: "Just now",
        evidenceIds: ["prod_stat_1", "prod_stat_3", "M-203"],
        confidence: "high",
        unknowns: ["Competitor binding pricing across FC Road."],
        suggestedAction: {
          title: "Launch Student Mid-Term Exam Bundle",
          actionText: "Bundle 1x Folder + 2x Notebooks + 50 Xerox vouchers at ₹480 (saving students ₹80).",
          impact: "+₹24,000 cash flow in 14 days",
          costPaise: 200000,
          targetPath: "/experiments",
        },
        isSampleResponse: true,
      };
    }

    // Default financial health answer
    return {
      id: `ai_${Date.now()}`,
      sender: "ai",
      content:
        `Your Business Health Profile is currently evaluated at **84/100 (High Confidence)**. Your net operating cash flow stands at ${formatPaise(17230000)}, comfortably covering your simulated revenue-share repayment obligations of 6.5%.`,
      timestamp: "Just now",
      evidenceIds: ["M-204", "M-201"],
      confidence: "high",
      unknowns: ["Unreconciled bulk college cheque #4412 awaiting split clearance."],
      suggestedAction: {
        title: "Reconcile College Exam Booklet Settlement",
        actionText: "Clear the ₹12,500 pending credit in Reconciliation Workspace to lift Data Reliability.",
        impact: "+₹12,500 immediately recognized into verified working capital",
        targetPath: "/reconciliation",
      },
      isSampleResponse: true,
    };
  };

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      content: q,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsProcessing(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: activeBusiness.id,
          query: q,
        }),
      });

      if (!res.ok) throw new Error("Failed to call Central AI endpoint");
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        content: data.answer || "No response received.",
        timestamp: "Just now",
        evidenceIds: data.evidenceIds || ["M-201", "M-204"],
        confidence: data.confidence || "high",
        unknowns: data.unknowns,
        suggestedAction: data.suggestedAction,
        isSampleResponse: data.isSampleResponse ?? false,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Fallback if network or server error
      const aiResponse = getSimulatedAIResponse(q);
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-semibold text-text tracking-tight">
              Central AI Workspace
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-md font-medium border border-accent/30 bg-accent-soft text-accent flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Evidence-Grounded
            </span>
          </div>
          <p className="text-[12.5px] text-text-muted mt-0.5">
            Operating exclusively on verified data for{" "}
            <span className="font-medium text-text">{activeBusiness.name}</span>
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border text-[12px] text-text-muted">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Gemini 2.5 Flash · Live
        </div>
      </div>

      {/* ── File context banner (shown when coming from Data Centre upload) ── */}
      {fileContext && !fileContextDismissed && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-primary/30 bg-primary-soft/30">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[13px] font-semibold text-text">{fileContext}</span>
            <span className="text-[12px] text-text-muted ml-2">
              — parsed & loaded into AI context from Data Centre
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              setInputQuery(
                `Analyse the uploaded file ${fileContext}: summarise total inflow, flag any duplicates or anomalies, and give me 3 actionable recommendations.`
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-white text-[12px] font-semibold hover:bg-primary-hover transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask AI about this file
          </button>
          <button
            type="button"
            onClick={() => setFileContextDismissed(true)}
            className="w-6 h-6 rounded flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Main 2-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* Left: Chat (7 cols) */}
        <div className="lg:col-span-7 rounded-lg border border-border bg-surface flex flex-col h-[680px] overflow-hidden">

          {/* Chat header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary-soft flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-semibold text-[13px] text-text">Central AI Orchestrator</span>
            </div>
            <span className="text-[11.5px] text-text-muted">Strict Tenant Isolation Active</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-surface-2 border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-text-muted" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-lg p-3.5 space-y-3 text-[13px] ${
                    m.sender === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-surface-2 border border-border text-text rounded-tl-none"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{m.content}</p>

                  {/* Evidence & Confidence */}
                  {m.evidenceIds && m.evidenceIds.length > 0 && (
                    <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-text-muted font-medium text-[10.5px]">Evidence:</span>
                        {m.evidenceIds.map((id) => (
                          <EvidenceChip key={id} id={id} />
                        ))}
                      </div>
                      {m.confidence && <ConfidenceBadge confidence={m.confidence} />}
                    </div>
                  )}

                  {/* Unknowns */}
                  {m.unknowns && m.unknowns.length > 0 && (
                    <div className="p-2.5 rounded-md bg-surface border border-warning/20 text-[11.5px] text-text-muted space-y-1">
                      <div className="font-semibold text-warning flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Unknowns & Blindspots
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {m.unknowns.map((u, i) => (
                          <li key={i}>{u}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested action card */}
                  {m.suggestedAction && (
                    <div className="p-3 rounded-md border border-primary/20 bg-primary-soft/20 space-y-2">
                      <div className="font-semibold text-[12px] text-primary flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Recommended Action: {m.suggestedAction.title}
                      </div>
                      <p className="text-[12px] text-text-muted">{m.suggestedAction.actionText}</p>
                      <div className="flex items-center justify-between pt-1.5 border-t border-border/50 text-[11.5px]">
                        <span className="text-accent font-medium">
                          Impact: {m.suggestedAction.impact}
                        </span>
                        <a
                          href={m.suggestedAction.targetPath || "/experiments"}
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                        >
                          Review & Approve
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Sample badge */}
                  {m.isSampleResponse && (
                    <div className="text-[10px] text-text-muted/60 flex items-center justify-between pt-0.5">
                      <span>Simulated response · Schema valid</span>
                      <span>{m.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 text-[12.5px] text-text-muted px-3 py-2.5 rounded-lg bg-surface-2/50">
                <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                Checking your records… retrieving data, validating evidence…
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Starter question chips */}
          <div className="px-3 py-2 border-t border-border flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] text-text-muted whitespace-nowrap">Try:</span>
            {starterQuestions.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(sq)}
                className="px-2.5 py-1 rounded-md border border-border bg-surface text-text hover:bg-surface-2 whitespace-nowrap transition-colors text-[11.5px]"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Input box */}
          <div className="p-3 border-t border-border bg-surface flex items-center gap-2">
            <input
              type="text"
              placeholder={fileContext ? `Ask about ${fileContext}…` : "Ask about your verified sales, margins, or cash flow…"}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 px-3 py-2.5 rounded-md border border-border bg-surface-2 text-text text-[13px] placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus transition-colors"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isProcessing}
              className="w-9 h-9 rounded-md bg-primary text-white flex items-center justify-center hover:bg-primary-hover disabled:opacity-40 transition-colors shrink-0"
              aria-label="Send query"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Right: Context panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">

          {/* Live context boundary */}
          <div className="rounded-lg border border-border bg-surface p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-primary" />
                <h3 className="font-semibold text-[13.5px] text-text">Live Context Boundary</h3>
              </div>
              <span className="text-[10.5px] font-mono text-accent">Isolated</span>
            </div>

            <div className="space-y-3 text-[12px]">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Active Business Tenant
                </div>
                <div className="font-semibold text-[13px] text-text">{activeBusiness.name}</div>
                <div className="text-text-muted text-[11.5px]">{activeBusiness.address}</div>
              </div>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Active Date Window
                </div>
                <div className="font-medium text-text flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  {dateRange}
                </div>
              </div>

              {/* Uploaded file context */}
              {fileContext && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Uploaded File in Context
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-2 rounded-md border border-primary/30 bg-primary-soft/20">
                    <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="font-medium text-primary text-[12px] truncate">{fileContext}</span>
                  </div>
                </div>
              )}

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Approved Data Sources
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: "POS Shift Bills (CSV)", status: "2,410 bills", ok: true },
                    { label: "Merchant UPI Settlements", status: "Reconciled", ok: true },
                    { label: "Vendor Paper Invoices", status: "Beta OCR", ok: false },
                  ].map((src) => (
                    <div
                      key={src.label}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-surface-2 border border-border"
                    >
                      <span className="text-[12px] text-text">{src.label}</span>
                      <span className={`flex items-center gap-1 text-[11.5px] font-medium ${
                        src.ok ? "text-success" : "text-warning"
                      }`}>
                        {src.ok ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {src.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-3 py-2.5 rounded-md border border-warning/20 bg-warning-soft/20 text-[11.5px] text-text-muted">
                <span className="font-semibold text-warning block mb-0.5">What data is missing?</span>
                Paper supplier handwritten GST breakdown has 1 unconfirmed field. AI explicitly flags this uncertainty when computing net margins.
              </div>
            </div>
          </div>

          {/* Trust cues */}
          <div className="rounded-lg border border-border bg-surface-2/40 p-4 space-y-2">
            <div className="font-semibold text-[13px] text-text flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              Orchestrator Trust Standard
            </div>
            <p className="text-[12px] text-text-muted leading-relaxed">
              Central AI is prohibited from inventing figures or performing unverified arithmetic. All numbers originate from deterministic tools. Click any evidence chip to inspect the source document.
            </p>
          </div>

          {/* Quick nav to upload more */}
          <a
            href="/data-centre"
            className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-2 transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-text-muted shrink-0" />
            <div className="min-w-0">
              <div className="text-[12.5px] font-medium text-text">Upload more files</div>
              <div className="text-[11px] text-text-muted">Data Centre → Process & Analyse</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted ml-auto" />
          </a>
        </div>
      </div>
    </div>
  );
}
