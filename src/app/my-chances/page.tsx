import { Metadata } from "next"
import MyChancesClient from "./MyChancesClient"
import { breadcrumbsLd } from "@/lib/structured-data"

export const metadata: Metadata = {
  title: "College Admission Chances Calculator — Will You Get In?",
  description: "Enter your GPA, SAT/ACT scores, and intended major. Our free predictor shows your real admission chances at any US college — no sign-up required, no data sold.",
  alternates: { canonical: "https://www.kidtocollege.com/my-chances" },
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
    {
      "@type": "Question",
      name: "Do I need an SAT or ACT score to use this?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No — both are optional. GPA alone gives a usable estimate. Adding SAT or ACT improves accuracy, especially at test-required schools.",
      },
    },
  ],
}

const breadcrumbs = breadcrumbsLd([
  { label: "Home", path: "/" },
  { label: "My Chances" },
])

export default function MyChancesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <MyChancesClient />
    </>
  )
}
