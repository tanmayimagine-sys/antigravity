"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-dashed border-border bg-surface/50 p-8 text-center space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-text-muted mx-auto">
        <Icon className="w-6 h-6 text-text-muted" />
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-text text-sm">{title}</h4>
        <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-2 rounded-md bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-sm transition-transform active:scale-[0.98]"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
