/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-browser"

const TYPE_ICONS: Record<string, string> = {
  programme: "📈",
  geographic: "📍",
  demographic: "👥",
  growth: "🚀",
  aid: "💰",
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
                Your In
              </span>
            </div>
            <p className="font-body text-sm text-navy/50 mb-3">
              Sign in to see your personalised angles for this school.
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
              Your In
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
                    <span className="text-lg flex-shrink-0 mt-0.5">
                      {TYPE_ICONS[angle.type] || "📌"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-body font-medium text-sm text-navy">
                          {angle.title}
                        </span>
                        <span className="flex items-center gap-1">
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
                Based on published CDS data and AI research. Refreshes monthly.
              </p>
            </>
          )}

          {!loading && notFound && !headline && (
            <button
              onClick={handleGenerate}
              className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-5 py-2 rounded-md transition-colors text-sm"
            >
              See your angles &rarr;
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
