import type { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Career Explorer — Salaries, Outlook & Related Majors",
  description:
    "Explore 30+ careers with real BLS salary data, 10-year job outlook, and the college majors that lead to each. Free — personalized to your plan.",
};

interface PageProps {
  searchParams: Promise<{ major?: string }>;
}

export default async function CareersPage({ searchParams }: PageProps) {
  const { major } = await searchParams;
  return <CareersClient initialMajor={major ?? ""} />;
}
