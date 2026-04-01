"use client";

import { useState } from "react";
import Link from "next/link";

const APPEAL_REASONS = [
  "Change in income",
  "Job loss",
  "Medical expenses",
  "Competing offer",
  "Divorce/separation",
  "NPC was different",
  "Other",
];

export default function AppealLetterPage() {
  const [studentName, setStudentName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [currentOffer, setCurrentOffer] = useState("");
  const [reasons, setReasons] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [competingOffer, setCompetingOffer] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function toggleReason(reason: string) {
    setReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  }

  async function handleGenerate() {
    if (!studentName || !collegeName || !currentOffer || reasons.length === 0) {
      setError(
        "Please fill in your name, college, current offer, and select at least one reason."
      );
      return;
    }
    setError("");
    setLoading(true);
    setLetter("");

    try {
      const res = await fetch("/api/coach/appeal-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          collegeName,
          currentOffer,
          reasons,
          details,
          competingOffer,
          requestedAmount,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      setLetter(data.letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
            Financial Aid Appeal
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Your aid offer is a starting point
          </h1>
          <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
            Families who appeal their financial aid award receive on average
            $2,000–$5,000 more per year. Most never try because they don&apos;t
            know it&apos;s allowed.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4">
            <p className="text-sm text-amber-900">
              <strong>Educational guide only.</strong> This guide explains how the
              appeals process works. It is educational only, not financial advice.
              Always contact the financial aid office directly and consult a
              qualified advisor for your specific situation.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1 — When you can appeal */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-navy mb-6">
            When you can appeal
          </h2>
          <div className="font-body text-navy/70 space-y-4 leading-relaxed">
            <p>Appeal is appropriate when:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                <span>
                  Your financial situation has changed since filing FAFSA (job
                  loss, medical bills, divorce, death in family)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                <span>
                  You received a significantly better offer from a comparable
                  school
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                <span>
                  Your Net Price Calculator estimate was materially different
                  from your actual offer (more than $3,000)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                <span>
                  There was an error or unusual circumstance not captured on
                  FAFSA
                </span>
              </li>
            </ul>

            <div className="bg-crimson/5 border border-crimson/20 rounded-lg p-5 mt-6">
              <p className="font-body text-sm text-navy leading-relaxed">
                <strong className="text-crimson">Do NOT</strong> appeal just
                because you want more money with no new information — it rarely
                works and can seem entitled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — The 3-part appeal letter */}
      <section className="py-16 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-navy mb-8">
            The 3-part appeal letter
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="ktc-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-body font-bold text-navy text-sm flex-shrink-0">
                  1
                </span>
                <h3 className="font-display text-xl font-bold text-navy">
                  State facts, not emotions
                </h3>
              </div>
              <div className="space-y-3 text-sm font-body text-navy/70">
                <div className="bg-crimson/5 rounded-md p-3">
                  <p>
                    <strong className="text-crimson">Wrong:</strong>{" "}
                    &ldquo;We really can&apos;t afford this amount&rdquo;
                  </p>
                </div>
                <div className="bg-sage/5 rounded-md p-3">
                  <p>
                    <strong className="text-sage">Right:</strong> &ldquo;Since
                    filing our FAFSA, my father was laid off on [date]. Our
                    household income has decreased by approximately
                    $[amount].&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="ktc-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-body font-bold text-navy text-sm flex-shrink-0">
                  2
                </span>
                <h3 className="font-display text-xl font-bold text-navy">
                  Cite your specific reason
                </h3>
              </div>
              <ul className="space-y-2 text-sm font-body text-navy/70">
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  Changed circumstance: attach documentation
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  Competing offer: name the school and amount
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  NPC discrepancy: reference your screenshot
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="ktc-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-body font-bold text-navy text-sm flex-shrink-0">
                  3
                </span>
                <h3 className="font-display text-xl font-bold text-navy">
                  Ask for a specific number
                </h3>
              </div>
              <div className="space-y-3 text-sm font-body text-navy/70">
                <div className="bg-crimson/5 rounded-md p-3">
                  <p>
                    <strong className="text-crimson">Don&apos;t say:</strong>{" "}
                    &ldquo;Any help would be appreciated&rdquo;
                  </p>
                </div>
                <div className="bg-sage/5 rounded-md p-3">
                  <p>
                    <strong className="text-sage">Say:</strong> &ldquo;We are
                    requesting the college review our package with the goal of
                    bringing our out-of-pocket cost to approximately $[X] per
                    year.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Common mistakes */}
      <section className="py-16 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-navy mb-6">
            Common mistakes that kill appeals
          </h2>
          <ul className="space-y-3 font-body text-navy/70">
            {[
              'Emotional language ("my dream school")',
              'Vague requests ("anything helps")',
              "No documentation attached",
              "Waiting more than 2 weeks after receiving the offer",
              "Contacting admissions instead of financial aid office",
            ].map((mistake) => (
              <li key={mistake} className="flex items-start gap-3">
                <span className="mt-1.5 text-crimson flex-shrink-0">
                  &times;
                </span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 4 — AI Letter Generator */}
      <section className="py-16 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-navy mb-2">
            Generate your appeal letter
          </h2>
          <p className="font-body text-navy/60 mb-8">
            Tell us your situation and we&apos;ll draft an appeal letter you can
            edit and send.
          </p>

          <div className="ktc-card p-8 space-y-6">
            {/* Student name */}
            <div>
              <label className="font-body font-medium text-navy text-sm block mb-2">
                Student name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 font-body text-navy text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
              />
            </div>

            {/* College name */}
            <div>
              <label className="font-body font-medium text-navy text-sm block mb-2">
                College name
              </label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 font-body text-navy text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
              />
            </div>

            {/* Current offer */}
            <div>
              <label className="font-body font-medium text-navy text-sm block mb-2">
                Current aid offer
              </label>
              <input
                type="text"
                value={currentOffer}
                onChange={(e) => setCurrentOffer(e.target.value)}
                placeholder="e.g. $18,000/year"
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 font-body text-navy text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
              />
            </div>

            {/* Reasons */}
            <div>
              <label className="font-body font-medium text-navy text-sm block mb-3">
                Reason for appeal
              </label>
              <div className="flex flex-wrap gap-2">
                {APPEAL_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => toggleReason(reason)}
                    className={`px-4 py-2 rounded-full text-sm font-body transition-all ${
                      reasons.includes(reason)
                        ? "bg-gold text-navy font-medium"
                        : "bg-gray-100 text-navy/60 hover:bg-gray-200"
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional details */}
            <div>
              <label className="font-body font-medium text-navy text-sm block mb-2">
                Additional details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="e.g. My father was laid off in January. We have also had unexpected medical costs of $12,000."
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 font-body text-navy text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 resize-none"
              />
            </div>

            {/* Competing offer */}
            <div>
              <label className="font-body font-medium text-navy text-sm block mb-2">
                Competing offer{" "}
                <span className="font-normal text-navy/40">(if applicable)</span>
              </label>
              <input
                type="text"
                value={competingOffer}
                onChange={(e) => setCompetingOffer(e.target.value)}
                placeholder="e.g. State University offered $24,000/year"
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 font-body text-navy text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
              />
            </div>

            {/* Requested amount */}
            <div>
              <label className="font-body font-medium text-navy text-sm block mb-2">
                Requested amount{" "}
                <span className="font-normal text-navy/40">(optional)</span>
              </label>
              <input
                type="text"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                placeholder="e.g. $22,000/year"
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 font-body text-navy text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
              />
            </div>

            {error && (
              <p className="text-crimson text-sm font-body">{error}</p>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate my appeal letter →"}
            </button>
          </div>

          {/* Generated letter */}
          {letter && (
            <div className="mt-8">
              <div className="ktc-card p-8 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold text-navy">
                    Your draft appeal letter
                  </h3>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-gold/10 hover:bg-gold/20 text-navy font-body text-sm rounded-md transition-colors"
                  >
                    {copied ? "Copied!" : "Copy to clipboard"}
                  </button>
                </div>
                <div className="font-body text-navy/80 text-sm leading-relaxed whitespace-pre-wrap border border-gray-100 rounded-md p-6 bg-gray-50">
                  {letter}
                </div>
                <p className="text-xs text-navy/40 font-body mt-4">
                  We recommend pasting this into Google Docs to edit and
                  personalise before sending. Have a counselor or trusted adult
                  review it first.
                </p>
              </div>

              <p className="text-xs text-navy/40 font-body mt-3 text-center">
                Always review and personalise this draft. We recommend having a
                counselor or trusted adult review before sending.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Screenshot tip */}
      <section className="py-12 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-gold/10 border border-gold/30 rounded-lg p-6">
            <p className="font-body text-navy leading-relaxed">
              <strong>Before you appeal:</strong> screenshot your Net Price
              Calculator result and save it. Schools use NPC estimates as a
              baseline — having proof of the discrepancy strengthens your case
              significantly.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom nav */}
      <section className="py-16 bg-cream border-t border-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6">
            Continue coaching
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/coach/merit-sweet-spot"
              className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors"
            >
              Merit Sweet Spot
            </Link>
            <Link
              href="/coach/financial-aid"
              className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors"
            >
              Financial Aid
            </Link>
            <Link
              href="/fafsa-guide"
              className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors"
            >
              FAFSA Guide
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
