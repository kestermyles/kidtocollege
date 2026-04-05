import { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";

export const metadata: Metadata = {
  title: "College Net Price Calculator: What Will You Actually Pay?",
  description: "Calculate your real cost of college after grants and financial aid. Our free net price estimator uses your family income to show what you'll actually pay — not just sticker price.",
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is net price?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Net price is what your family actually pays after grants and scholarships are subtracted from total cost of attendance. It's often thousands less than the sticker price.",
      },
    },
    {
      "@type": "Question",
      name: "Does family income affect financial aid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Most need-based aid is determined by your Expected Family Contribution (EFC) or Student Aid Index (SAI), calculated from your FAFSA.",
      },
    },
  ],
};

export default function CalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <CalculatorClient />
    </>
  );
}
