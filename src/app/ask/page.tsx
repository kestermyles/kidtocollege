import type { Metadata } from "next"
import { createServiceRoleClient } from "@/lib/supabase-server"
import { FadeIn } from "@/components/FadeIn"
import Link from "next/link"
import OpenSamButton from "@/components/OpenSamButton"

export const metadata: Metadata = {
  title: "College Admissions Questions Answered by Sam",
  description:
    "Browse answers to the most common college admissions questions — financial aid, applications, SAT/ACT, essays, and more. Free guidance from Sam, your AI college counselor.",
}

export const revalidate = 3600

interface SamAnswer {
  slug: string
  question: string
  topic: string | null
  asked_count: number
}

export default async function AskIndexPage() {
  const supabase = createServiceRoleClient()

  const { data: questions } = await supabase
    .from("sam_answers")
    .select("slug, question, topic, asked_count")
    .eq("published", true)
    .order("asked_count", { ascending: false })

  const grouped = new Map<string, SamAnswer[]>()
  for (const q of questions ?? []) {
    const topic = q.topic || "General"
    if (!grouped.has(topic)) grouped.set(topic, [])
    grouped.get(topic)!.push(q)
  }

  // Sort topics: put "General" last
  const topics = Array.from(grouped.keys()).sort((a, b) => {
    if (a === "General") return 1
    if (b === "General") return -1
    return a.localeCompare(b)
  })

  const totalQuestions = questions?.length ?? 0

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <FadeIn>
          <div className="mb-12 text-center">
            <span className="font-mono-label text-xs uppercase tracking-wider text-gold">
              Ask Sam
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-navy mt-3 mb-4">
              College admissions questions, answered
            </h1>
            <p className="font-body text-lg text-navy/60 max-w-2xl mx-auto">
              {totalQuestions} questions answered by Sam, your free AI college
              counselor. Can&apos;t find your question? Ask Sam directly.
            </p>
            <div className="mt-6">
              <OpenSamButton />
            </div>
          </div>
        </FadeIn>

        {topics.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-navy/40">
              No published questions yet. Ask Sam anything!
            </p>
            <div className="mt-4">
              <OpenSamButton />
            </div>
          </div>
        ) : (
          topics.map((topic) => (
            <FadeIn key={topic}>
              <section className="mb-10">
                <h2 className="font-display text-xl font-bold text-navy mb-4 flex items-center gap-2">
                  {topic}
                  <span className="font-mono-label text-xs text-navy/40 font-normal">
                    ({grouped.get(topic)!.length})
                  </span>
                </h2>
                <div className="space-y-2">
                  {grouped.get(topic)!.map((q) => (
                    <Link
                      key={q.slug}
                      href={`/ask/${q.slug}`}
                      className="block ktc-card p-5 group hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <h3 className="font-display text-base font-bold text-navy group-hover:text-gold transition-colors leading-snug">
                        {q.question}
                      </h3>
                      {q.asked_count > 1 && (
                        <p className="font-mono-label text-xs text-navy/30 mt-1">
                          Asked {q.asked_count} times
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            </FadeIn>
          ))
        )}
      </div>
    </div>
  )
}
