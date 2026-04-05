"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-browser"

interface InsightsData {
  ai_acceptance_notes: string | null
  ai_cost_after_aid: string | null
  ai_scholarship_summary: string | null
  ai_gpa_notes: string | null
  ai_last_enriched: string | null
  ai_search_count: number | null
}

export function CollegeAIInsights({ slug }: { slug: string }) {
  const [data, setData] = useState<InsightsData | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("colleges")
      .select("ai_acceptance_notes, ai_cost_after_aid, ai_scholarship_summary, ai_gpa_notes, ai_last_enriched, ai_search_count")
      .eq("slug", slug)
      .single()
      .then(({ data: row }) => {
        if (row?.ai_last_enriched) setData(row as InsightsData)
      })
  }, [slug])

  if (!data) return null

  const daysAgo = Math.floor((Date.now() - new Date(data.ai_last_enriched!).getTime()) / (1000 * 60 * 60 * 24))

  const insights = [
    data.ai_acceptance_notes ? { label: "Admissions", text: data.ai_acceptance_notes } : null,
    data.ai_cost_after_aid ? { label: "Cost after aid", text: data.ai_cost_after_aid } : null,
    data.ai_scholarship_summary ? { label: "Scholarships", text: data.ai_scholarship_summary } : null,
  ].filter(Boolean) as { label: string; text: string }[]

  if (insights.length === 0) return null

  return (
    <section className="py-12 sm:py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy">
            AI-powered insights
          </h2>
          <span className="font-mono-label text-xs text-navy/40">
            Updated {daysAgo === 0 ? "today" : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((item) => (
            <div key={item.label} className="ktc-card p-5">
              <p className="font-mono-label text-xs text-gold uppercase tracking-wider mb-2">
                {item.label}
              </p>
              <p className="font-body text-sm text-navy/80 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
        {data.ai_search_count && data.ai_search_count > 1 && (
          <p className="text-xs font-body text-navy/30 mt-3">
            Researched {data.ai_search_count} times by students on KidToCollege
          </p>
        )}
      </div>
    </section>
  )
}
