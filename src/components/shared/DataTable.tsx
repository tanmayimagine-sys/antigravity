"use client";

import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search records...",
  exportFileName = "export.csv",
  renderExpandedRow,
  emptyMessage = "No records found matching filters.",
  className = "",
}: {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  exportFileName?: string;
  renderExpandedRow?: (row: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  // Filter
  const filtered = data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as Record<string, unknown>)[sortKey];
    const bVal = (b as Record<string, unknown>)[sortKey];
    if (aVal === bVal) return 0;
    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;
    if (aVal < bVal) return sortAsc ? -1 : 1;
    return sortAsc ? 1 : -1;
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    if (sorted.length === 0) return;
    const headers = columns.map((c) => `"${c.header}"`).join(",");
    const rows = sorted.map((row) =>
      columns
        .map((col) => {
          const val = (row as Record<string, unknown>)[col.key as string];
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", exportFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top Search & Export Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          />
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-2 text-xs font-medium text-text transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-text-muted" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-2 text-text-muted border-b border-border sticky top-0">
              <tr>
                {renderExpandedRow && <th className="w-8 px-3 py-2.5" />}
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    onClick={() => col.sortable !== false && handleSort(String(col.key))}
                    className={`px-4 py-2.5 font-semibold select-none ${
                      col.sortable !== false ? "cursor-pointer hover:text-text" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.header}</span>
                      {col.sortable !== false && sortKey === col.key && (
                        sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (renderExpandedRow ? 1 : 0)}
                    className="p-8 text-center text-text-muted"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                sorted.map((row) => {
                  const isExpanded = expandedId === row.id;
                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        className={`hover:bg-surface-2/60 transition-colors ${
                          isExpanded ? "bg-surface-2/40" : ""
                        }`}
                      >
                        {renderExpandedRow && (
                          <td className="px-3 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => setExpandedId(isExpanded ? null : row.id)}
                              className="w-5 h-5 flex items-center justify-center text-text-muted hover:text-text"
                            >
                              <ChevronRight
                                className={`w-3.5 h-3.5 transition-transform ${
                                  isExpanded ? "rotate-90" : ""
                                }`}
                              />
                            </button>
                          </td>
                        )}
                        {columns.map((col) => (
                          <td key={String(col.key)} className="px-4 py-3 text-text">
                            {col.render
                              ? col.render(row)
                              : String((row as Record<string, unknown>)[col.key as string] ?? "—")}
                          </td>
                        ))}
                      </tr>
                      {isExpanded && renderExpandedRow && (
                        <tr className="bg-surface-2/20 border-b border-border">
                          <td colSpan={columns.length + 1} className="p-4">
                            {renderExpandedRow(row)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="sm:hidden space-y-2.5">
        {sorted.length === 0 ? (
          <div className="p-6 text-center text-xs text-text-muted bg-surface rounded-lg border border-border">
            {emptyMessage}
          </div>
        ) : (
          sorted.map((row) => (
            <div
              key={row.id}
              className="p-3.5 rounded-lg border border-border bg-surface text-xs space-y-2 shadow-sm"
            >
              {columns.map((col) => (
                <div key={String(col.key)} className="flex items-center justify-between gap-2">
                  <span className="text-text-muted font-medium">{col.header}:</span>
                  <span className="text-text font-semibold">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key as string] ?? "—")}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
