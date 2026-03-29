import { Metadata } from "next";
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

  if (!resultId) {
    return <ResultsPending />;
  }

  let result: AIResearchResult | null = null;
  let college = "Unknown College";
  let major = "Unknown Major";
  let searchId = resultId;

  // Try Supabase first (wrapped in try/catch — Supabase may be paused)
  const hasSupabase = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (hasSupabase) {
    try {
      const supabase = createServiceRoleClient();
      const { data: resultRow } = await supabase
        .from("results")
        .select("*, searches(college, major)")
        .eq("id", resultId)
        .single();

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
      console.warn("[results] Supabase fetch failed, trying memory cache:", err);
    }
  }

  // Fall back to in-memory cache
  if (!result) {
    const cached = getCachedResult(resultId);
    if (cached) {
      result = cached.result;
      college = cached.college;
      major = cached.major;
    }
  }

  // If still no result, show a pending/retry page
  if (!result) {
    return <ResultsPending />;
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

function ResultsPending() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="10" />
      </head>
      <body>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="mb-8">
              <div className="w-12 h-12 border-4 border-navy/20 border-t-gold rounded-full animate-spin mx-auto" />
            </div>
            <h1 className="font-display text-2xl font-bold text-navy mb-3">
              Your report is being generated
            </h1>
            <p className="font-body text-navy/60 mb-6">
              This can take up to 60 seconds. This page will refresh
              automatically.
            </p>
            <p className="font-mono-label text-xs text-navy/30 uppercase tracking-wider">
              Refreshing in 10 seconds...
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
