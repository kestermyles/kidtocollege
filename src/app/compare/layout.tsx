import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Colleges — KidToCollege",
  description:
    "Compare up to 3 colleges side by side. Acceptance rates, costs, graduation rates, programs, and more.",
  openGraph: {
    title: "Compare Colleges — KidToCollege",
    description:
      "Side-by-side comparison of colleges. Costs, outcomes, and fit — all in one view.",
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
