import { Metadata } from "next";
import { ResultsLoader } from "./ResultsLoader";

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
  const resultId = typeof params.id === "string" ? params.id : undefined;
  const searchId = typeof params.searchId === "string" ? params.searchId : undefined;

  return <ResultsLoader resultId={resultId} searchId={searchId} />;
}
