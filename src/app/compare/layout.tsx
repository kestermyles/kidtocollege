import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Colleges Side by Side: Costs, Acceptance Rates & Aid",
  description:
    "Compare any two colleges side by side — tuition, total cost of attendance, acceptance rate, financial aid, and student outcomes. Make a smarter college choice.",
  openGraph: {
    title: "Compare Colleges Side by Side",
    description:
      "Compare any two colleges side by side — tuition, total cost of attendance, acceptance rate, financial aid, and student outcomes.",
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
