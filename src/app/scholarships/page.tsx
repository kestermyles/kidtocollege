import type { Metadata } from "next";
import { ScholarshipsClient } from "./ScholarshipsClient";

export const metadata: Metadata = {
  title: "Scholarship Database — KidToCollege",
  description:
    "Browse 50+ scholarships: federal grants, national awards, state programs, activity-based, minority & first-gen, military, university merit, and local community scholarships.",
  openGraph: {
    title: "Scholarship Database — KidToCollege",
    description:
      "Find scholarships your family is missing. Federal, national, state, local, and hidden auto-merit awards.",
  },
};

export default function ScholarshipsPage() {
  return <ScholarshipsClient />;
}
