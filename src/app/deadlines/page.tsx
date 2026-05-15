import { Metadata } from "next";
import DeadlinesClient from "./DeadlinesClient";
import { breadcrumbsLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "College Application Deadlines 2025–26: Top 50 Schools",
  description: "Never miss a deadline. Track Early Decision, Early Action, Regular Decision, and financial aid deadlines for the top 50 US colleges in one free tracker.",
  alternates: { canonical: "https://www.kidtocollege.com/deadlines" },
};

const breadcrumbs = breadcrumbsLd([
  { label: "Home", path: "/" },
  { label: "Deadlines" },
]);

export default function DeadlinesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <DeadlinesClient />
    </>
  );
}
