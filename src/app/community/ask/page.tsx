"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { FadeIn } from "@/components/FadeIn"
import { PageHeader } from "@/components/PageHeader"

export default function CommunityAskPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [siteNavSuggestion, setSiteNavSuggestion] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/account?next=/community/ask")
      } else {
        setUserId(data.user.id)
      }
      setAuthLoading(false)
    })
  }, [router])

  const handleSubmit = async () => {
    if (!title.trim() || submitting || !userId) return
    setError(null)
    setSiteNavSuggestion(null)
    setSubmitting(true)

    try {
      // Step 1: Classify
      const classifyRes = await fetch("/api/community/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      })
      const classifyData = await classifyRes.json()

      if (classifyData.isSiteNavigation) {
        setSiteNavSuggestion(classifyData.suggestion || "It looks like you're asking about a site feature. Check the navigation menu or ask Sam directly.")
        setSubmitting(false)
        return
      }

      // Step 2: Post
      const res = await fetch("/api/community/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        setSubmitting(false)
        return
      }

      router.push(`/community/${data.slug}`)
    } catch {
      setError("Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (!userId) return null

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Ask a Question" />
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-20">
        <FadeIn>

          <div className="space-y-4">
            <div>
              <label className="block font-body text-sm font-medium text-navy mb-1">
                Your question
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 200))}
                placeholder="e.g. Is a 1200 SAT good enough for UC schools?"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-body text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <p className="text-xs font-body text-navy/40 mt-1 text-right">
                {title.length}/200
              </p>
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-navy mb-1">
                Add context <span className="text-navy/40">(optional)</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, 1000))}
                placeholder="Add context — your GPA, test scores, state, intended major — to get a more useful answer from Sam and the community"
                rows={5}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-body text-navy focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              />
              <p className="text-xs font-body text-navy/40 mt-1 text-right">
                {body.length}/1000
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-body">
                {error}
              </div>
            )}

            {siteNavSuggestion && (
              <div className="px-4 py-3 bg-gold/10 border border-gold/30 rounded-lg text-sm text-navy font-body">
                {siteNavSuggestion}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!title.trim() || submitting}
              className="w-full bg-gold hover:bg-gold/90 disabled:bg-gray-200 text-navy font-body font-medium py-3 rounded-md transition-colors text-sm"
            >
              {submitting ? "Posting..." : "Post Question"}
            </button>

            <p className="text-xs font-body text-navy/40 text-center">
              Sam will answer your question instantly. The community can also reply.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
