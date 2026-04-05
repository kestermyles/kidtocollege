import { Metadata } from "next";
import EssaysClient from "./EssaysClient";

export const metadata: Metadata = {
  title: "College Essay Help: Common App, Coalition & Supplementals",
  description: "Get free college essay prompts, examples, and AI feedback for Common App, Coalition App, QuestBridge, and supplemental essays. Write essays that get you in.",
};

export default function EssaysPage() {
  return <EssaysClient />;
}
