import { Metadata } from "next";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
  title: "College Application Roadmap: Step-by-Step Guide | KidToCollege",
  description: "Follow our free 6-step college application roadmap — from building your list to signing your acceptance letter. Know exactly what to do and when.",
};

export default function RoadmapPage() {
  return <RoadmapClient />;
}
