/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-browser"

const iconClass = "w-5 h-5 text-gold flex-shrink-0 mt-0.5"

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case "programme":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      )
    case "geographic":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      )
    case "demographic":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      )
    case "growth":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case "aid":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
        </svg>
      )
    default:
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      )
  }
}

const CONFIDENCE_STYLES: Record<string, { dot: string; label?: string }> = {
  high: { dot: "bg-green-400" },
  medium: { dot: "bg-yellow-400" },
  low: { dot: "bg-gray-300", label: "est." },
}

interface Angle {
  type: string
  title: string
  detail: string
  confidence: string
}

export function CollegeYourIn({
  collegeSlug,
  collegeName,
}: {
  collegeSlug: string
  collegeName: string
}) {
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [headline, setHeadline] = useState<string | null>(null)
  const [angles, setAngles] = useState<Angle[]>([])
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Auth check
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setAuthChecked(true)
    })
  }, [])

  // Load cached data
  useEffect(() => {
    if (!authChecked || !userId) return
    fetch(`/api/colleges/your-in?college_slug=${collegeSlug}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true)
          return null
        }
        return r.json()
      })
      .then((d) => {
        if (d && d.headline) {
          setHeadline(d.headline)
          setAngles(d.angles || [])
        }
      })
      .catch(() => setNotFound(true))
  }, [authChecked, userId, collegeSlug])

  const handleGenerate = async () => {
    setLoading(true)
    setNotFound(false)

    // Try to get user profile for personalization
    let userState = ""
    const userMajor = ""
    let userGpa = ""
    try {
      const profileRes = await fetch("/api/account/profile")
      const profileData = await profileRes.json()
      if (profileData.profile) {
        userState = profileData.profile.state_abbr || ""
        userGpa = profileData.profile.gpa?.toString() || ""
      }
    } catch {}

    try {
      const res = await fetch("/api/colleges/your-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college_slug: collegeSlug,
          college_name: collegeName,
          user_state: userState,
          user_major: userMajor,
          user_gpa: userGpa,
        }),
      })
      const data = await res.json()
      if (data.headline) {
        setHeadline(data.headline)
        setAngles(data.angles || [])
      }
    } catch {}
    setLoading(false)
  }

  if (!authChecked) return null

  // Logged out prompt
  if (!userId) {
    return (
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="ktc-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold">✦</span>
              <span className="font-display text-base font-semibold text-navy">
                Your edge
              </span>
            </div>
            <p className="font-body text-sm text-navy/50 mb-3">
              Sign in to see your personalized angles for this school.
            </p>
            <Link
              href="/account"
              className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-5 py-2 rounded-md transition-colors text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ktc-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-gold ${loading ? "animate-pulse" : ""}`}>
              ✦
            </span>
            <span className="font-display text-base font-semibold text-navy">
              Your edge
            </span>
          </div>

          {loading && (
            <div className="space-y-2">
              <p className="font-body text-sm text-navy/50 animate-pulse">
                Sam is researching this school...
              </p>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
            </div>
          )}

          {!loading && headline && (
            <>
              <p className="font-body font-semibold text-navy mb-3">
                {headline}
              </p>
              <div className="space-y-3">
                {angles.map((angle, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-md bg-cream/50"
                  >
                    <TypeIcon type={angle.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <span className="font-body font-medium text-sm text-navy">
                          {angle.title}
                        </span>
                        <span className="flex items-center gap-1 mt-0.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              CONFIDENCE_STYLES[angle.confidence]?.dot || "bg-gray-300"
                            }`}
                          />
                          {CONFIDENCE_STYLES[angle.confidence]?.label && (
                            <span className="text-xs text-navy/40 font-body">
                              {CONFIDENCE_STYLES[angle.confidence].label}
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="font-body text-sm text-navy/70 mt-0.5">
                        {angle.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-navy/40 font-body mt-4">
                Based on publicly available Common Data Set data.
              </p>
            </>
          )}

          {!loading && notFound && !headline && (
            <button
              onClick={handleGenerate}
              className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-5 py-2 rounded-md transition-colors text-sm"
            >
              Find my angles for this school &rarr;
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
