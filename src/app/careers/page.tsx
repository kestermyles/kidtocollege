import type { Metadata } from "next";
import CareersClient from "./CareersClient";
import { breadcrumbsLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Career Explorer — Salaries, Outlook & Related College Majors",
  description:
    "Explore 30+ careers with real BLS median salaries, 10-year job-growth outlook, and the college majors that lead to each. Free, personalized to your plan.",
  alternates: { canonical: "https://www.kidtocollege.com/careers" },
};

const breadcrumbs = breadcrumbsLd([
  { label: "Home", path: "/" },
  { label: "Careers" },
]);

interface PageProps {
  searchParams: Promise<{ major?: string }>;
}

export default async function CareersPage({ searchParams }: PageProps) {
  const { major } = await searchParams;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <CareersClient initialMajor={major ?? ""} />
    </>
  );
}
