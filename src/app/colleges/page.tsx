import { Metadata } from "next";
import CollegesClient from "./CollegesClient";

export const metadata: Metadata = {
  title: "Search 2,900+ Colleges: Costs, Acceptance Rates & More",
  description: "Compare acceptance rates, total cost of attendance, scholarships, and financial aid for 2,942 US colleges. Find the right school for your budget and goals.",
};

export default function CollegesPage() {
  return <CollegesClient />;
}
