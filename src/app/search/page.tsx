import { Metadata } from "next";
import { Wizard } from "@/components/Wizard";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Find Your College — KidToCollege",
  description:
    "Answer a few quick questions and get a personalized college report with scholarships, admissions tips, and a step-by-step playbook.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const college = typeof params.college === "string" ? params.college : "";
  const major = typeof params.major === "string" ? params.major : "";
  const mode: "college" | "league" =
    params.mode === "league" ? "league" : college ? "college" : "league";

  return (
    <>
      <PageHeader
        title="Find the right college. Fund it fully."
        subtitle="Tell us about yourself — we'll find your best colleges, scholarships, and admissions playbook."
      />

      {/* Wizard card overlapping into white area */}
      <section className="bg-white pb-20">
        <div className="max-w-3xl mx-auto px-4 mt-8">
          <Wizard
            initialCollege={college}
            initialMajor={major}
            initialMode={mode}
          />
        </div>
      </section>
    </>
  );
}
