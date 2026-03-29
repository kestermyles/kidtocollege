import { Metadata } from "next";
import { notFound } from "next/navigation";
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
    notFound();
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

  if (!result) {
    notFound();
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
