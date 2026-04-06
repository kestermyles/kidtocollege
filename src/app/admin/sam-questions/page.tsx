import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { createServiceRoleClient } from "@/lib/supabase-server"

export const metadata = {
  title: "Sam Questions — Admin",
}

export const revalidate = 0

export default async function SamQuestionsAdmin() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== "kestermyles@gmail.com") redirect("/")

  const supa = createServiceRoleClient()

  const [{ count }, { data: recent }] = await Promise.all([
    supa.from("sam_questions").select("*", { count: "exact", head: true }),
    supa
      .from("sam_questions")
      .select("id, question, asked_at, page_context, user_id")
      .order("asked_at", { ascending: false })
      .limit(100),
  ])

  const topQuestions = getTopByExactMatch(recent ?? [])

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-navy mb-2">
          Sam Questions
        </h1>
        <p className="font-body text-navy/60 mb-8">
          {count ?? 0} total questions asked
        </p>

        {/* Top questions by frequency */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold text-navy mb-4">
            Top 20 most-asked questions
          </h2>
          {topQuestions.length === 0 ? (
            <p className="text-navy/40 font-body text-sm">No data yet</p>
          ) : (
            <div className="ktc-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-cream/50">
                    <th className="px-4 py-3 text-left font-mono-label text-xs text-navy/60 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left font-mono-label text-xs text-navy/60 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-4 py-3 text-right font-mono-label text-xs text-navy/60 uppercase tracking-wider">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topQuestions.map(
                    (q: { question: string; ask_count: number }, i: number) => (
                      <tr
                        key={i}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-4 py-3 font-mono-label text-sm text-navy/40">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-navy">
                          {q.question}
                        </td>
                        <td className="px-4 py-3 font-mono-label text-sm text-gold text-right font-bold">
                          {q.ask_count}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent questions */}
        <section>
          <h2 className="font-display text-xl font-bold text-navy mb-4">
            Recent questions
          </h2>
          {(!recent || recent.length === 0) ? (
            <p className="text-navy/40 font-body text-sm">No questions yet</p>
          ) : (
            <div className="space-y-2">
              {recent.map((q) => (
                <div key={q.id} className="ktc-card p-4">
                  <p className="font-body text-sm text-navy">{q.question}</p>
                  <div className="flex gap-4 mt-2 text-xs text-navy/40 font-body">
                    <span>
                      {new Date(q.asked_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                    {q.page_context && <span>on {q.page_context}</span>}
                    {q.user_id && (
                      <span className="text-gold">signed in</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function getTopByExactMatch(
  questions: { question: string }[]
): { question: string; ask_count: number }[] {
  const counts = new Map<string, number>()
  for (const q of questions) {
    const normalized = q.question.toLowerCase().trim()
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([question, ask_count]) => ({ question, ask_count }))
    .sort((a, b) => b.ask_count - a.ask_count)
    .slice(0, 20)
}
