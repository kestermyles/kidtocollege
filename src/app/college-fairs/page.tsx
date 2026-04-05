import { Metadata } from "next";
import CollegeFairsClient from "./CollegeFairsClient";

export const metadata: Metadata = {
  title: "College Fairs 2026: NACAC Events Near You",
  description: "Find NACAC college fairs in 2026 near your city. Meet admissions officers, get application fee waivers, and discover colleges — all in one place.",
};

export default function CollegeFairsPage() {
  return <CollegeFairsClient />;
}
