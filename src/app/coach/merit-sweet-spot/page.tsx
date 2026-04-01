"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { COLLEGES_SEED } from "@/lib/colleges-seed";

const GPA_OPTIONS = ["4.0", "3.5–3.9", "3.0–3.4", "2.5–2.9", "Below 2.5"];

interface CollegeOption {
  name: string;
  slug: string;
}

interface MeritResult {
  name: string;
  slug: string;
  tier: "top10" | "top25" | "mid50" | "bottom25" | "unavailable";
  sat_mid50: string | null;
  gpa_avg: string | null;
  reasoning: string;
}

const TIER_CONFIG = {
  top10: {
    badge: "Full Merit Territory",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    cardBorder: "border-yellow-300",
    message: (name: string) =>
      `Your GPA puts you in the top 10% of admitted students at ${name}. Schools at this level often award $12,000–$20,000/year automatically. That's up to $80,000 over 4 years.`,
  },
  top25: {
    badge: "Merit Sweet Spot",
    color: "bg-green-100 text-green-800 border-green-300",
    cardBorder: "border-green-300",
    message: (name: string) =>
      `You're in the sweet spot at ${name}. Partial merit aid of $6,000–$12,000/year is common here — worth $24,000–$48,000 over 4 years.`,
  },
  mid50: {
    badge: "Need-based focus",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    cardBorder: "border-blue-300",
    message: (name: string) =>
      `You're competitive at ${name} but not in merit territory. Focus on FAFSA and need-based aid here.`,
  },
  bottom25: {
    badge: "Reach school",
    color: "bg-gray-100 text-gray-600 border-gray-300",
    cardBorder: "border-gray-300",
    message: (name: string) =>
      `${name} is a reach. Consider whether the investment makes sense without merit aid.`,
  },
  unavailable: {
    badge: "Data unavailable",
    color: "bg-gray-50 text-gray-500 border-gray-200",
    cardBorder: "border-gray-200",
    message: (name: string) =>
      `We don't have reliable score data for ${name}. Check the Common Data Set on the college's page for details.`,
  },
};

const TIER_ORDER: MeritResult["tier"][] = [
  "top10",
  "top25",
  "mid50",
  "bottom25",
  "unavailable",
];

export default function MeritSweetSpotPage() {
  const [gpa, setGpa] = useState("");
  const [sat, setSat] = useState("");
  const [selectedColleges, setSelectedColleges] = useState<CollegeOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState<MeritResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allColleges: CollegeOption[] = COLLEGES_SEED.map((c) => ({
    name: c.name,
    slug: c.slug,
  }));

  const filteredColleges = allColleges
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedColleges.some((s) => s.slug === c.slug)
    )
    .slice(0, 8);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit() {
    if (!gpa || selectedColleges.length === 0) {
      setError("Please select a GPA range and at least one college.");
      return;
    }
    setError("");
    setLoading(true);
    setResults(null);

    try {
      const res = await fetch("/api/coach/merit-sweet-spot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gpa, sat, colleges: selectedColleges }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      const sorted = [...(data.results || [])].sort(
        (a: MeritResult, b: MeritResult) =>
          TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
      );
      setResults(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
            Merit Sweet Spot
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Find your merit sweet spot
          </h1>
          <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
            Merit scholarships go to students in the top 25% of applicants — not
            necessarily the top students overall. Here&apos;s where you stand.
          </p>
        </div>
      </section>

      {/* Input Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="ktc-card p-8">
            {/* GPA */}
            <div className="mb-6">
              <label className="font-body font-medium text-navy text-sm block mb-3">
                Your GPA
              </label>
              <div className="flex flex-wrap gap-2">
                {GPA_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setGpa(opt)}
                    className={`px-4 py-2 rounded-full text-sm font-body transition-all ${
                      gpa === opt
                        ? "bg-gold text-navy font-medium"
                        : "bg-gray-100 text-navy/60 hover:bg-gray-200"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* SAT */}
            <div className="mb-6">
              <label className="font-body font-medium text-navy text-sm block mb-2">
                SAT score{" "}
                <span className="font-normal text-navy/40">(optional)</span>
              </label>
              <input
                type="text"
                value={sat}
                onChange={(e) => setSat(e.target.value)}
                placeholder="e.g. 1320"
                className="w-full max-w-xs px-4 py-2.5 rounded-md border border-gray-200 font-body text-navy text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
              />
            </div>

            {/* College search */}
            <div className="mb-8">
              <label className="font-body font-medium text-navy text-sm block mb-2">
                Colleges{" "}
                <span className="font-normal text-navy/40">
                  (up to 8)
                </span>
              </label>

              {/* Selected pills */}
              {selectedColleges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedColleges.map((c) => (
                    <span
                      key={c.slug}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sage/10 text-sage text-sm rounded-full font-body"
                    >
                      {c.name}
                      <button
                        onClick={() =>
                          setSelectedColleges((prev) =>
                            prev.filter((p) => p.slug !== c.slug)
                          )
                        }
                        className="hover:text-crimson transition-colors"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search input */}
              {selectedColleges.length < 8 && (
                <div className="relative" ref={dropdownRef}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search for a college..."
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 font-body text-navy text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
                  />
                  {showDropdown && searchQuery.length > 0 && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredColleges.length > 0 ? (
                        filteredColleges.map((c) => (
                          <button
                            key={c.slug}
                            onClick={() => {
                              setSelectedColleges((prev) => [...prev, c]);
                              setSearchQuery("");
                              setShowDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2.5 font-body text-sm text-navy hover:bg-cream transition-colors"
                          >
                            {c.name}
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-2.5 font-body text-sm text-navy/40">
                          No colleges found
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <p className="text-crimson text-sm font-body mb-4">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analysing..." : "Show my sweet spots"}
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section className="pb-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-display text-2xl font-bold text-navy mb-6">
              Your results
            </h2>
            <div className="space-y-4">
              {results.map((r) => {
                const config = TIER_CONFIG[r.tier];
                return (
                  <div
                    key={r.slug}
                    className={`ktc-card p-6 border-l-4 ${config.cardBorder}`}
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="font-display text-lg font-bold text-navy">
                        {r.name}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
                      >
                        {config.badge}
                      </span>
                    </div>
                    <p className="font-body text-navy/70 text-sm leading-relaxed">
                      {config.message(r.name)}
                    </p>
                    {r.sat_mid50 && (
                      <p className="font-mono-label text-xs text-navy/40 mt-2">
                        SAT mid-50%: {r.sat_mid50}
                        {r.gpa_avg ? ` · Avg GPA: ${r.gpa_avg}` : ""}
                      </p>
                    )}
                    {r.tier === "unavailable" && (
                      <Link
                        href={`/college/${r.slug}`}
                        className="inline-block text-gold text-sm font-body mt-2 hover:text-gold/80 transition-colors"
                      >
                        View college page &rarr;
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Key insight */}
            <div className="mt-10 bg-gold/10 border border-gold/30 rounded-lg p-6">
              <p className="font-body text-navy leading-relaxed">
                <strong>The strategy most families miss:</strong> applying to 2–3
                schools where you&apos;re in the top 25% creates leverage. Even if
                you prefer a higher-ranked school, a merit offer from a lower-ranked
                one can be used in a financial aid appeal.
              </p>
            </div>

            {/* CTA to appeal letter */}
            <div className="mt-8 text-center">
              <Link
                href="/coach/appeal-letter"
                className="inline-block font-body font-medium bg-gold hover:bg-gold/90 text-navy px-8 py-4 rounded-md transition-all text-lg"
              >
                Got your aid offers? Learn how to appeal &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Bottom nav */}
      <section className="py-16 bg-cream border-t border-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6">
            Continue coaching
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/coach/test-prep"
              className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors"
            >
              Test Prep
            </Link>
            <Link
              href="/coach/appeal-letter"
              className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors"
            >
              Appeal Letter
            </Link>
            <Link
              href="/coach/financial-aid"
              className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors"
            >
              Financial Aid
            </Link>
            <Link
              href="/coach"
              className="font-body text-sm bg-gold/10 border border-gold/30 rounded-md px-5 py-2.5 text-navy hover:bg-gold/20 transition-colors"
            >
              All Coach sections
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
