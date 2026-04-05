import type { Metadata } from "next";
import { ScholarshipsClient } from "./ScholarshipsClient";

export const metadata: Metadata = {
  title: "Free Scholarship Search 2025–26: Find Money for College | KidToCollege",
  description:
    "Search thousands of scholarships by major, state, GPA, and background. Find free money for college you don't have to pay back — updated for 2025–26.",
  openGraph: {
    title: "Scholarship Database — KidToCollege",
    description:
      "Find scholarships your family is missing. Federal, national, state, local, and hidden auto-merit awards.",
  },
};

export default function ScholarshipsPage() {
  return <ScholarshipsClient />;
}
