import { Metadata } from "next";
import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { getCachedResult } from "@/lib/result-cache";
import { generateSuggestedQuestions } from "@/app/actions/research";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import type { AIResearchResult } from "@/lib/types";

export const metadata: Metadata = {
  title: "Your Research Report — KidToCollege",
  description:
    "Your personalised college research report with scholarships, admissions data, budget breakdown, and a step-by-step playbook.",
};

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const resultId = typeof params.id === "string" ? params.id : "";
  const retryCount = typeof params.retry === "string" ? parseInt(params.retry, 10) : 0;

  if (!resultId) {
    return <ResultsError />;
  }

  let result: AIResearchResult | null = null;
  let college = "Unknown College";
  let major = "Unknown Major";
  let searchId = resultId;

  // Try Supabase first
  const hasSupabase = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (hasSupabase) {
    try {
      const supabase = createServiceRoleClient();
      const { data: resultRow, error: fetchErr } = await supabase
        .from("results")
        .select("*, searches(college, major)")
        .eq("id", resultId)
        .single();

      console.log("[results page] resultId:", resultId);
      console.log("[results page] fetchErr:", fetchErr);
      console.log("[results page] resultRow:", !!resultRow);

      if (resultRow) {
        result = resultRow.raw_ai_response as AIResearchResult;
        const search = resultRow.searches as unknown as {
          college: string;
          major: string;
        } | null;
        college = search?.college ?? "Unknown College";
        major = search?.major ?? "Unknown Major";
        searchId = resultRow.search_id;
      }
    } catch (err) {
      console.error("[results page] Supabase fetch threw:", err);
    }
  }

  // Fall back to in-memory cache
  if (!result) {
    const cached = getCachedResult(resultId);
    console.log("[results page] memory cache hit:", !!cached);
    if (cached) {
      result = cached.result;
      college = cached.college;
      major = cached.major;
    }
  }

  // If still no result, show pending or error based on retry count
  if (!result) {
    if (retryCount >= 10) {
      return <ResultsError />;
    }
    return <ResultsPending resultId={resultId} retryCount={retryCount} />;
  }

  // Generate initial suggested questions
  const suggestedQuestions = await generateSuggestedQuestions(
    college,
    major,
    result
  );

  return (
    <ResultsDisplay
      result={result}
      college={college}
      major={major}
      searchId={searchId}
      resultId={resultId}
      initialSuggestedQuestions={suggestedQuestions}
    />
  );
}

function ResultsPending({
  resultId,
  retryCount,
}: {
  resultId: string;
  retryCount: number;
}) {
  const nextRetry = retryCount + 1;
  const refreshUrl = `/results?id=${resultId}&retry=${nextRetry}`;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <head>
        <meta httpEquiv="refresh" content={`15;url=${refreshUrl}`} />
      </head>
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="w-12 h-12 border-4 border-navy/20 border-t-gold rounded-full animate-spin mx-auto" />
        </div>
        <h1 className="font-display text-2xl font-bold text-navy mb-3">
          Your report is being generated
        </h1>
        <p className="font-body text-navy/60 mb-6">
          This can take up to 90 seconds. This page will refresh automatically.
        </p>
        <p className="font-mono-label text-xs text-navy/30 uppercase tracking-wider">
          Attempt {nextRetry} of 10 — refreshing in 15 seconds...
        </p>
      </div>
    </div>
  );
}

function ResultsError() {
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
