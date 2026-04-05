import { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";

export const metadata: Metadata = {
  title: "College Net Price Calculator: What Will You Actually Pay? | KidToCollege",
  description: "Calculate your real cost of college after grants and financial aid. Our free net price estimator uses your family income to show what you'll actually pay — not just sticker price.",
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
