import { Metadata } from "next";
import DiscoverClient from "./DiscoverClient";

export const metadata: Metadata = {
  title: "Find Your College Match: Free Major & Interest Quiz | KidToCollege",
  description: "Not sure what to study or where to apply? Take our free quiz to discover colleges that match your interests, goals, and learning style in minutes.",
};

export default function DiscoverPage() {
  return <DiscoverClient />;
}
