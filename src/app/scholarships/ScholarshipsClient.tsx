"use client";

import { useState, useMemo } from "react";
import { FadeIn } from "@/components/FadeIn";
import { PhotoSection } from "@/components/PhotoSection";
import { GoldButton } from "@/components/GoldButton";
import {
  scholarships,
  SCHOLARSHIP_TYPES,
  US_STATES,
  SUBJECT_AREAS,
  DEADLINE_MONTHS,
} from "@/lib/scholarships-data";

const AMOUNT_RANGES = [
  { label: "Any amount", min: 0, max: Infinity },
  { label: "Under $1,000", min: 0, max: 1000 },
  { label: "$1,000 – $5,000", min: 1000, max: 5000 },
  { label: "$5,000 – $20,000", min: 5000, max: 20000 },
  { label: "$20,000 – $50,000", min: 20000, max: 50000 },
  { label: "Over $50,000 / Full Tuition", min: 50000, max: Infinity },
];

function getTypeBadge(type: string) {
  const found = SCHOLARSHIP_TYPES.find((t) => t.value === type);
  return found || { label: type, color: "bg-gray-200 text-navy" };
}

export function ScholarshipsClient() {
  const [amountIdx, setAmountIdx] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      // Type filter
      if (typeFilter && s.type !== typeFilter) return false;
      // Subject filter
      if (subjectFilter && s.subject !== subjectFilter) return false;
      // State filter
      if (stateFilter && s.state !== stateFilter) return false;
      // Deadline month filter
      if (deadlineFilter && !s.deadline.toLowerCase().includes(deadlineFilter.toLowerCase()))
        return false;
      // Amount range (rough heuristic from the amount string)
      if (amountIdx > 0) {
        const range = AMOUNT_RANGES[amountIdx];
        const nums = s.amount.match(/[\d,]+/g);
        if (nums) {
          const maxNum = Math.max(
            ...nums.map((n) => parseInt(n.replace(/,/g, ""), 10))
          );
          if (maxNum < range.min || maxNum > range.max) return false;
        }
      }
      return true;
    });
  }, [amountIdx, typeFilter, subjectFilter, stateFilter, deadlineFilter]);

  const toggleSave = (name: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const clearFilters = () => {
    setAmountIdx(0);
    setTypeFilter("");
    setSubjectFilter("");
    setStateFilter("");
    setDeadlineFilter("");
  };

  const hasFilters = amountIdx > 0 || typeFilter || subjectFilter || stateFilter || deadlineFilter;

  return (
    <>
      {/* Hero */}
      <PhotoSection imageUrl="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase tracking-wider text-gold">
              Scholarship Database
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white mt-4 leading-tight">
              $50 billion in scholarships.
              <br />
              <span className="text-gold italic">Find yours.</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 font-body max-w-2xl mx-auto">
              Federal grants, national awards, state programs, auto-merit scholarships
              most families never know exist, and local awards with fewer than 50
              applicants. All in one place.
            </p>
          </FadeIn>
        </div>
      </PhotoSection>

      {/* Filters + Grid */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter bar */}
          <FadeIn>
            <div className="ktc-card p-4 sm:p-6 mb-8">
              <div className="flex flex-wrap gap-3 items-end">
                {/* Amount */}
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
                    Amount
                  </label>
                  <select
                    value={amountIdx}
                    onChange={(e) => setAmountIdx(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-card rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white"
                  >
                    {AMOUNT_RANGES.map((r, i) => (
                      <option key={i} value={i}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
                    Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-card rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white"
                  >
                    <option value="">All types</option>
                    {SCHOLARSHIP_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
                    Subject
                  </label>
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-card rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white"
                  >
                    <option value="">All subjects</option>
                    {SUBJECT_AREAS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
                    State
                  </label>
                  <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-card rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white"
                  >
                    <option value="">All states</option>
                    {US_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deadline month */}
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
                    Deadline
                  </label>
                  <select
                    value={deadlineFilter}
                    onChange={(e) => setDeadlineFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-card rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white"
                  >
                    <option value="">Any month</option>
                    {DEADLINE_MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm font-body text-crimson hover:text-crimson/80 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Results count */}
          <FadeIn delay={0.05}>
            <p className="text-sm font-body text-navy/60 mb-6">
              Showing {filtered.length} of {scholarships.length} scholarships
              {saved.size > 0 && (
                <span className="ml-3 text-gold font-medium">
                  {saved.size} saved
                </span>
              )}
            </p>
          </FadeIn>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-xl text-navy/60">
                No scholarships match your filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-gold hover:text-gold/80 font-body font-medium transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((scholarship, i) => {
                const badge = getTypeBadge(scholarship.type);
                return (
                  <FadeIn key={scholarship.name} delay={Math.min(i * 0.03, 0.3)}>
                    <div className="ktc-card p-6 flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-display text-lg font-bold text-navy leading-snug">
                          {scholarship.name}
                        </h3>
                        <button
                          onClick={() => toggleSave(scholarship.name)}
                          className={`shrink-0 p-1.5 rounded transition-colors ${
                            saved.has(scholarship.name)
                              ? "text-gold"
                              : "text-navy/30 hover:text-gold"
                          }`}
                          aria-label={
                            saved.has(scholarship.name)
                              ? `Unsave ${scholarship.name}`
                              : `Save ${scholarship.name}`
                          }
                        >
                          <svg
                            className="w-5 h-5"
                            fill={saved.has(scholarship.name) ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Amount */}
                      <p className="font-mono-label text-gold font-bold text-base mb-3">
                        {scholarship.amount}
                      </p>

                      {/* Type badge */}
                      <div className="mb-3">
                        <span
                          className={`inline-block font-mono-label text-xs px-2 py-0.5 rounded ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                        {scholarship.subject && (
                          <span className="inline-block font-mono-label text-xs px-2 py-0.5 rounded bg-cream text-navy ml-1">
                            {scholarship.subject}
                          </span>
                        )}
                        {scholarship.state && (
                          <span className="inline-block font-mono-label text-xs px-2 py-0.5 rounded bg-cream text-navy ml-1">
                            {scholarship.state}
                          </span>
                        )}
                      </div>

                      {/* Eligibility */}
                      <p className="text-sm font-body text-navy/70 mb-4 flex-1">
                        {scholarship.eligibility}
                      </p>

                      {/* Deadline */}
                      <div className="flex items-center gap-1.5 text-sm font-body text-navy/50 mb-4">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                          />
                        </svg>
                        <span>Deadline: {scholarship.deadline}</span>
                      </div>

                      {/* Link */}
                      <a
                        href={scholarship.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-navy font-body font-medium px-4 py-2 rounded-md text-sm transition-colors w-fit"
                      >
                        Official website
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </a>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
              Want scholarships personalised to your student?
            </h2>
            <p className="text-navy/60 font-body mb-8">
              Our AI research engine finds scholarships specific to your
              student&apos;s profile, college, major, and activities.
            </p>
            <a href="/search">
              <GoldButton size="lg">
                Get personalised scholarship matches &rarr;
              </GoldButton>
            </a>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
