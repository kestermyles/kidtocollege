import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase-server";
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

  const supabase = createServiceRoleClient();

  // Fetch the result
  const { data: resultRow, error: resultErr } = await supabase
    .from("results")
    .select("*")
    .eq("id", resultId)
    .single();

  if (resultErr || !resultRow) {
    notFound();
  }

  const result: AIResearchResult = resultRow.result_data;
  const college: string = resultRow.college;
  const major: string = resultRow.major;
  const searchId: string = resultRow.search_id;

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
