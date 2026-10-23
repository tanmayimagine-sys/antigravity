"use client";

import React, { useState } from "react";
import { Check, X, Edit3, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";
import { AIRecommendation } from "@/lib/types";
import { formatPaise } from "@/lib/formatters";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { EvidenceChip } from "./SourceDrawer";

export function ApprovalCard({
  recommendation,
  onApprove,
  onDecline,
  onEdit,
  className = "",
}: {
  recommendation: AIRecommendation;
  onApprove?: (id: string, note?: string) => void;
  onDecline?: (id: string, note?: string) => void;
  onEdit?: (id: string, updatedAction: string) => void;
  className?: string;
}) {
  const [status, setStatus] = useState<AIRecommendation["status"]>(recommendation.status);
  const [undoTimer, setUndoTimer] = useState<NodeJS.Timeout | null>(null);
  const [showUndoBanner, setShowUndoBanner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAction, setEditedAction] = useState(recommendation.action);
  const [note, setNote] = useState("");

  const triggerAction = (newStatus: "approved" | "declined") => {
    setStatus(newStatus);
    setShowUndoBanner(true);

    if (undoTimer) clearTimeout(undoTimer);

    // 6-second undo window
    const timer = setTimeout(() => {
      setShowUndoBanner(false);
      if (newStatus === "approved" && onApprove) onApprove(recommendation.id, note);
      if (newStatus === "declined" && onDecline) onDecline(recommendation.id, note);
    }, 6000);

    setUndoTimer(timer);
  };

  const handleUndo = () => {
    if (undoTimer) clearTimeout(undoTimer);
    setStatus("pending");
    setShowUndoBanner(false);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onEdit) onEdit(recommendation.id, editedAction);
  };

  return (
    <div
      className={`rounded-xl border border-border bg-surface p-5 shadow-sm space-y-4 transition-all duration-base ${
        status === "approved"
          ? "border-success/40 bg-success-soft/10"
          : status === "declined"
          ? "opacity-60 bg-surface-2/40"
          : ""
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-text text-base">{recommendation.title}</span>
            <ConfidenceBadge confidence={recommendation.confidence} />
          </div>
          <p className="text-xs text-text-muted">Review period: {recommendation.period}</p>
        </div>

        {/* Evidence Chips */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          {recommendation.evidenceIds.map((evId) => (
            <EvidenceChip key={evId} id={evId} />
          ))}
        </div>
      </div>

      {/* Finding & Explanation */}
      <div className="space-y-2 text-sm">
        <div className="bg-surface-2 p-3 rounded-lg border border-border">
          <span className="text-xs font-semibold text-text-muted block uppercase tracking-wider mb-1">
            Data Finding
          </span>
          <p className="text-text leading-relaxed">{recommendation.finding}</p>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text block">Edit Proposed Action:</label>
            <textarea
              value={editedAction}
              onChange={(e) => setEditedAction(e.target.value)}
              className="w-full p-2.5 rounded-md border border-border bg-surface text-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-md border border-border text-xs text-text hover:bg-surface-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-3 py-1.5 rounded-md bg-primary text-on-primary text-xs font-medium hover:bg-primary-hover"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div>
            <span className="text-xs font-semibold text-text-muted block uppercase tracking-wider mb-1">
              Proposed Action
            </span>
            <p className="text-text font-medium leading-relaxed">{editedAction}</p>
          </div>
        )}
      </div>

      {/* Impact & Cost Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
        <div className="p-2.5 rounded bg-surface-2/60 border border-border">
          <span className="text-text-muted block">Expected Impact:</span>
          <span className="font-semibold text-accent">{recommendation.expectedImpact}</span>
        </div>
        <div className="p-2.5 rounded bg-surface-2/60 border border-border">
          <span className="text-text-muted block">Estimated Cost:</span>
          <span className="font-semibold text-text tabular-nums">
            {recommendation.estimatedCostPaise > 0
              ? formatPaise(recommendation.estimatedCostPaise)
              : "₹0 (Zero extra labor/capital)"}
          </span>
        </div>
      </div>

      {/* Risks */}
      <div className="flex items-start gap-2 text-xs text-warning bg-warning-soft/40 p-2.5 rounded border border-warning/20">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Risks & Considerations: </span>
          <span>{recommendation.risks}</span>
        </div>
      </div>

      {/* Undo Banner (active for 6 seconds after click) */}
      {showUndoBanner && (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-info-soft border border-info/30 text-xs text-info animate-in fade-in duration-fast">
          <span>
            Action marked as <strong>{status}</strong>. Changes will commit in a few seconds.
          </span>
          <button
            type="button"
            onClick={handleUndo}
            className="flex items-center gap-1 font-semibold underline hover:no-underline text-info focus-visible:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Undo (6s)
          </button>
        </div>
      )}

      {/* Approval Actions Toolbar */}
      {!showUndoBanner && status === "pending" && (
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Requires explicit owner approval to execute.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-surface text-text text-xs font-medium hover:bg-surface-2 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-text-muted" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => triggerAction("declined")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-danger/30 text-danger bg-surface hover:bg-danger-soft text-xs font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Decline</span>
            </button>

            <button
              type="button"
              onClick={() => triggerAction("approved")}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-primary text-on-primary hover:bg-primary-hover text-xs font-semibold shadow-sm transition-transform active:scale-[0.98]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve & Track</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
