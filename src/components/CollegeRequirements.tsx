"use client"

import { useState, useEffect } from "react"

interface Requirements {
  deadline_regular: string
  deadline_early: string | null
  accepts_common_app: boolean
  essays_required: number
  essay_notes: string
  test_policy: string
  letters_of_rec: number
  application_fee: number | null
  has_interview: boolean
  extra_requirements: string | null
}

export function CollegeRequirements({ slug }: { slug: string }) {
  const [data, setData] = useState<Requirements | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/college-requirements/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setData(d)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
            Application requirements
          </h2>
          <div className="ktc-card p-8 text-center">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-gold rounded-full animate-spin mx-auto mb-3" />
            <p className="font-body text-sm text-navy/40">Loading requirements...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!data) return null

  const items = [
    { label: "Regular Deadline", value: data.deadline_regular },
    data.deadline_early ? { label: "Early Deadline", value: data.deadline_early } : null,
    { label: "Common App", value: data.accepts_common_app ? "Yes" : "No" },
    { label: "Test Policy", value: data.test_policy },
    { label: "Essays Required", value: String(data.essays_required) },
    { label: "Letters of Rec", value: String(data.letters_of_rec) },
    data.application_fee ? { label: "Application Fee", value: `$${data.application_fee}` } : null,
    { label: "Interview", value: data.has_interview ? "Available" : "Not required" },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <section className="py-12 sm:py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
          Application requirements
        </h2>
        <div className="ktc-card p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {items.map((item) => (
              <div key={item.label} className="text-center p-3 bg-cream rounded-lg">
                <p className="font-mono-label text-xs text-navy/50 uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="font-body font-semibold text-navy">{item.value}</p>
              </div>
            ))}
          </div>
          {data.essay_notes && (
            <p className="font-body text-sm text-navy/70 mb-3">
              <span className="font-medium text-navy">Essays:</span> {data.essay_notes}
            </p>
          )}
          {data.extra_requirements && (
            <p className="font-body text-sm text-navy/70">
              <span className="font-medium text-navy">Note:</span> {data.extra_requirements}
            </p>
          )}
        </div>
        <p className="text-xs font-body text-navy/40 mt-3">
          Requirements are AI-generated from public data and may change. Always verify directly with the college.
        </p>
      </div>
    </section>
  )
}
