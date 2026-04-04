"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-browser"

interface College {
  name: string
  slug: string
  likelihood: "Safety" | "Likely" | "Match" | "Reach"
  percentage: number
}

const TARGETS = { Safety: 4, Match: 4, Reach: 4 }

const CONFIG = {
  Safety: {
    label: "Safety",
    description: "Colleges where you have a strong chance of admission (75%+)",
    color: "green",
    border: "border-green-200",
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-800",
    bar: "bg-green-500",
  },
  Match: {
    label: "On Target",
    description: "Colleges where you have a solid chance (40\u201375%)",
    color: "blue",
    border: "border-blue-200",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-800",
    bar: "bg-blue-500",
  },
  Reach: {
    label: "Reach",
    description: "Ambitious colleges worth applying to \u2014 tips included on how to get there",
    color: "orange",
    border: "border-orange-200",
    bg: "bg-orange-50",
    badge: "bg-orange-100 text-orange-800",
    bar: "bg-orange-500",
  },
}

export default function CollegeListBuilder() {
  const [savedColleges, setSavedColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [hasChances, setHasChances] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from("saved_colleges")
        .select("college_name, college_slug, likelihood, admission_percentage")
        .eq("user_id", user.id)
        .not("likelihood", "is", null)

      if (data && data.length > 0) {
        setHasChances(true)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSavedColleges(data.map((r: any) => ({
          name: r.college_name,
          slug: r.college_slug,
          likelihood: r.likelihood,
          percentage: r.admission_percentage ?? 0,
        })))
      }
      setLoading(false)
    }
    load()
  }, [])

  const byCategory = (cat: "Safety" | "Match" | "Reach") => {
    if (cat === "Match") return savedColleges.filter(c => c.likelihood === "Match" || c.likelihood === "Likely")
    return savedColleges.filter(c => c.likelihood === cat)
  }

  const count = (cat: "Safety" | "Match" | "Reach") => byCategory(cat).length

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading your college list&hellip;</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Build Your College List</h1>
          <p className="text-lg text-gray-600">
            The smartest strategy is 4 Safety schools, 4 On Target schools, and 4 Reach schools.
            Every top counsellor gives the same advice &mdash; and it&apos;s free here.
          </p>
        </div>

        {/* Progress summary */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {(["Safety", "Match", "Reach"] as const).map((cat) => {
            const cfg = CONFIG[cat]
            const c = count(cat)
            const t = TARGETS[cat]
            const done = c >= t
            return (
              <div key={cat} className={`rounded-xl border-2 p-4 text-center ${done ? cfg.border + " " + cfg.bg : "border-gray-200 bg-white"}`}>
                <div className={`text-2xl font-bold mb-1 ${done ? "text-gray-900" : "text-gray-400"}`}>
                  {c}/{t}
                </div>
                <div className={`text-sm font-semibold ${done ? "text-gray-700" : "text-gray-500"}`}>
                  {cfg.label}
                </div>
                {done && <div className="text-xs text-green-600 font-medium mt-1">&check; Complete</div>}
              </div>
            )
          })}
        </div>

        {!hasChances && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <p className="text-amber-800 font-medium mb-2">Run My Chances first</p>
            <p className="text-sm text-amber-700 mb-4">
              To categorise your colleges into Safety / On Target / Reach, we need your academic profile.
              It only takes 30 seconds.
            </p>
            <a href="/my-chances" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
              Check my chances &rarr;
            </a>
          </div>
        )}

        {/* College buckets */}
        {(["Safety", "Match", "Reach"] as const).map((cat) => {
          const cfg = CONFIG[cat]
          const colleges = byCategory(cat)
          const t = TARGETS[cat]
          const slots = Array.from({ length: t })

          return (
            <div key={cat} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{cfg.label} Schools</h2>
                  <p className="text-sm text-gray-500">{cfg.description}</p>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${cfg.badge}`}>
                  {count(cat)}/{t}
                </span>
              </div>

              <div className="space-y-3">
                {slots.map((_, i) => {
                  const college = colleges[i]
                  if (college) {
                    return (
                      <div key={college.slug} className={`bg-white rounded-xl border ${cfg.border} p-4 flex items-center justify-between`}>
                        <div>
                          <a href={`/college/${college.slug}`} className="font-semibold text-gray-900 hover:text-blue-600">
                            {college.name}
                          </a>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-24 bg-gray-100 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${cfg.bar}`} style={{ width: `${college.percentage}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{college.percentage}% admission chance</span>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>
                    )
                  }
                  return (
                    <div key={i} className="bg-white rounded-xl border border-dashed border-gray-300 p-4 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <span className="text-gray-300 text-xs">+</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {hasChances ? `Add a ${cfg.label.toLowerCase()} school` : "Run My Chances to fill this slot"}
                      </span>
                      {hasChances && (
                        <a href="/colleges" className="ml-auto text-xs text-blue-500 hover:underline">Browse colleges &rarr;</a>
                      )}
                    </div>
                  )
                })}

                {colleges.length > t && (
                  <p className="text-xs text-gray-400 pl-1">
                    +{colleges.length - t} more {cfg.label.toLowerCase()} schools saved &mdash; consider trimming to keep your list focused.
                  </p>
                )}
              </div>
            </div>
          )
        })}

        <div className="bg-navy rounded-2xl p-6 text-center mt-8">
          <p className="text-white font-semibold mb-1">Want help building this list?</p>
          <p className="text-white/70 text-sm mb-4">Run My Chances to get your personalised Safety / On Target / Reach breakdown.</p>
          <div className="flex gap-3 justify-center">
            <a href="/my-chances" className="bg-gold text-navy font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-gold/90 transition-colors">
              Check my chances
            </a>
            <a href="/colleges" className="bg-white/10 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/20 transition-colors">
              Browse colleges
            </a>
          </div>
        </div>

      </div>
    </main>
  )
}
