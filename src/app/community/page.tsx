import type { Metadata } from "next"
import Link from "next/link"
import { createServiceRoleClient } from "@/lib/supabase-server"
import { FadeIn } from "@/components/FadeIn"
import { PageHeader } from "@/components/PageHeader"

export const metadata: Metadata = {
  title: "Community Q&A — College Admissions Help",
  description:
    "Ask questions about college admissions and get answers from Sam, our AI counselor, and the KidToCollege community.",
}

export const revalidate = 60

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

export default async function CommunityPage() {
  const svc = createServiceRoleClient()

  const { data: questions } = await svc
    .from("community_questions")
    .select(`
      id, slug, title, user_id, created_at, view_count,
      community_answers (id, is_sam)
    `)
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Community Q&A" subtitle="Real questions from real families — answered by Sam." />
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-20">
        <div className="flex justify-end mb-6">
          <Link
            href="/community/ask"
            className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-colors text-sm"
          >
            Ask a Question
          </Link>
        </div>

        {!questions || questions.length === 0 ? (
          <FadeIn>
            <div className="text-center py-20">
              <p className="font-display text-xl font-bold text-navy mb-2">
                No questions yet — be the first.
              </p>
              <p className="font-body text-navy/50 mb-6">
                Ask anything about college admissions. Sam answers every
                question instantly.
              </p>
              <Link
                href="/community/ask"
                className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
              >
                Ask a Question &rarr;
              </Link>
            </div>
          </FadeIn>
        ) : (
          <div className="space-y-2">
            {questions.map((q) => {
              const answers = (q.community_answers as { id: string; is_sam: boolean }[]) || []
              const hasSam = answers.some((a) => a.is_sam)
              return (
                <FadeIn key={q.id}>
                  <Link
                    href={`/community/${q.slug}`}
                    className="block ktc-card py-5 pl-4 pr-5 border-l-2 border-transparent hover:border-yellow-400 group hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h2 className="font-display text-lg font-semibold text-navy group-hover:text-gold transition-colors leading-snug">
                          {q.title}
                        </h2>
                        <div className="flex items-center gap-3 mt-2 text-xs font-body text-navy/40">
                          <span>{timeAgo(q.created_at)}</span>
                          <span>{answers.length} {answers.length === 1 ? "answer" : "answers"}</span>
                          <span>{q.view_count} views</span>
                        </div>
                      </div>
                      {hasSam && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 bg-gold/10 text-gold text-xs font-medium px-2.5 py-1 rounded-full">
                          <span className="text-gold">✦</span> Sam answered
                        </span>
                      )}
                    </div>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
