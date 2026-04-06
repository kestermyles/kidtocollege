import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServiceRoleClient } from "@/lib/supabase-server"
import { FadeIn } from "@/components/FadeIn"
import Link from "next/link"
import AskSamMarkdown from "@/components/AskSamMarkdown"
import OpenSamButton from "@/components/OpenSamButton"

export const revalidate = 3600

interface AskPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: AskPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from("sam_answers")
    .select("question, answer")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!data) return { title: "Question Not Found" }

  const desc = data.answer.slice(0, 155).replace(/[#*_\n]/g, "") + "..."

  return {
    title: data.question,
    description: desc,
    alternates: {
      canonical: `https://www.kidtocollege.com/ask/${slug}`,
    },
    openGraph: {
      title: data.question,
      description: desc,
    },
  }
}

export default async function AskPage({ params }: AskPageProps) {
  const { slug } = await params
  const supabase = createServiceRoleClient()

  const { data } = await supabase
    .from("sam_answers")
    .select("question, answer, asked_count")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!data) notFound()

  // Increment asked_count fire-and-forget
  Promise.resolve(
    supabase
      .from("sam_answers")
      .update({ asked_count: data.asked_count + 1 })
      .eq("slug", slug)
  ).catch(() => {})

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: data.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: data.answer.replace(/[#*_`]/g, "").slice(0, 500),
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="max-w-3xl mx-auto px-4">
        <FadeIn>
          <nav className="font-mono-label text-xs uppercase tracking-wider text-navy/40 mb-6">
            <Link href="/" className="hover:text-navy/60 transition-colors">
              Home
            </Link>
            {" / "}
            <Link href="/ask" className="hover:text-navy/60 transition-colors">
              Ask Sam
            </Link>
            {" / "}
            <span className="text-navy/60">Answer</span>
          </nav>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy leading-tight mb-8">
            {data.question}
          </h1>

          <div className="prose prose-navy max-w-none font-body text-navy/80 leading-relaxed">
            <AskSamMarkdown content={data.answer} />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="font-body text-navy/50 text-sm mb-4">
              Have a different question about college admissions?
            </p>
            <div className="flex flex-wrap gap-3">
              <OpenSamButton />
              <Link
                href="/ask"
                className="px-6 py-3 border border-gray-200 text-navy font-body font-medium rounded-md hover:border-gold/40 transition-colors text-sm"
              >
                Browse all questions
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
