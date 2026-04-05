import { Metadata } from "next"
import MyChancesClient from "./MyChancesClient"

export const metadata: Metadata = {
  title: "College Admission Chances Calculator — Will You Get In?",
  description: "Enter your GPA, SAT/ACT scores, and activities. Our free AI predictor shows your real admission chances at any US college — no sign-up required.",
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How accurate is the admission chances calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our predictor is based on reported admission data for each college. It gives a realistic probability range — not a guarantee — based on GPA, test scores, and selectivity.",
      },
    },
    {
      "@type": "Question",
      name: "What GPA do I need to get into college?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on the college. Most 4-year colleges accept students with a 2.5+ GPA. Highly selective schools typically expect 3.8+ unweighted.",
      },
    },
  ],
}

export default function MyChancesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <MyChancesClient />
    </>
  )
}
