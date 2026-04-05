"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { GoldButton } from "@/components/GoldButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { DisclaimerBar } from "@/components/DisclaimerBar";
import { askQuestion } from "@/app/actions/research";
import { createClient } from "@/lib/supabase-browser";
import type {
  AIResearchResult,
  ScholarshipResult,
  PlaybookItem,
  RecommendedCollege,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ResultsDisplayProps {
  result: AIResearchResult;
  college: string;
  major: string;
  searchId: string;
  resultId?: string;
  initialSuggestedQuestions: string[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ---------------------------------------------------------------------------
// Circular Progress
// ---------------------------------------------------------------------------

function CircularScore({
  score,
  size = 140,
  strokeWidth = 10,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e8e4de"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f2a900"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold text-gold">
          {score}
        </span>
        <span className="font-body text-xs text-navy/50 uppercase tracking-wider">
          Match
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section header helper
// ---------------------------------------------------------------------------

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 border-t border-gray-200 pt-8">
      {number && (
        <span className="text-xs font-mono text-amber-500 tracking-widest uppercase block mb-1">
          {number}
        </span>
      )}
      <h2 className="font-display text-2xl font-semibold text-navy">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-navy/60 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat pill
// ---------------------------------------------------------------------------

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <span className="text-sm text-gray-500">
        {label}
      </span>
      <span className="font-body font-semibold text-gray-900 text-lg">
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ResultsDisplay({
  result,
  college,
  major,
  searchId,
  initialSuggestedQuestions,
}: ResultsDisplayProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(
    initialSuggestedQuestions
  );
  const [saved, setSaved] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(true); // default true to avoid flash
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [scorecardData, setScorecardData] = useState<{
    median_earnings_6yr: number | null;
    median_earnings_10yr: number | null;
    employment_rate: number | null;
    graduation_rate_4yr: number | null;
  } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Multi-college detection
  const collegeNames = college
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const isMultiCollege = collegeNames.length > 1;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsSignedIn(!!data.user);
    });

    // Fetch Scorecard data for the first college
    if (collegeNames.length > 0) {
      supabase
        .from("colleges")
        .select(
          "median_earnings_6yr, median_earnings_10yr, employment_rate, graduation_rate_4yr"
        )
        .ilike("name", collegeNames[0])
        .limit(1)
        .single()
        .then(({ data }) => {
          if (data) setScorecardData(data);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------------------------
  // Ask a question
  // -----------------------------------------------------------------------

  async function handleAsk(question: string) {
    if (!question.trim() || chatLoading) return;

    const userMsg: ChatMessage = { role: "user", content: question.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    const response = await askQuestion({
      searchId,
      question: question.trim(),
      context: result,
      college,
      major,
    });

    if ("error" in response) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, something went wrong: ${response.error}`,
        },
      ]);
    } else {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.answer },
      ]);
      if (response.suggestedQuestions?.length) {
        setSuggestedQuestions(response.suggestedQuestions);
      }
    }

    setChatLoading(false);
  }

  // -----------------------------------------------------------------------
  // Derived data
  // -----------------------------------------------------------------------

  const {
    match_score,
    acceptance_rate,
    gpa_ranges,
    sat_ranges,
    scholarships,
    playbook,
    insider_intel,
    budget,
    cc_gateway,
    early_decision_advantage,
    essay_angles,
    live_links,
    recommended_colleges,
  } = result;

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-white">
      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(242,169,0,0.08)_0%,_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Top bar buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Link
              href="/search"
              className="font-body text-sm text-white/50 hover:text-white transition-colors"
            >
              &larr; New search
            </Link>
            <div className="flex-1" />
            <button
              onClick={async () => {
                if (!isSignedIn) {
                  window.location.href = `/auth/signup?next=/my-list`;
                  return;
                }
                if (!saved && collegeNames[0]) {
                  // Find slug for the first college
                  const slug = collegeNames[0]
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                  await fetch("/api/list", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      collegeSlug: slug,
                      category: "unknown",
                    }),
                  });
                }
                setSaved(!saved);
              }}
              className={`font-body text-sm px-4 py-2 rounded-md border transition-all ${
                saved
                  ? "bg-gold text-navy border-gold"
                  : "border-white/20 text-white hover:border-gold hover:text-gold"
              }`}
            >
              {saved ? "✓ On your list" : "Add to My List"}
            </button>
            <Link
              href={`/compare?colleges=${encodeURIComponent(college)}`}
              className="font-body text-sm px-4 py-2 rounded-md border border-white/20 text-white hover:border-gold hover:text-gold transition-all"
            >
              Compare
            </Link>
          </div>

          {/* Hero content */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            <FadeIn>
              <CircularScore score={match_score} size={160} strokeWidth={12} />
              <p className="text-sm text-white/60 mt-2 text-center max-w-xs mx-auto">
                Your personalised fit score — based on your GPA, budget, major, and goals
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div>
                {isMultiCollege ? (
                  <>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
                      Your College Comparison
                    </h1>
                    <p className="font-body text-lg md:text-xl text-gold mb-4">
                      {major}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {collegeNames.map((name) => (
                        <span
                          key={name}
                          className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 font-body text-sm text-white"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
                      {college}
                    </h1>
                    <p className="font-body text-lg md:text-xl text-gold">
                      {major}
                    </p>
                  </>
                )}
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="px-4 py-2 rounded-md bg-white/5 border border-white/10">
                    <span className="font-mono text-[11px] text-white/40 uppercase tracking-wider block">
                      Acceptance
                    </span>
                    <span className="font-body font-semibold text-white">
                      {acceptance_rate}
                    </span>
                  </div>
                  <div className="px-4 py-2 rounded-md bg-white/5 border border-white/10">
                    <span className="font-mono text-[11px] text-white/40 uppercase tracking-wider block">
                      Est. Total Cost After Aid
                    </span>
                    <span className="font-body font-semibold text-gold">
                      {budget.estimated_net_after_aid}
                    </span>
                  </div>
                  <div className="px-4 py-2 rounded-md bg-white/5 border border-white/10">
                    <span className="font-mono text-[11px] text-white/40 uppercase tracking-wider block">
                      Scholarships Found
                    </span>
                    <span className="font-body font-semibold text-white">
                      {scholarships.length}
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Signed-out nudge */}
      {!isSignedIn && !nudgeDismissed && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-cream rounded-lg px-4 py-3 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
            <p className="font-body text-sm text-navy/70 flex items-center gap-2">
              <svg className="w-4 h-4 text-sage flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              Save this report and track your colleges — free, takes 10 seconds.{" "}
              <Link
                href={`/auth/signup?next=/results${searchId ? `?searchId=${searchId}` : ""}`}
                className="text-sage hover:text-sage/80 underline underline-offset-2 whitespace-nowrap"
              >
                Create an account &rarr;
              </Link>
            </p>
            <button
              onClick={() => setNudgeDismissed(true)}
              className="text-navy/30 hover:text-navy/60 transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* REPORT BODY                                                      */}
      {/* ================================================================ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
        {/* -------------------------------------------------------------- */}
        {/* 01 — MATCH & ADMISSION                                         */}
        {/* -------------------------------------------------------------- */}
        <FadeIn>
          <section>
            <SectionHeader
              number="01"
              title="Match & Admission"
              subtitle="How you stack up against admitted students"
            />
            <p className="text-sm text-gray-500 mb-6">
              Your match score is personalised to you — it reflects how well this college fits your academic profile, budget, and goals. It is not a general college ranking.
            </p>
            <div className="ktc-card p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Score circle */}
                <div className="flex flex-col items-center justify-center">
                  <CircularScore score={match_score} />
                  <p className="font-body text-sm text-navy/50 mt-3 text-center">
                    Acceptance rate: {acceptance_rate}
                  </p>
                </div>

                {/* GPA ranges */}
                <div>
                  <h3 className="font-mono text-xs text-navy/50 uppercase tracking-wider mb-4">
                    GPA Ranges
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <StatPill label="Minimum" value={gpa_ranges.minimum} />
                    <StatPill label="Average" value={gpa_ranges.average} />
                    <StatPill
                      label="Mid-50 Low"
                      value={gpa_ranges.mid_50_low}
                    />
                    <StatPill
                      label="Mid-50 High"
                      value={gpa_ranges.mid_50_high}
                    />
                  </div>
                </div>

                {/* SAT ranges */}
                <div>
                  <h3 className="font-mono text-xs text-navy/50 uppercase tracking-wider mb-4">
                    SAT Ranges
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <StatPill label="Minimum" value={sat_ranges.minimum} />
                    <StatPill label="Average" value={sat_ranges.average} />
                    <StatPill
                      label="Mid-50 Low"
                      value={sat_ranges.mid_50_low}
                    />
                    <StatPill
                      label="Mid-50 High"
                      value={sat_ranges.mid_50_high}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* -------------------------------------------------------------- */}
        {/* YOU MIGHT ALSO CONSIDER                                        */}
        {/* -------------------------------------------------------------- */}
        {recommended_colleges && recommended_colleges.length > 0 && (
          <FadeIn>
            <section>
              <SectionHeader
                number=""
                title="You Might Also Consider"
                subtitle="Alternative colleges that fit your profile"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommended_colleges.map(
                  (rc: RecommendedCollege, i: number) => (
                    <div key={i} className="ktc-card p-5 flex flex-col">
                      <h3 className="font-display text-lg font-bold text-navy mb-2">
                        {rc.name}
                      </h3>
                      <p className="font-body text-sm text-navy/70 mb-3 flex-1">
                        {rc.reason}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-cream rounded p-2 text-center">
                          <p className="font-mono text-[10px] text-navy/40 uppercase tracking-wider">
                            Acceptance
                          </p>
                          <p className="font-body text-sm font-semibold text-navy">
                            {rc.acceptance_rate}
                          </p>
                        </div>
                        <div className="bg-cream rounded p-2 text-center">
                          <p className="font-mono text-[10px] text-navy/40 uppercase tracking-wider">
                            Est. Cost
                          </p>
                          <p className="font-body text-sm font-semibold text-navy">
                            {rc.estimated_cost}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gold/5 border border-gold/20 rounded p-2 mb-4">
                        <p className="font-mono text-[10px] text-gold uppercase tracking-wider">
                          Scholarship Potential
                        </p>
                        <p className="font-body text-sm text-navy">
                          {rc.scholarship_potential}
                        </p>
                      </div>
                      <Link
                        href={`/search?college=${encodeURIComponent(rc.name)}&major=${encodeURIComponent(major)}`}
                        className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors"
                      >
                        Research this college &rarr;
                      </Link>
                    </div>
                  )
                )}
              </div>
            </section>
          </FadeIn>
        )}

        {/* -------------------------------------------------------------- */}
        {/* 02 — BUDGET BREAKDOWN                                          */}
        {/* -------------------------------------------------------------- */}
        <FadeIn>
          <section>
            <SectionHeader
              number="02"
              title="Budget Breakdown"
              subtitle="All figures represent total annual cost of attendance"
            />
            <div className="ktc-card p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <BudgetItem label="Tuition" value={budget.tuition} />
                <BudgetItem label="Room & Board" value={budget.room_board} />
                <BudgetItem
                  label="Books & Living"
                  value={budget.books_living}
                />
                <BudgetItem
                  label="Total Sticker Price"
                  value={budget.total_sticker}
                />
              </div>

              {/* Highlighted net cost */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">
                    Est. Total Cost After Aid
                  </p>
                  <p className="font-display text-xl font-semibold text-amber-600">
                    {budget.estimated_net_after_aid}
                  </p>
                  <p className="font-body text-xs text-gray-400 mt-1">
                    Includes tuition, room &amp; board, books &amp; living expenses
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-block px-3 py-1 bg-sage/20 text-sage font-mono text-xs rounded-full">
                    With financial aid
                  </span>
                </div>
              </div>

              {budget.notes && (
                <p className="font-body text-sm text-navy/60 mt-4">
                  {budget.notes}
                </p>
              )}
            </div>
          </section>
        </FadeIn>

        {/* -------------------------------------------------------------- */}
        {/* GRADUATE OUTCOMES (from College Scorecard)                      */}
        {/* -------------------------------------------------------------- */}
        {scorecardData &&
          (scorecardData.median_earnings_6yr != null ||
            scorecardData.median_earnings_10yr != null ||
            scorecardData.employment_rate != null ||
            scorecardData.graduation_rate_4yr != null) && (
            <FadeIn>
              <section>
                <SectionHeader
                  number=""
                  title="Graduate Outcomes"
                  subtitle="Source: U.S. Department of Education College Scorecard"
                />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {scorecardData.median_earnings_6yr != null && (
                    <div className="ktc-card p-5 text-center">
                      <p className="font-mono-label text-gold text-xl sm:text-2xl font-bold">
                        ${scorecardData.median_earnings_6yr.toLocaleString()}
                      </p>
                      <p className="text-navy font-body text-sm font-medium mt-1">
                        Median Earnings at 6 Years
                      </p>
                      <p className="text-navy/50 text-xs font-body mt-1">
                        median graduate salary 6 years after starting
                      </p>
                    </div>
                  )}
                  {scorecardData.median_earnings_10yr != null && (
                    <div className="ktc-card p-5 text-center">
                      <p className="font-mono-label text-gold text-xl sm:text-2xl font-bold">
                        ${scorecardData.median_earnings_10yr.toLocaleString()}
                      </p>
                      <p className="text-navy font-body text-sm font-medium mt-1">
                        Median Earnings at 10 Years
                      </p>
                      <p className="text-navy/50 text-xs font-body mt-1">
                        median graduate salary 10 years after starting
                      </p>
                    </div>
                  )}
                  {scorecardData.employment_rate != null && (
                    <div className="ktc-card p-5 text-center">
                      <p className="font-mono-label text-gold text-xl sm:text-2xl font-bold">
                        {Math.round(scorecardData.employment_rate * 100)}%
                      </p>
                      <p className="text-navy font-body text-sm font-medium mt-1">
                        Employment Rate
                      </p>
                      <p className="text-navy/50 text-xs font-body mt-1">
                        graduates employed 2 years after completion
                      </p>
                    </div>
                  )}
                  {scorecardData.graduation_rate_4yr != null && (
                    <div className="ktc-card p-5 text-center">
                      <p className="font-mono-label text-gold text-xl sm:text-2xl font-bold">
                        {Math.round(scorecardData.graduation_rate_4yr * 100)}%
                      </p>
                      <p className="text-navy font-body text-sm font-medium mt-1">
                        4-Year Graduation Rate
                      </p>
                      <p className="text-navy/50 text-xs font-body mt-1">
                        students completing degree within 4 years
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs font-body text-navy/40 mt-4">
                  Data from{" "}
                  <a
                    href="https://collegescorecard.ed.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold/80 underline underline-offset-2"
                  >
                    U.S. Department of Education College Scorecard
                  </a>
                  . Figures represent recent cohorts and may not reflect current
                  outcomes.
                </p>
              </section>
            </FadeIn>
          )}

        {/* -------------------------------------------------------------- */}
        {/* 03 — SCHOLARSHIPS                                              */}
        {/* -------------------------------------------------------------- */}
        <FadeIn>
          <section>
            <SectionHeader
              number="03"
              title="Scholarships"
              subtitle={`${scholarships.length} funding opportunities found for you`}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {scholarships.map((s: ScholarshipResult, i: number) => (
                <div key={i} className="ktc-card p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-display text-lg font-semibold text-navy leading-tight">
                      {s.name}
                    </h3>
                    <span className="font-mono text-xs px-2 py-1 bg-cream text-navy/70 rounded whitespace-nowrap">
                      {s.type}
                    </span>
                  </div>
                  <p className="font-display text-2xl font-bold text-gold mb-3">
                    {s.amount}
                  </p>
                  <p className="font-body text-sm text-navy/70 mb-2">
                    <span className="font-semibold">Eligibility:</span>{" "}
                    {s.eligibility}
                  </p>
                  <p className="font-body text-sm text-navy/70 mb-2">
                    <span className="font-semibold">Deadline:</span>{" "}
                    {s.deadline}
                  </p>
                  <div className="bg-cream/60 rounded p-3 mb-4 flex-1">
                    <p className="font-body text-sm text-sage italic">
                      &ldquo;{s.why_this_student}&rdquo;
                    </p>
                  </div>
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-gold hover:text-gold/80 font-medium transition-colors"
                    >
                      Apply &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* -------------------------------------------------------------- */}
        {/* 04 — YOUR PLAYBOOK                                             */}
        {/* -------------------------------------------------------------- */}
        <FadeIn>
          <section>
            <SectionHeader
              number="04"
              title="Your Playbook"
              subtitle="Step-by-step action items to maximise your chances"
            />
            <div className="space-y-4">
              {playbook.map((item: PlaybookItem, i: number) => (
                <div key={i} className="ktc-card p-5 md:p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-navy flex items-center justify-center">
                      <span className="font-mono text-sm font-bold text-gold">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-semibold text-navy mb-1">
                        {item.title}
                      </h3>
                      <p className="font-body text-navy/70 text-sm mb-2">
                        {item.description}
                      </p>
                      <p className="font-body text-sm text-sage font-medium">
                        {item.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* -------------------------------------------------------------- */}
        {/* 05 — INSIDER INTEL                                             */}
        {/* -------------------------------------------------------------- */}
        <FadeIn>
          <section>
            <SectionHeader
              number="05"
              title="Insider Intel"
              subtitle="What most families don't know"
            />
            <div className="ktc-card p-6 md:p-8">
              <ul className="space-y-3">
                {insider_intel.map((tip: string, i: number) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-gold" />
                    <p className="font-body text-navy/80">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </FadeIn>

        {/* -------------------------------------------------------------- */}
        {/* 06 — COMMUNITY COLLEGE GATEWAY                                 */}
        {/* -------------------------------------------------------------- */}
        <FadeIn>
          <section>
            <SectionHeader
              number="06"
              title="Community College Gateway"
              subtitle="The Smart Path"
            />
            <div className="ktc-card p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-mono text-xs text-navy/50 uppercase tracking-wider mb-3">
                    Recommended Community Colleges
                  </h3>
                  <ul className="space-y-2 mb-6">
                    {cc_gateway.community_colleges.map(
                      (cc: string, i: number) => (
                        <li key={i} className="flex gap-2 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                          <span className="font-body text-navy">{cc}</span>
                        </li>
                      )
                    )}
                  </ul>
                  <p className="font-body text-navy/70 text-sm">
                    {cc_gateway.transfer_route_description}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="bg-cream rounded-lg p-4">
                    <p className="font-mono text-xs text-navy/50 uppercase tracking-wider mb-1">
                      Cost Comparison
                    </p>
                    <p className="font-body text-navy font-medium">
                      {cc_gateway.cost_comparison}
                    </p>
                  </div>
                  <div className="bg-cream rounded-lg p-4">
                    <p className="font-mono text-xs text-navy/50 uppercase tracking-wider mb-1">
                      Transfer Success Rate
                    </p>
                    <p className="font-display text-2xl font-bold text-sage">
                      {cc_gateway.transfer_success_rate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* -------------------------------------------------------------- */}
        {/* 07 — EARLY DECISION ADVANTAGE                                  */}
        {/* -------------------------------------------------------------- */}
        <FadeIn>
          <section>
            <SectionHeader number="07" title="Early Decision Advantage" />
            <div className="ktc-card p-6 md:p-8 border-l-4 border-l-gold">
              <p className="font-body text-navy/80 text-lg">
                {early_decision_advantage}
              </p>
            </div>
          </section>
        </FadeIn>

        {/* -------------------------------------------------------------- */}
        {/* 08 — ESSAY ANGLES                                              */}
        {/* -------------------------------------------------------------- */}
        <FadeIn>
          <section>
            <SectionHeader
              number="08"
              title="Essay Angles"
              subtitle="Personalised essay topic suggestions"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {essay_angles.map((angle: string, i: number) => (
                <div key={i} className="ktc-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                      <span className="font-mono text-xs font-bold text-gold">
                        {i + 1}
                      </span>
                    </span>
                    <span className="font-mono text-xs text-navy/40 uppercase tracking-wider">
                      Angle {i + 1}
                    </span>
                  </div>
                  <p className="font-body text-navy/80">{angle}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* -------------------------------------------------------------- */}
        {/* 09 — OFFICIAL LINKS                                            */}
        {/* -------------------------------------------------------------- */}
        <FadeIn>
          <section>
            <SectionHeader
              number="09"
              title="Official Links"
              subtitle="Go straight to the source"
            />
            <div className="flex flex-wrap gap-3">
              <LinkButton href={live_links.admissions} label="Admissions" />
              <LinkButton
                href={live_links.financial_aid}
                label="Financial Aid"
              />
              <LinkButton href={live_links.program} label="Program Page" />
              <LinkButton
                href={live_links.scholarships}
                label="Scholarships"
              />
            </div>
          </section>
        </FadeIn>
      </div>

      {/* ================================================================ */}
      {/* DISCLAIMER                                                       */}
      {/* ================================================================ */}
      <DisclaimerBar />

      {/* ================================================================ */}
      {/* ASK-ANYTHING CHAT                                                */}
      {/* ================================================================ */}
      <section className="bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <FadeIn>
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-2">
                Ask Anything
              </h2>
              <p className="font-body text-navy/60">
                Have a follow-up question about {isMultiCollege ? "these colleges" : college}? Ask away.
              </p>
            </div>
          </FadeIn>

          {/* Suggested questions */}
          {suggestedQuestions.length > 0 && chatMessages.length === 0 && (
            <FadeIn delay={0.1}>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {suggestedQuestions.map((q: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(q)}
                    disabled={chatLoading}
                    className="font-body text-sm px-4 py-2 rounded-full border-2 border-gold/40 text-navy hover:border-gold hover:bg-gold/5 transition-all disabled:opacity-50 text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </FadeIn>
          )}

          {/* Chat history */}
          {chatMessages.length > 0 && (
            <div className="space-y-4 mb-6">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-xl px-5 py-3 ${
                      msg.role === "user"
                        ? "bg-navy text-white"
                        : "bg-white text-navy ktc-card"
                    }`}
                  >
                    <p className="font-body text-sm whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white ktc-card rounded-xl px-5 py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}

          {/* Suggested questions after a response */}
          {chatMessages.length > 0 &&
            !chatLoading &&
            suggestedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {suggestedQuestions.map((q: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(q)}
                    disabled={chatLoading}
                    className="font-body text-xs px-3 py-1.5 rounded-full border border-gold/30 text-navy/70 hover:border-gold hover:text-navy transition-all disabled:opacity-50 text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(chatInput);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Ask about ${isMultiCollege ? "these colleges" : college}...`}
              disabled={chatLoading}
              className="flex-1 font-body bg-white border border-card rounded-lg px-4 py-3 text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold disabled:opacity-50"
            />
            <GoldButton
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
            >
              Send
            </GoldButton>
          </form>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Budget Item helper
// ---------------------------------------------------------------------------

function BudgetItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-4 bg-cream rounded-lg">
      <p className="font-mono text-[11px] text-navy/50 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="font-body font-semibold text-navy text-lg">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Link Button helper
// ---------------------------------------------------------------------------

function LinkButton({ href, label }: { href: string; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-body text-sm px-5 py-2.5 rounded-md bg-navy text-white hover:bg-navy/90 transition-colors"
    >
      {label} &rarr;
    </a>
  );
}
