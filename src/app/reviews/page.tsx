"use client";

import React, { useState } from "react";
import { useBusiness } from "@/components/shell/BusinessContext";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/formatters";
import {
  Star,
  QrCode,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  Check,
  Edit3,
  Send,
  MessageSquare,
  Sparkles,
  Link as LinkIcon,
  Copy,
} from "lucide-react";
import { CustomerReview } from "@/lib/types";

export default function ReviewsPage() {
  const { activeBusiness } = useBusiness();
  const [reviews, setReviews] = useState(db.getReviews(activeBusiness.id));
  const [themes] = useState(db.getReviewThemes(activeBusiness.id));
  const [selectedReview, setSelectedReview] = useState<CustomerReview | null>(reviews[1] || reviews[0]);
  const [draftReply, setDraftReply] = useState<string>(selectedReview?.aiSuggestedResponse || "");
  const [copiedLink, setCopiedLink] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSelectReview = (r: CustomerReview) => {
    setSelectedReview(r);
    setDraftReply(r.ownerResponse || r.aiSuggestedResponse || "");
  };

  const handleSendReply = () => {
    if (!selectedReview) return;
    db.submitReviewReply(activeBusiness.id, selectedReview.id, draftReply);
    setReviews(db.getReviews(activeBusiness.id));
    setToast("Owner reply published to Google Business Profile!");
    setTimeout(() => setToast(null), 3500);
  };

  const handleCopyReviewLink = () => {
    const neutralUrl = `https://g.page/r/${activeBusiness.slug}/review`;
    navigator.clipboard.writeText(neutralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Google Reviews Coach
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-surface-2 border border-border text-text-muted">
            Reputation & Feedback
          </span>
        </div>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Genuine customer feedback and owner response coaching for <strong>{activeBusiness.name}</strong>
        </p>
      </div>

      {toast && (
        <div className="p-3 rounded-lg bg-success-soft text-success border border-success/30 text-xs font-semibold animate-in fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Strict Compliance Banner: Genuine Non-Incentivized Policy */}
      <div className="p-4 rounded-xl bg-info-soft border border-info/30 flex items-start gap-3 text-xs text-info leading-relaxed">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-info" />
        <div>
          <strong className="block text-text font-bold text-xs uppercase tracking-wider mb-0.5">
            Google Genuine Feedback Standards Enforced
          </strong>
          <span>
            Reviews must never be bought, fabricated, filtered by sentiment, or incentivized with freebies or discounts. Our review generator produces only neutral links sent equally to all customers. Sentiment-gating ("rate us before review") is strictly prohibited.
          </span>
        </div>
      </div>

      {/* Row 1: Positive & Negative Theme Analysis */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-text">Customer Sentiment & Recurring Themes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((th) => (
            <div
              key={th.id}
              className={`p-4 rounded-xl border bg-surface space-y-2.5 shadow-sm ${
                th.sentiment === "positive" ? "border-success/30" : "border-warning/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {th.sentiment === "positive" ? (
                    <ThumbsUp className="w-4 h-4 text-success" />
                  ) : (
                    <ThumbsDown className="w-4 h-4 text-warning" />
                  )}
                  <h3 className="font-bold text-sm text-text">{th.theme}</h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-2 text-text font-semibold">
                  {th.count} mentions
                </span>
              </div>

              <div className="space-y-1">
                {th.sampleQuotes.map((q, idx) => (
                  <p key={idx} className="text-xs text-text-muted italic">
                    "{q}"
                  </p>
                ))}
              </div>

              <div className="pt-2 border-t border-border text-xs">
                <span className="font-semibold text-text">Coach Action: </span>
                <span className="text-accent">{th.actionRecommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Response Composer + Neutral QR Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Customer Reviews & AI Reply Composer (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
          <h3 className="font-bold text-base text-text">Customer Reviews & Draft Response</h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Reviews Selector (5 cols) */}
            <div className="md:col-span-5 space-y-2 max-h-96 overflow-y-auto pr-1">
              {reviews.map((rev) => {
                const isSelected = selectedReview?.id === rev.id;
                return (
                  <div
                    key={rev.id}
                    onClick={() => handleSelectReview(rev)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all space-y-1 ${
                      isSelected
                        ? "border-primary bg-primary-soft/30 shadow-sm"
                        : "border-border bg-surface hover:bg-surface-2"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text">{rev.authorName}</span>
                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-text-muted line-clamp-2">{rev.text}</p>
                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span className="text-text-muted">{formatDate(rev.date)}</span>
                      <span
                        className={`font-semibold ${
                          rev.responseStatus === "replied" ? "text-success" : "text-warning"
                        }`}
                      >
                        {rev.responseStatus === "replied" ? "✓ Replied" : "Needs reply"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Response Editor (7 cols) */}
            {selectedReview && (
              <div className="md:col-span-7 space-y-3 p-4 rounded-xl bg-surface-2/60 border border-border flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="border-b border-border pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-text">{selectedReview.authorName}</span>
                      <div className="flex text-amber-500">
                        {Array.from({ length: selectedReview.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-text mt-1 italic">"{selectedReview.text}"</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-text flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span>AI Drafted Response (Editable by Owner)</span>
                      </label>
                    </div>
                    <textarea
                      rows={5}
                      value={draftReply}
                      onChange={(e) => setDraftReply(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-surface text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-[11px] text-text-muted">
                    Respectful & non-defensive tone.
                  </span>
                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Response</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Neutral Review Link & QR Generator (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm text-center">
          <div className="w-10 h-10 rounded-full bg-accent-soft text-accent flex items-center justify-center mx-auto">
            <QrCode className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-base text-text">Neutral QR Code & Link</h3>
            <p className="text-xs text-text-muted">
              Display on your billing counter or print on order slips.
            </p>
          </div>

          {/* Neutral QR Code SVG Graphic */}
          <div className="w-44 h-44 bg-surface-2 p-3 rounded-xl border border-border mx-auto flex items-center justify-center shadow-inner">
            <div className="w-full h-full bg-surface border-2 border-dashed border-text/20 rounded-lg flex flex-col items-center justify-center space-y-1">
              <QrCode className="w-20 h-20 text-text" />
              <span className="text-[10px] font-mono text-text-muted">Direct Google Link</span>
            </div>
          </div>

          <div className="p-2 rounded bg-surface-2 text-xs font-mono text-text truncate border border-border">
            https://g.page/r/{activeBusiness.slug}/review
          </div>

          <button
            type="button"
            onClick={handleCopyReviewLink}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-2 text-xs font-semibold text-text transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Link Copied!" : "Copy Neutral Review Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
