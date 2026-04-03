"use client";

import { useState, useCallback } from "react";
import { FadeIn } from "@/components/FadeIn";
import { GoldButton } from "@/components/GoldButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { createClient } from "@/lib/supabase-browser";
import type { College } from "@/lib/types";

const MAX_COLLEGES = 4;

function formatCurrency(amount: number | null) {
  if (amount == null) return "N/A";
  return `$${amount.toLocaleString()}`;
}

function formatPercent(rate: number | null) {
  if (rate == null) return "N/A";
  return `${rate}%`;
}

function CompareRow({
  label,
  values,
}: {
  label: string;
  values: (string | null)[];
}) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `160px repeat(${values.length}, 1fr)` }}>
      <div className="font-body text-sm font-medium text-navy/60 py-3 flex items-center">
        {label}
      </div>
      {values.map((v, i) => (
        <div
          key={i}
          className="font-body text-sm text-navy py-3 flex items-center"
        >
          {v || "N/A"}
        </div>
      ))}
    </div>
  );
}

export default function ComparePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchColleges = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      if (query.length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }
      setSearching(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("colleges")
          .select("*")
          .ilike("name", `%${query}%`)
          .limit(8);
        setSearchResults((data as College[]) || []);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    },
    []
  );

  const addCollege = (college: College) => {
    if (colleges.length >= MAX_COLLEGES) return;
    if (colleges.some((c) => c.slug === college.slug)) return;
    setColleges((prev) => [...prev, college]);
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  const removeCollege = (slug: string) => {
    setColleges((prev) => prev.filter((c) => c.slug !== slug));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-28 pb-12 sm:pt-32 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase tracking-wider text-gold">
              Compare
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-navy mt-3 mb-4">
              Compare colleges side by side
            </h1>
            <p className="text-navy/60 font-body max-w-xl">
              Search and add up to {MAX_COLLEGES} colleges to compare costs,
              acceptance rates, graduation rates, and more.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Search */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.1}>
            {colleges.length < MAX_COLLEGES && (
              <div className="relative max-w-md">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => searchColleges(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setShowDropdown(true);
                    }}
                    onBlur={() => {
                      // Delay to allow click on dropdown item
                      setTimeout(() => setShowDropdown(false), 200);
                    }}
                    placeholder="Search for a college..."
                    className="flex-1 px-4 py-3 border border-card rounded-md font-body text-navy placeholder:text-navy/30 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                  />
                  {searching && (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}
                </div>

                {/* Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-card rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((c) => {
                      const alreadyAdded = colleges.some(
                        (col) => col.slug === c.slug
                      );
                      return (
                        <button
                          key={c.slug}
                          onClick={() => addCollege(c)}
                          disabled={alreadyAdded}
                          className={`w-full text-left px-4 py-3 font-body text-sm hover:bg-cream transition-colors border-b border-card last:border-b-0 ${
                            alreadyAdded
                              ? "opacity-40 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <span className="font-medium text-navy">
                            {c.name}
                          </span>
                          <span className="text-navy/50 ml-2">
                            {c.location}, {c.state}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {showDropdown &&
                  searchQuery.length >= 2 &&
                  searchResults.length === 0 &&
                  !searching && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-card rounded-md shadow-lg">
                      <button
                        onClick={() => {
                          const tempCollege: College = {
                            slug: searchQuery.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                            name: searchQuery,
                            location: "",
                            state: "",
                            acceptance_rate: null,
                            avg_cost_instate: null,
                            avg_cost_outstate: null,
                            graduation_rate: null,
                            total_enrollment: null,
                            photo_url: null,
                            programs: [],
                            last_updated: new Date().toISOString(),
                          };
                          addCollege(tempCollege);
                        }}
                        className="w-full text-left px-4 py-3 font-body text-sm hover:bg-cream transition-colors cursor-pointer"
                      >
                        <span className="text-gold font-medium">
                          Add &quot;{searchQuery}&quot; to comparison &rarr;
                        </span>
                        <span className="block text-navy/40 text-xs mt-0.5">
                          No exact match found — add manually
                        </span>
                      </button>
                    </div>
                  )}
              </div>
            )}

            {colleges.length >= MAX_COLLEGES && (
              <p className="text-sm font-body text-navy/50">
                Maximum of {MAX_COLLEGES} colleges reached. Remove one to add
                another.
              </p>
            )}
          </FadeIn>
        </div>
      </section>

      {/* Comparison */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {colleges.length === 0 ? (
            <FadeIn>
              <div className="ktc-card p-12 sm:p-16 text-center">
                <svg
                  className="w-16 h-16 text-navy/20 mx-auto mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                  />
                </svg>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-navy mb-3">
                  Add colleges to compare
                </h2>
                <p className="text-navy/60 font-body max-w-md mx-auto">
                  Search for a college above to start comparing. You can add up
                  to {MAX_COLLEGES} colleges side by side.
                </p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              {/* College cards (columns) */}
              <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `repeat(${colleges.length}, 1fr)` }}>
                {colleges.map((c) => (
                  <div key={c.slug} className="ktc-card p-6">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy">
                          {c.name}
                        </h3>
                        <p className="text-navy/50 text-sm font-body">
                          {c.location}, {c.state}
                        </p>
                      </div>
                      <button
                        onClick={() => removeCollege(c.slug)}
                        className="shrink-0 p-1 text-navy/30 hover:text-crimson transition-colors"
                        aria-label={`Remove ${c.name}`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div className="ktc-card overflow-x-auto">
                <div className="min-w-[500px] p-6 divide-y divide-card">
                  <CompareRow
                    label="Acceptance Rate"
                    values={colleges.map((c) =>
                      formatPercent(c.acceptance_rate)
                    )}
                  />
                  <CompareRow
                    label="Cost (In-State)"
                    values={colleges.map((c) =>
                      formatCurrency(c.avg_cost_instate)
                    )}
                  />
                  <CompareRow
                    label="Cost (Out-of-State)"
                    values={colleges.map((c) =>
                      formatCurrency(c.avg_cost_outstate)
                    )}
                  />
                  <CompareRow
                    label="Graduation Rate"
                    values={colleges.map((c) =>
                      formatPercent(c.graduation_rate)
                    )}
                  />
                  <CompareRow
                    label="Total Enrollment"
                    values={colleges.map((c) =>
                      c.total_enrollment
                        ? c.total_enrollment.toLocaleString()
                        : "N/A"
                    )}
                  />
                  <CompareRow
                    label="Programs"
                    values={colleges.map((c) =>
                      c.programs && c.programs.length > 0
                        ? c.programs.slice(0, 5).join(", ") +
                          (c.programs.length > 5
                            ? ` +${c.programs.length - 5} more`
                            : "")
                        : "N/A"
                    )}
                  />
                </div>
              </div>

              {/* Add more button */}
              {colleges.length < MAX_COLLEGES && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      const input = document.querySelector<HTMLInputElement>(
                        'input[placeholder="Search for a college..."]'
                      );
                      input?.focus();
                    }}
                    className="text-gold hover:text-gold/80 font-body font-medium text-sm transition-colors"
                  >
                    + Add another college
                  </button>
                </div>
              )}
            </FadeIn>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
              Want deeper research on any of these?
            </h2>
            <p className="text-navy/60 font-body mb-8">
              Get a full AI research report personalised to you — including
              scholarships, admissions strategy, and a step-by-step playbook.
            </p>
            <a href="/search">
              <GoldButton size="lg">
                Start free research &rarr;
              </GoldButton>
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
