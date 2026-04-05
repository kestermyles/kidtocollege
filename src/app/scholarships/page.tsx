import type { Metadata } from "next";
import { ScholarshipsClient } from "./ScholarshipsClient";

export const metadata: Metadata = {
  title: "Free Scholarship Search 2025–26: Find Money for College | KidToCollege",
  description:
    "Search thousands of scholarships by major, state, GPA, and background. Find free money for college you don't have to pay back — updated for 2025–26.",
  openGraph: {
    title: "Free Scholarship Search 2025–26: Find Money for College | KidToCollege",
    description:
      "Search thousands of scholarships by major, state, GPA, and background. Find free money for college you don't have to pay back.",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I find scholarships I qualify for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use our free scholarship search — filter by your major, GPA, state, and background to see scholarships you're eligible for right now.",
      },
    },
    {
      "@type": "Question",
      name: "Are these scholarships legitimate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — we only list verified scholarships from accredited foundations, universities, and government programs. We never list scholarships that require a fee to apply.",
      },
    },
    {
      "@type": "Question",
      name: "When should I start applying for scholarships?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start in 9th or 10th grade. Many scholarships are open to underclassmen, and early applications mean less competition.",
      },
    },
  ],
};

export default function ScholarshipsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <ScholarshipsClient />
    </>
  );
}
