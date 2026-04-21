import { Metadata } from "next";
import MatchesClient from "./MatchesClient";

export const metadata: Metadata = {
  title: "Your College Matches — Personalised Fit Scores",
  description:
    "Colleges ranked by your financial fit, academic chances, program match, and culture — not generic rankings. Safety, target, and reach schools built around your profile.",
};

export default function MatchesPage() {
  return <MatchesClient />;
}
