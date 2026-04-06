/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { createClient } from "@/lib/supabase-browser"
import { ChevronUp } from "lucide-react"

interface Answer {
  id: string
  body: string
  user_id: string | null
  is_sam: boolean
  upvotes: number
  created_at: string
}

export default function CommunityQuestionClient({
  questionId,
  samAnswer: initialSamAnswer,
  communityAnswers: initialCommunityAnswers,
}: {
  questionId: string
  samAnswer: Answer | null
  communityAnswers: Answer[]
}) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [samAnswer, setSamAnswer] = useState(initialSamAnswer)
  const [communityAnswers] = useState(initialCommunityAnswers)
  const [replyBody, setReplyBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set())

  // Auth check
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  // Load user's existing upvotes
  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    supabase
      .from("community_upvotes")
      .select("answer_id")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (data) setUpvoted(new Set(data.map((d: any) => d.answer_id)))
      })
  }, [userId])

  // Poll for Sam's answer if not present
  useEffect(() => {
    if (samAnswer) return
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      if (attempts > 15) {
        clearInterval(interval)
        return
      }
      try {
        const res = await fetch(`/api/community/sam-status?question_id=${questionId}`)
        const data = await res.json()
        if (data.answered && data.answer) {
          setSamAnswer({
            id: "sam-polled",
            body: data.answer.body,
            user_id: null,
            is_sam: true,
            upvotes: 0,
            created_at: data.answer.created_at,
          })
          clearInterval(interval)
        }
      } catch {}
    }, 2000)
    return () => clearInterval(interval)
  }, [samAnswer, questionId])

  const handleUpvote = useCallback(async (answerId: string) => {
    if (!userId) {
      router.push(`/account?next=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    const supabase = createClient()
    if (upvoted.has(answerId)) {
      await supabase.from("community_upvotes").delete().eq("user_id", userId).eq("answer_id", answerId)
      setUpvoted(prev => { const next = new Set(prev); next.delete(answerId); return next })
    } else {
      await supabase.from("community_upvotes").insert({ user_id: userId, answer_id: answerId })
      setUpvoted(prev => new Set(prev).add(answerId))
    }
    router.refresh()
  }, [userId, upvoted, router])

  const handleReply = async () => {
    if (!replyBody.trim() || submitting) return
    if (!userId) {
      router.push(`/account?next=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from("community_answers").insert({
      question_id: questionId,
      body: replyBody.trim(),
      user_id: userId,
    })
    setReplyBody("")
    setSubmitting(false)
    router.refresh()
  }

  const isLoggedIn = !!userId
  const showBlur = !isLoggedIn && communityAnswers.length > 2

  return (
    <div>
      {/* Sam's answer */}
      {samAnswer ? (
        <div className="mb-8 bg-white border-l-4 border-yellow-400 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-sm">
              S
            </div>
            <span className="font-display text-sm font-bold text-navy">
              <span className="text-gold">✦</span> Sam&apos;s Answer
            </span>
          </div>
          <div className="prose prose-sm max-w-none font-body text-navy/80">
            <ReactMarkdown>{samAnswer.body}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="mb-8 bg-white border-l-4 border-yellow-400/40 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold/30 flex items-center justify-center text-navy/40 font-bold text-sm animate-pulse">
              S
            </div>
            <span className="font-body text-sm text-navy/40 animate-pulse">
              Sam is writing an answer&hellip;
            </span>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-4/6" />
          </div>
        </div>
      )}

      {/* Community answers */}
      {communityAnswers.length > 0 && (
        <div className="mb-8">
          <h3 className="font-display text-lg font-bold text-navy mb-4">
            Community Answers ({communityAnswers.length})
          </h3>
          <div className="relative">
            <div className="space-y-3">
              {communityAnswers.map((a, i) => {
                const isBlurred = showBlur && i >= 2
                return (
                  <div
                    key={a.id}
                    className={`ktc-card p-5 ${isBlurred ? "blur-sm select-none" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleUpvote(a.id)}
                        className={`flex flex-col items-center gap-0.5 pt-0.5 ${
                          upvoted.has(a.id)
                            ? "text-gold"
                            : "text-navy/30 hover:text-gold"
                        } transition-colors`}
                      >
                        <ChevronUp size={16} />
                        <span className="text-xs font-mono-label font-bold">
                          {a.upvotes + (upvoted.has(a.id) ? 1 : 0)}
                        </span>
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-navy/80 whitespace-pre-wrap">
                          {a.body}
                        </p>
                        <p className="font-body text-xs text-navy/30 mt-2">
                          {timeAgo(a.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Blur overlay for logged-out users with 3+ answers */}
            {showBlur && (
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-6">
                <div className="text-center">
                  <p className="font-body text-sm text-navy/60 mb-3">
                    Sign in to read all replies and join the conversation
                  </p>
                  <Link
                    href={`/account?next=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/community")}`}
                    className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-colors text-sm"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reply box */}
      {isLoggedIn ? (
        <div className="ktc-card p-5">
          <h3 className="font-display text-sm font-bold text-navy mb-3">
            Add your answer
          </h3>
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Share your experience or advice..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm font-body text-navy focus:outline-none focus:ring-2 focus:ring-gold resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleReply}
              disabled={!replyBody.trim() || submitting}
              className="bg-gold hover:bg-gold/90 disabled:bg-gray-200 text-navy font-body font-medium px-5 py-2 rounded-md transition-colors text-sm"
            >
              {submitting ? "Posting..." : "Post Answer"}
            </button>
          </div>
        </div>
      ) : (
        <div className="ktc-card p-5 text-center">
          <p className="font-body text-navy/50 text-sm mb-3">
            Sign in to add your answer
          </p>
          <Link
            href="/account"
            className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-5 py-2 rounded-md transition-colors text-sm"
          >
            Sign In
          </Link>
        </div>
      )}
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
