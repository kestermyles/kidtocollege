"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";
import { PhotoSection } from "@/components/PhotoSection";
import { GoldButton } from "@/components/GoldButton";
import {
  scholarships,
  SCHOLARSHIP_TYPES,
  US_STATES,
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

const SUBJECT_CHECKBOXES = [
  "STEM",
  "Arts",
  "Business",
  "Vocational",
  "Agriculture",
  "Leadership",
  "Gaming",
  "Faith",
  "Military",
  "Any",
];

function getTypeBadge(type: string) {
  const found = SCHOLARSHIP_TYPES.find((t) => t.value === type);
  return found || { label: type, color: "bg-gray-200 text-navy" };
}

export function ScholarshipsClient() {
  const [amountIdx, setAmountIdx] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const [stateFilter, setStateFilter] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subject)) next.delete(subject);
      else next.add(subject);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      if (typeFilter && s.type !== typeFilter) return false;
      if (selectedSubjects.size > 0 && s.subject && !selectedSubjects.has(s.subject))
        return false;
      if (stateFilter && s.state !== stateFilter) return false;
      if (deadlineFilter && !s.deadline.toLowerCase().includes(deadlineFilter.toLowerCase()))
        return false;
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
  }, [amountIdx, typeFilter, selectedSubjects, stateFilter, deadlineFilter]);

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
    setSelectedSubjects(new Set());
    setStateFilter("");
    setDeadlineFilter("");
  };

  const hasFilters =
    amountIdx > 0 || typeFilter || selectedSubjects.size > 0 || stateFilter || deadlineFilter;

  const subjectCheckboxes = (
    <div className="flex flex-wrap gap-2">
      {SUBJECT_CHECKBOXES.map((subject) => (
        <label
          key={subject}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-body cursor-pointer transition-all border ${
            selectedSubjects.has(subject)
              ? "bg-gold/15 border-gold text-navy font-medium"
              : "bg-white border-gray-200 text-navy/60 hover:border-gold/40"
          }`}
        >
          <input
            type="checkbox"
            checked={selectedSubjects.has(subject)}
            onChange={() => toggleSubject(subject)}
            className="sr-only"
          />
          <span
            className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
              selectedSubjects.has(subject)
                ? "bg-gold border-gold"
                : "border-gray-300"
            }`}
          >
            {selectedSubjects.has(subject) && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          {subject}
        </label>
      ))}
    </div>
  );

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
              {/* Row 1: dropdowns */}
              <div className="flex flex-wrap gap-3 items-end">
                {/* Amount */}
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
                    Amount
                  </label>
                  <select
                    value={amountIdx}
                    onChange={(e) => setAmountIdx(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white"
                  >
                    <option value="">All types</option>
                    {SCHOLARSHIP_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white"
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

              {/* Row 2: Subject checkboxes — desktop */}
              <div className="hidden sm:block mt-4 pt-4 border-t border-gray-100">
                <label className="block text-xs font-mono-label text-navy/60 mb-2 uppercase tracking-wider">
                  Filter by subject
                </label>
                {subjectCheckboxes}
                {selectedSubjects.size > 0 && (
                  <button
                    onClick={() => setSelectedSubjects(new Set())}
                    className="mt-2 text-xs font-body text-gold hover:text-gold/80 transition-colors"
                  >
                    Clear subjects
                  </button>
                )}
              </div>

              {/* Mobile filter button */}
              <div className="sm:hidden mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="flex items-center gap-2 text-sm font-body text-navy/70"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                  Filter by subject
                  {selectedSubjects.size > 0 && (
                    <span className="bg-gold text-navy text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {selectedSubjects.size}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {mobileFilterOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3">
                        {subjectCheckboxes}
                        {selectedSubjects.size > 0 && (
                          <button
                            onClick={() => setSelectedSubjects(new Set())}
                            className="mt-2 text-xs font-body text-gold hover:text-gold/80 transition-colors"
                          >
                            Clear subjects
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-display text-lg font-bold text-navy leading-snug">
                          {scholarship.name}
                        </h3>
                        <button
                          onClick={() => toggleSave(scholarship.name)}
                          className={`shrink-0 p-1.5 rounded transition-colors ${
                            saved.has(scholarship.name) ? "text-gold" : "text-navy/30 hover:text-gold"
                          }`}
                          aria-label={saved.has(scholarship.name) ? `Unsave ${scholarship.name}` : `Save ${scholarship.name}`}
                        >
                          <svg className="w-5 h-5" fill={saved.has(scholarship.name) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                          </svg>
                        </button>
                      </div>
                      <p className="font-mono-label text-gold font-bold text-base mb-3">
                        {scholarship.amount}
                      </p>
                      <div className="mb-3">
                        <span className={`inline-block font-mono-label text-xs px-2 py-0.5 rounded ${badge.color}`}>
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
                      <p className="text-sm font-body text-navy/70 mb-4 flex-1">
                        {scholarship.eligibility}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm font-body text-navy/50 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <span>Deadline: {scholarship.deadline}</span>
                      </div>
                      <a
                        href={scholarship.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-navy font-body font-medium px-4 py-2 rounded-md text-sm transition-colors w-fit"
                      >
                        Official website
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
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
