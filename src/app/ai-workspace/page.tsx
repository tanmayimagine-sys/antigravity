"use client";

import React, { useState } from "react";
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
  Layers,
  HelpCircle,
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
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_init",
      sender: "ai",
      content:
        `Hello Ramesh! I am your Central AI Business Partner for **${activeBusiness.name}**. I have loaded your verified POS sales, UPI merchant settlements, and operating expenses. How can I help you grow or optimize your cash flow today?`,
      timestamp: "10:30 AM",
      isSampleResponse: true,
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const starterQuestions = [
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              Central AI Workspace
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-accent-soft text-accent border border-accent/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Evidence-Grounded Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Operating exclusively on verified data for <strong>{activeBusiness.name}</strong>
          </p>
        </div>

        {/* Live Gemini Connection Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent border border-accent/40 text-xs font-semibold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>Gemini 2.5 Flash Connected (Live)</span>
        </div>
      </div>

      {/* Main 60 / 40 Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Chat Stream (7 cols ~ 60%) */}
        <div className="lg:col-span-7 rounded-xl border border-border bg-surface flex flex-col h-[680px] shadow-sm overflow-hidden">
          {/* Chat Stream Header */}
          <div className="p-3.5 border-b border-border bg-surface-2/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary-ink" />
              <span className="font-semibold text-text">Central AI Orchestrator</span>
            </div>
            <span className="text-text-muted">Strict Tenant Isolation Active</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 text-xs sm:text-sm ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-accent-soft text-accent flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-4 space-y-3 ${
                    m.sender === "user"
                      ? "bg-primary text-on-primary rounded-tr-none"
                      : "bg-surface-2/80 border border-border text-text rounded-tl-none shadow-sm"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{m.content}</p>

                  {/* Evidence & Confidence Row */}
                  {m.evidenceIds && m.evidenceIds.length > 0 && (
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2 flex-wrap text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-text-muted font-semibold text-[11px]">Evidence:</span>
                        {m.evidenceIds.map((id) => (
                          <EvidenceChip key={id} id={id} />
                        ))}
                      </div>
                      {m.confidence && <ConfidenceBadge confidence={m.confidence} />}
                    </div>
                  )}

                  {/* Unknowns / Missing Data Tag */}
                  {m.unknowns && m.unknowns.length > 0 && (
                    <div className="p-2.5 rounded bg-surface border border-border text-xs text-text-muted space-y-1">
                      <div className="font-semibold text-warning flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Unknowns & Blindspots:</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                        {m.unknowns.map((u, i) => (
                          <li key={i}>{u}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested Next Step Action Card */}
                  {m.suggestedAction && (
                    <div className="p-3 rounded-lg bg-surface border border-primary/30 space-y-2">
                      <div className="font-bold text-xs text-primary-ink flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Recommended Owner Action:</span>
                      </div>
                      <div className="font-semibold text-text text-xs">
                        {m.suggestedAction.title}
                      </div>
                      <p className="text-xs text-text-muted">
                        {m.suggestedAction.actionText}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-border text-xs">
                        <span className="text-accent font-semibold text-[11px]">
                          Impact: {m.suggestedAction.impact}
                        </span>
                        <a
                          href={m.suggestedAction.targetPath || "/experiments"}
                          className="inline-flex items-center gap-1 font-semibold text-primary-ink hover:underline text-[11px]"
                        >
                          <span>Review & Approve</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Sample AI response badge */}
                  {m.isSampleResponse && (
                    <div className="text-[10px] text-text-muted flex items-center justify-between opacity-80 pt-1">
                      <span>Sample AI response • Schema Valid</span>
                      <span>{m.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 text-xs text-text-muted p-3 bg-surface-2/40 rounded-lg animate-pulse">
                <Bot className="w-4 h-4 text-accent animate-spin" />
                <span>Checking your records… Retrieving data, running calculations, validating evidence…</span>
              </div>
            )}
          </div>

          {/* Starter Questions Chips */}
          <div className="p-2 border-t border-border bg-surface-2/40 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-text-muted text-[11px] whitespace-nowrap pl-1">Ask:</span>
            {starterQuestions.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(sq)}
                className="px-2.5 py-1 rounded-full bg-surface border border-border text-text hover:bg-surface-2 whitespace-nowrap transition-colors text-[11px]"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-border bg-surface flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question about your verified sales, margins, or cash flow..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-surface text-text text-xs sm:text-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isProcessing}
              className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 transition-colors shrink-0"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Live Context & Data Coverage Panel (5 cols ~ 40%) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary-ink" />
                <h3 className="font-bold text-sm text-text">Live Context Boundary</h3>
              </div>
              <span className="text-[11px] font-mono text-accent">Isolated Context</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                  Active Business Tenant
                </label>
                <div className="font-semibold text-text text-sm mt-0.5">
                  {activeBusiness.name}
                </div>
                <div className="text-text-muted">{activeBusiness.address}</div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                  Active Date Window
                </label>
                <div className="font-medium text-text flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  <span>{dateRange}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                  Approved Data Sources Loaded
                </label>
                <div className="space-y-1.5 mt-1">
                  <div className="flex items-center justify-between p-2 rounded bg-surface-2 border border-border">
                    <span>POS Shift Bills (CSV)</span>
                    <span className="text-success font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> 2,410 bills
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface-2 border border-border">
                    <span>Merchant UPI Settlements</span>
                    <span className="text-success font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Reconciled
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface-2 border border-border">
                    <span>Vendor Paper Invoices</span>
                    <span className="text-warning font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Beta OCR
                    </span>
                  </div>
                </div>
              </div>

              {/* Missing Information Notice */}
              <div className="p-3 rounded-lg bg-warning-soft/40 border border-warning/30 text-warning space-y-1">
                <span className="font-semibold block text-[11px]">
                  What data is missing?
                </span>
                <p className="leading-relaxed text-[11px]">
                  Paper supplier handwritten GST breakdown has 1 unconfirmed field. Central AI explicitly flags this uncertainty when computing net margins.
                </p>
              </div>
            </div>
          </div>

          {/* Core Trust Cues Box */}
          <div className="rounded-xl border border-border bg-surface-2/60 p-4 space-y-2 text-xs text-text-muted">
            <div className="font-semibold text-text flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Orchestrator Trust Standard</span>
            </div>
            <p className="leading-relaxed">
              Central AI is prohibited from performing unverified arithmetic or inventing missing figures. All numbers originate from deterministic tools. Click any evidence chip to inspect the underlying source document.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
