"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import type { AIResearchResult } from "@/lib/types";

interface Props {
  resultId?: string;
  searchId?: string;
}

type Status = "loading" | "complete" | "error";

export function ResultsLoader({ resultId: initialResultId, searchId }: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [resultId, setResultId] = useState(initialResultId);
  const [result, setResult] = useState<AIResearchResult | null>(null);
  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [pollCount, setPollCount] = useState(0);

  // Fetch full result data by resultId
  const fetchResult = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/research/result?id=${id}`);
      if (!res.ok) return false;
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
        setCollege(data.college || "");
        setMajor(data.major || "");
        setSuggestedQuestions(data.suggestedQuestions || []);
        setResultId(id);
        setStatus("complete");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // If we have a direct resultId, try to load it
    if (initialResultId) {
      fetchResult(initialResultId).then((ok) => {
        if (!ok) setStatus("error");
      });
      return;
    }

    // If we have a searchId, poll for completion
    if (!searchId) {
      setStatus("error");
      return;
    }

    const interval = setInterval(async () => {
      setPollCount((c) => c + 1);

      try {
        const res = await fetch(`/api/research/status?searchId=${searchId}`);
        const data = await res.json();

        if (data.status === "complete" && data.resultId) {
          clearInterval(interval);
          await fetchResult(data.resultId);
        }
      } catch {
        // Keep polling
      }
    }, 3000);

    // Give up after 100 polls (5 minutes)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setStatus("error");
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [initialResultId, searchId, fetchResult]);

  if (status === "loading") {
    return <PendingScreen pollCount={pollCount} />;
  }

  if (status === "error" || !result) {
    return <ErrorScreen />;
  }

  return (
    <ResultsDisplay
      result={result}
      college={college}
      major={major}
      searchId={searchId || ""}
      resultId={resultId}
      initialSuggestedQuestions={suggestedQuestions}
    />
  );
}

function PendingScreen({ pollCount }: { pollCount: number }) {
  const seconds = pollCount * 3;
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="w-14 h-14 border-4 border-gray-200 border-t-gold rounded-full animate-spin mx-auto" />
        </div>
        <h1 className="font-display text-2xl font-bold text-navy mb-3">
          Building your college report...
        </h1>
        <p className="font-body text-navy/60 mb-6">
          Our AI is researching scholarships, admissions data, and building your
          personal playbook. This typically takes 60–90 seconds.
        </p>
        {/* Progress bar */}
        <div className="max-w-xs mx-auto mb-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${Math.min(seconds / 90 * 100, 95)}%` }}
            />
          </div>
        </div>
        <p className="font-mono-label text-xs text-navy/30 uppercase tracking-wider">
          {seconds}s elapsed
        </p>
      </div>
    </div>
  );
}

function ErrorScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="mb-6">
          <svg
            className="w-12 h-12 text-crimson mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-navy mb-3">
          We&apos;re sorry — your report took too long to generate
        </h1>
        <p className="font-body text-navy/60 mb-8">
          This can happen during high demand. Please go back and try again —
          it usually works on the second attempt.
        </p>
        <Link
          href="/search"
          className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
        >
          Go back and try again &rarr;
        </Link>
      </div>
    </div>
  );
}
