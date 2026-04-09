/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
  "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
  "VT","VA","WA","WV","WI","WY",
]

const OUTCOME_OPTIONS = [
  { value: "", label: "Not yet applied" },
  { value: "applied", label: "Applied" },
  { value: "accepted", label: "Accepted" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "deferred", label: "Deferred" },
  { value: "rejected", label: "Rejected" },
  { value: "enrolled", label: "Enrolled" },
]

const YEARS = Array.from({ length: 11 }, (_, i) => 2020 + i)

interface CollegeListItem {
  college_slug: string
  colleges: { name: string; slug: string } | null
}

export default function StudentProfileCard() {
  const [city, setCity] = useState("")
  const [stateAbbr, setStateAbbr] = useState("")
  const [highSchool, setHighSchool] = useState("")
  const [gradYear, setGradYear] = useState("")
  const [firstChoice, setFirstChoice] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [collegeItems, setCollegeItems] = useState<CollegeListItem[]>([])
  const [outcomes, setOutcomes] = useState<Record<string, string>>({})

  // Load profile
  useEffect(() => {
    fetch("/api/account/profile")
      .then(r => r.json())
      .then(d => {
        if (d.profile) {
          setCity(d.profile.city || "")
          setStateAbbr(d.profile.state_abbr || "")
          setHighSchool(d.profile.high_school || "")
          setGradYear(d.profile.grad_year?.toString() || "")
          setFirstChoice(d.profile.first_choice_college || "")
        }
      })
      .catch(() => {})
  }, [])

  // Load college list items
  useEffect(() => {
    fetch("/api/list")
      .then(r => r.json())
      .then(d => {
        if (d.items) {
          setCollegeItems(d.items)
        }
      })
      .catch(() => {})
  }, [])

  // Load existing outcomes
  useEffect(() => {
    fetch("/api/account/outcomes")
      .then(r => r.json())
      .then(d => {
        if (d.outcomes) {
          const map: Record<string, string> = {}
          for (const o of d.outcomes) {
            map[o.college_slug] = o.outcome
          }
          setOutcomes(map)
        }
      })
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city,
        state_abbr: stateAbbr,
        high_school: highSchool,
        grad_year: gradYear ? parseInt(gradYear) : null,
        first_choice_college: firstChoice,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleOutcomeChange = async (slug: string, name: string, outcome: string) => {
    setOutcomes(prev => ({ ...prev, [slug]: outcome }))
    if (!outcome) return
    await fetch("/api/account/outcomes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        college_slug: slug,
        college_name: name,
        outcome,
      }),
    })
  }

  return (
    <div className="ktc-card p-6">
      <h2 className="font-display text-xl font-bold text-navy mb-1">
        Help students from your school
      </h2>
      <p className="font-body text-sm text-navy/50 mb-6">
        Your anonymous outcomes help future students understand what&apos;s possible from your high school.
      </p>

      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-xs text-navy/60 mb-1">
              City <span className="text-navy/30">(optional)</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="e.g. Austin"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-navy focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block font-body text-xs text-navy/60 mb-1">
              State <span className="text-navy/30">(optional)</span>
            </label>
            <select
              value={stateAbbr}
              onChange={e => setStateAbbr(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-navy focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="">Select state</option>
              {US_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-body text-xs text-navy/60 mb-1">
            High school <span className="text-navy/30">(optional)</span>
          </label>
          <input
            type="text"
            value={highSchool}
            onChange={e => setHighSchool(e.target.value)}
            placeholder="e.g. Stephen F. Austin High School, Austin, TX"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-navy focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-xs text-navy/60 mb-1">
              Graduation year <span className="text-navy/30">(optional)</span>
            </label>
            <select
              value={gradYear}
              onChange={e => setGradYear(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-navy focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="">Select year</option>
              {YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-body text-xs text-navy/60 mb-1">
              First choice college <span className="text-navy/30">(optional)</span>
            </label>
            <input
              type="text"
              value={firstChoice}
              onChange={e => setFirstChoice(e.target.value)}
              placeholder="e.g. University of Texas at Austin"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-navy focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      </div>

      {/* College outcomes */}
      {collegeItems.length > 0 && (
        <div className="mb-6">
          <h3 className="font-display text-base font-bold text-navy mb-3">
            Where did you apply?
          </h3>
          <div className="space-y-2">
            {collegeItems.map((item: any) => {
              const name = item.colleges?.name || item.college_slug
              const slug = item.college_slug
              return (
                <div key={slug} className="flex items-center justify-between gap-3 p-3 rounded-md bg-cream/50">
                  <span className="font-body text-sm font-medium text-navy truncate">
                    {name}
                  </span>
                  <select
                    value={outcomes[slug] || ""}
                    onChange={e => handleOutcomeChange(slug, name, e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-body text-navy focus:outline-none focus:ring-2 focus:ring-gold flex-shrink-0"
                  >
                    {OUTCOME_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gold hover:bg-gold/90 disabled:bg-gray-200 text-navy font-body font-medium px-6 py-2.5 rounded-md transition-colors text-sm"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save"}
        </button>
        {saved && (
          <span className="font-body text-sm text-sage">Profile updated</span>
        )}
      </div>

      <p className="font-body text-xs text-navy/30 mt-4">
        Your school and outcomes are never shown publicly with your name. Aggregated anonymously only.
      </p>
    </div>
  )
}
