import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServiceRoleClient } from "@/lib/supabase-server"
import { FadeIn } from "@/components/FadeIn"
import Link from "next/link"
import CommunityQuestionClient from "@/components/community/CommunityQuestionClient"

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const svc = createServiceRoleClient()
  const { data } = await svc
    .from("community_questions")
    .select("title")
    .eq("slug", slug)
    .single()

  if (!data) return { title: "Question Not Found" }

  return {
    title: data.title,
    description: `Community answer to: ${data.title}`,
    alternates: { canonical: `https://www.kidtocollege.com/community/${slug}` },
  }
}

export default async function CommunityQuestionPage({ params }: Props) {
  const { slug } = await params
  const svc = createServiceRoleClient()

  const { data: question } = await svc
    .from("community_questions")
    .select("id, slug, title, body, user_id, created_at, view_count")
    .eq("slug", slug)
    .single()

  if (!question) notFound()

  // Increment view count fire-and-forget
  Promise.resolve(
    svc
      .from("community_questions")
      .update({ view_count: question.view_count + 1 })
      .eq("id", question.id)
  ).catch(() => {})

  // Fetch answers
  const { data: answers } = await svc
    .from("community_answers")
    .select("id, body, user_id, is_sam, upvotes, created_at")
    .eq("question_id", question.id)
    .order("created_at", { ascending: true })

  const samAnswer = answers?.find((a) => a.is_sam) ?? null
  const communityAnswers = answers?.filter((a) => !a.is_sam) ?? []

  // JSON-LD
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question.title,
      text: question.body || question.title,
      dateCreated: question.created_at,
      answerCount: (answers?.length ?? 0),
      ...(samAnswer
        ? {
            acceptedAnswer: {
              "@type": "Answer",
              text: samAnswer.body.replace(/[#*_`]/g, "").slice(0, 500),
              dateCreated: samAnswer.created_at,
            },
          }
        : {}),
    },
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4">
        <FadeIn>
          <nav className="font-mono-label text-xs uppercase tracking-wider text-navy/40 mb-6">
            <Link href="/" className="hover:text-navy/60 transition-colors">Home</Link>
            {" / "}
            <Link href="/community" className="hover:text-navy/60 transition-colors">Community</Link>
            {" / "}
            <span className="text-navy/60">Question</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy leading-tight mb-3">
            {question.title}
          </h1>
          {question.body && (
            <p className="font-body text-navy/70 mb-4 leading-relaxed">
              {question.body}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs font-body text-navy/40 mb-8">
            <span>{timeAgo(question.created_at)}</span>
            <span>{question.view_count + 1} views</span>
          </div>
        </FadeIn>

        <CommunityQuestionClient
          questionId={question.id}
          samAnswer={samAnswer}
          communityAnswers={communityAnswers}
        />

        <FadeIn>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="font-body text-navy/50 text-sm mb-4">
              Have your own question?
            </p>
            <Link
              href="/community/ask"
              className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-colors text-sm"
            >
              Ask your own question &rarr;
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}
