"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ACTIVITIES,
  WORK_STYLES,
  IMPACTS,
  scoreMajors,
  type MajorResult,
} from "@/lib/major-quiz-data";

const TOTAL_STEPS = 4;

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-2 mb-8">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
            i < step ? "bg-gold" : "bg-navy/10"
          }`}
        />
      ))}
    </div>
  );
}

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-full font-body text-sm transition-all border ${
        selected
          ? "bg-gold text-navy border-gold font-medium"
          : "bg-white text-navy/70 border-gray-200 hover:border-gold/50"
      }`}
    >
      {label}
    </button>
  );
}

export default function DiscoverPage() {
  const [step, setStep] = useState(1);
  const [activities, setActivities] = useState<string[]>([]);
  const [workStyle, setWorkStyle] = useState("");
  const [impacts, setImpacts] = useState<string[]>([]);
  const [results, setResults] = useState<MajorResult[]>([]);

  function toggleActivity(a: string) {
    setActivities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  function toggleImpact(i: string) {
    setImpacts((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  }

  function handleNext() {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const majors = scoreMajors(activities, workStyle, impacts);
      setResults(majors);
      setStep(4);
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <ProgressBar step={step} />

        {step === 1 && (
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-2">
              What activities make you lose track of time?
            </h1>
            <p className="font-body text-navy/50 text-sm mb-8">
              Pick as many as you like — there are no wrong answers.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {ACTIVITIES.map((a) => (
                <Pill
                  key={a}
                  label={a}
                  selected={activities.includes(a)}
                  onClick={() => toggleActivity(a)}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={activities.length === 0}
              className="w-full bg-gold hover:bg-gold/90 text-navy font-body font-medium py-4 rounded-md text-lg transition-colors disabled:opacity-40"
            >
              Next &rarr;
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-2">
              How do you prefer to work?
            </h1>
            <p className="font-body text-navy/50 text-sm mb-8">Pick one.</p>
            <div className="space-y-3 mb-8">
              {WORK_STYLES.map((w) => (
                <button
                  key={w}
                  onClick={() => setWorkStyle(w)}
                  className={`w-full text-left px-5 py-4 rounded-lg border transition-all ${
                    workStyle === w
                      ? "border-gold bg-gold/10 text-navy font-medium"
                      : "border-gray-200 text-navy/70 hover:border-gold/40"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 border border-gray-200 rounded-md font-body text-navy/50 hover:text-navy transition-colors"
              >
                &larr; Back
              </button>
              <button
                onClick={handleNext}
                disabled={!workStyle}
                className="flex-1 bg-gold hover:bg-gold/90 text-navy font-body font-medium py-4 rounded-md text-lg transition-colors disabled:opacity-40"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-2">
              What kind of impact do you want to have?
            </h1>
            <p className="font-body text-navy/50 text-sm mb-8">
              Pick as many as resonate.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {IMPACTS.map((i) => (
                <Pill
                  key={i}
                  label={i}
                  selected={impacts.includes(i)}
                  onClick={() => toggleImpact(i)}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-4 border border-gray-200 rounded-md font-body text-navy/50 hover:text-navy transition-colors"
              >
                &larr; Back
              </button>
              <button
                onClick={handleNext}
                disabled={impacts.length === 0}
                className="flex-1 bg-gold hover:bg-gold/90 text-navy font-body font-medium py-4 rounded-md text-lg transition-colors disabled:opacity-40"
              >
                See my results &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 4 && results.length > 0 && (
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-2">
              Your top majors
            </h1>
            <p className="font-body text-navy/50 text-sm mb-8">
              Based on your interests, work style, and goals.
            </p>
            <div className="space-y-4 mb-10">
              {results.map((m, i) => (
                <div key={m.slug} className="ktc-card p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center font-mono text-xs font-bold text-gold">
                      {i + 1}
                    </span>
                    <h2 className="font-display text-lg font-bold text-navy">
                      {m.name}
                    </h2>
                  </div>
                  <p className="font-body text-sm text-navy/60 mb-4">
                    {m.description}
                  </p>
                  <Link
                    href={`/search?major=${encodeURIComponent(m.name)}&mode=league`}
                    className="text-gold font-body text-sm font-medium hover:text-gold/80"
                  >
                    Find colleges strong in {m.name} &rarr;
                  </Link>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setActivities([]);
                  setWorkStyle("");
                  setImpacts([]);
                  setResults([]);
                }}
                className="px-6 py-3 border border-gray-200 rounded-md font-body text-sm text-navy/50 hover:text-navy transition-colors"
              >
                Retake quiz
              </button>
              <Link
                href="/search"
                className="px-6 py-3 bg-gold hover:bg-gold/90 text-navy font-body font-medium rounded-md transition-colors"
              >
                Start college research &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/colleges" className="px-4 py-2 border border-gray-200 rounded-md font-body text-xs text-navy/50 hover:border-gold/40 transition-colors">Browse colleges</Link>
              <Link href="/my-chances" className="px-4 py-2 border border-gray-200 rounded-md font-body text-xs text-navy/50 hover:border-gold/40 transition-colors">Check your chances</Link>
              <Link href="/scholarships" className="px-4 py-2 border border-gray-200 rounded-md font-body text-xs text-navy/50 hover:border-gold/40 transition-colors">Find scholarships</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
