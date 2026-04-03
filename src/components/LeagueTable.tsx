"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export interface LeagueTableRow {
  name: string;
  location: string;
  acceptance_rate: number | null;
  avg_cost_instate: number | null;
  avg_cost_outstate: number | null;
  graduation_rate: number | null;
  match_score: number;
  is_community_college?: boolean;
}

interface LeagueTableProps {
  rows: LeagueTableRow[];
  major: string;
}

type SortKey =
  | "rank"
  | "name"
  | "acceptance_rate"
  | "avg_cost_instate"
  | "avg_cost_outstate"
  | "graduation_rate"
  | "match_score";

function getBadge(matchScore: number) {
  if (matchScore > 75)
    return {
      label: "Safety",
      className: "bg-sage/15 text-sage border-sage/30",
    };
  if (matchScore >= 50)
    return {
      label: "Match",
      className: "bg-gold/15 text-amber-700 border-gold/30",
    };
  return {
    label: "Reach",
    className: "bg-crimson/15 text-crimson border-crimson/30",
  };
}

function formatCurrency(amount: number | null) {
  if (amount == null) return "N/A";
  return `$${amount.toLocaleString()}`;
}

function formatPercent(rate: number | null) {
  if (rate == null) return "N/A";
  return `${rate}%`;
}

function SortArrow({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  return (
    <svg
      className={`inline-block w-3 h-3 ml-1 transition-opacity ${
        active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      {dir === "asc" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      )}
    </svg>
  );
}

export function LeagueTable({ rows, major }: LeagueTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("match_score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [savedRows, setSavedRows] = useState<Set<string>>(new Set());

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let aVal: number | string | null;
      let bVal: number | string | null;

      switch (sortKey) {
        case "rank":
        case "match_score":
          aVal = a.match_score;
          bVal = b.match_score;
          break;
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "acceptance_rate":
          aVal = a.acceptance_rate;
          bVal = b.acceptance_rate;
          break;
        case "avg_cost_instate":
          aVal = a.avg_cost_instate;
          bVal = b.avg_cost_instate;
          break;
        case "avg_cost_outstate":
          aVal = a.avg_cost_outstate;
          bVal = b.avg_cost_outstate;
          break;
        case "graduation_rate":
          aVal = a.graduation_rate;
          bVal = b.graduation_rate;
          break;
        default:
          return 0;
      }

      // Handle nulls
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      const numA = aVal as number;
      const numB = bVal as number;
      return sortDir === "asc" ? numA - numB : numB - numA;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  const toggleSave = (name: string) => {
    setSavedRows((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: "rank", label: "#", className: "w-12" },
    { key: "name", label: "School" },
    { key: "acceptance_rate", label: "Accept %" },
    { key: "avg_cost_instate", label: "Cost (In-State)" },
    { key: "avg_cost_outstate", label: "Cost (Out-of-State)" },
    { key: "graduation_rate", label: "Grad %" },
    { key: "match_score", label: "Match" },
  ];

  return (
    <FadeIn>
      <div className="ktc-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-card bg-cream/50">
                {/* Save column */}
                <th className="w-10 px-3 py-3" />
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-3 py-3 text-left cursor-pointer group select-none ${
                      col.className || ""
                    }`}
                    onClick={() => handleSort(col.key)}
                  >
                    <span className="font-mono-label text-xs uppercase tracking-wider text-navy/60">
                      {col.label}
                      {col.key === "match_score" && (
                        <span
                          title="Your personalised fit score based on your academic profile, budget, and goals. Not a general college ranking."
                          className="ml-1 cursor-help inline-flex items-center justify-center w-4 h-4 rounded-full border border-current text-xs opacity-60 hover:opacity-100"
                        >
                          ?
                        </span>
                      )}
                      <SortArrow
                        active={sortKey === col.key}
                        dir={sortKey === col.key ? sortDir : "asc"}
                      />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, idx) => {
                const badge = getBadge(row.match_score);
                const encodedName = encodeURIComponent(row.name);
                const encodedMajor = encodeURIComponent(major);
                return (
                  <tr
                    key={row.name}
                    className="border-b border-card last:border-b-0 hover:bg-cream/30 transition-colors"
                  >
                    {/* Save checkbox */}
                    <td className="px-3 py-3">
                      <label className="flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={savedRows.has(row.name)}
                          onChange={() => toggleSave(row.name)}
                          className="w-4 h-4 rounded border-card text-gold focus:ring-gold cursor-pointer accent-gold"
                          aria-label={`Save ${row.name}`}
                        />
                      </label>
                    </td>

                    {/* Rank */}
                    <td className="px-3 py-3">
                      <span className="font-mono-label text-sm text-navy/50">
                        {idx + 1}
                      </span>
                    </td>

                    {/* Name & location */}
                    <td className="px-3 py-3">
                      <Link
                        href={`/search?college=${encodedName}&major=${encodedMajor}`}
                        className="group/link"
                      >
                        <span className="font-body text-sm font-medium text-navy group-hover/link:text-gold transition-colors">
                          {row.name}
                        </span>
                        <span className="block text-xs font-body text-navy/50">
                          {row.location}
                        </span>
                        {row.is_community_college && (
                          <span className="inline-block mt-1 font-mono-label text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-sage/10 text-sage">
                            2+2 Transfer Route
                          </span>
                        )}
                      </Link>
                    </td>

                    {/* Acceptance rate */}
                    <td className="px-3 py-3 font-body text-sm text-navy">
                      {formatPercent(row.acceptance_rate)}
                    </td>

                    {/* Cost in-state */}
                    <td className="px-3 py-3 font-body text-sm text-navy">
                      {formatCurrency(row.avg_cost_instate)}
                    </td>

                    {/* Cost out-of-state */}
                    <td className="px-3 py-3 font-body text-sm text-navy">
                      {formatCurrency(row.avg_cost_outstate)}
                    </td>

                    {/* Graduation rate */}
                    <td className="px-3 py-3 font-body text-sm text-navy">
                      {formatPercent(row.graduation_rate)}
                    </td>

                    {/* Badge + score */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block font-mono-label text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        <span className="font-mono-label text-sm text-navy font-bold">
                          {row.match_score}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="p-12 text-center">
            <p className="font-body text-navy/50">No results to display.</p>
          </div>
        )}
      </div>
    </FadeIn>
  );
}
