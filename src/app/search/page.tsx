import { Metadata } from "next";
import { Wizard } from "@/components/Wizard";

export const metadata: Metadata = {
  title: "Find Your College — KidToCollege",
  description:
    "Answer a few quick questions and get a personalised college report with scholarships, admissions tips, and a step-by-step playbook.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const college = typeof params.college === "string" ? params.college : "";
  const major = typeof params.major === "string" ? params.major : "";
  const mode =
    params.mode === "league" ? "league" : ("college" as "college" | "league");

  return (
    <>
      {/* Dark navy header band */}
      <section className="bg-navy py-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Find the right college. Fund it fully.
          </h1>
          <p className="font-body text-white/60 text-lg max-w-xl mx-auto">
            Tell us about your student — we&apos;ll find the best colleges for
            their profile, surface every scholarship, and build a step-by-step
            admissions playbook.
          </p>
        </div>
      </section>

      {/* Wizard card overlapping into white area */}
      <section className="bg-white pb-20">
        <div className="max-w-3xl mx-auto px-4 -mt-10">
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
