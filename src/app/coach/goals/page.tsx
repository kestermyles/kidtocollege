/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { COLLEGES_SEED } from "@/lib/colleges-seed"
import { X } from "lucide-react"

const YEARS = [2025, 2026, 2027, 2028, 2029]
const STRATEGIES = [
  { value: "EA", label: "Early Action" },
  { value: "ED", label: "Early Decision" },
  { value: "RD", label: "Regular Decision" },
  { value: "rolling", label: "Rolling" },
]

const DEFAULT_DEADLINES: Record<string, Record<string, string>> = {
  EA: { default: "2025-11-01" },
  ED: { default: "2025-11-01" },
  RD: { default: "2026-01-01" },
  rolling: { default: "2026-03-01" },
}

interface TargetCollege {
  name: string
  slug: string
  strategy: string
  deadline: string
}

export default function GoalsSetupPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Step 1
  const [gradYear, setGradYear] = useState(2026)
  const [gpa, setGpa] = useState("")
  const [satScore, setSatScore] = useState("")
  const [actScore, setActScore] = useState("")
  const [major, setMajor] = useState("")

  // Step 2
  const [colleges, setColleges] = useState<TargetCollege[]>([])
  const [query, setQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const matches = query.length >= 2
    ? COLLEGES_SEED.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) &&
        !colleges.some(tc => tc.slug === c.slug)
      ).slice(0, 6)
    : []

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/account"); return }
      setUserId(data.user.id)
      // Load existing goals
      fetch("/api/coach/goals").then(r => r.json()).then(d => {
        if (d.goals) {
          setGradYear(d.goals.graduation_year || 2026)
          setGpa(d.goals.current_gpa?.toString() || "")
          setSatScore(d.goals.sat_score?.toString() || "")
          setActScore(d.goals.act_score?.toString() || "")
          setMajor(d.goals.intended_major || "")
          setColleges(d.goals.target_colleges || [])
        }
      }).catch(() => {})
      setLoading(false)
    })
  }, [router])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const addCollege = (name: string, slug: string) => {
    if (colleges.length >= 8) return
    setColleges(prev => [...prev, {
      name, slug, strategy: "RD",
      deadline: DEFAULT_DEADLINES.RD.default,
    }])
    setQuery("")
    setShowDropdown(false)
  }

  const removeCollege = (slug: string) => {
    setColleges(prev => prev.filter(c => c.slug !== slug))
  }

  const updateStrategy = (slug: string, strategy: string) => {
    setColleges(prev => prev.map(c =>
      c.slug === slug
        ? { ...c, strategy, deadline: DEFAULT_DEADLINES[strategy]?.default || c.deadline }
        : c
    ))
  }

  const updateDeadline = (slug: string, deadline: string) => {
    setColleges(prev => prev.map(c => c.slug === slug ? { ...c, deadline } : c))
  }

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)

    // Save goals
    await fetch("/api/coach/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        graduation_year: gradYear,
        current_gpa: gpa ? parseFloat(gpa) : null,
        sat_score: satScore ? parseInt(satScore) : null,
        act_score: actScore ? parseInt(actScore) : null,
        intended_major: major,
        target_colleges: colleges,
      }),
    })

    // Generate checklist
    await fetch("/api/coach/generate-checklist", { method: "POST" })

    router.push("/coach/checklist")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body text-navy focus:outline-none focus:ring-2 focus:ring-gold"

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-gold" : "bg-navy/10"}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h1 className="font-display text-2xl font-bold text-navy mb-1">About you</h1>
            <p className="font-body text-sm text-navy/50 mb-8">Step 1 of 3</p>

            <div className="space-y-5">
              <div>
                <label className="block font-body text-sm font-medium text-navy mb-1">Graduation year</label>
                <select value={gradYear} onChange={e => setGradYear(parseInt(e.target.value))} className={inputCls}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-navy mb-1">Current unweighted GPA</label>
                <input type="number" min="0" max="4" step="0.01" value={gpa} onChange={e => setGpa(e.target.value)} placeholder="e.g. 3.7" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-sm font-medium text-navy mb-1">SAT score <span className="text-navy/30">(optional)</span></label>
                  <input type="number" value={satScore} onChange={e => setSatScore(e.target.value)} placeholder="e.g. 1350" className={inputCls} />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-navy mb-1">ACT score <span className="text-navy/30">(optional)</span></label>
                  <input type="number" value={actScore} onChange={e => setActScore(e.target.value)} placeholder="e.g. 30" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-navy mb-1">Intended major</label>
                <input type="text" value={major} onChange={e => setMajor(e.target.value)} placeholder="e.g. Computer Science" className={inputCls} />
              </div>
            </div>

            <button onClick={() => setStep(2)} disabled={!major} className="w-full mt-8 bg-gold hover:bg-gold/90 disabled:bg-gray-200 text-navy font-body font-medium py-3 rounded-md transition-colors text-sm">
              Next &rarr;
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-display text-2xl font-bold text-navy mb-1">Your target colleges</h1>
            <p className="font-body text-sm text-navy/50 mb-8">Step 2 of 3 &middot; Add up to 8</p>

            {/* Search */}
            <div className="relative mb-6" ref={dropdownRef}>
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setShowDropdown(true) }}
                placeholder={colleges.length >= 8 ? "Maximum 8 colleges" : "Search for a college..."}
                disabled={colleges.length >= 8}
                className={inputCls}
              />
              {showDropdown && matches.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {matches.map(c => (
                    <button key={c.slug} onClick={() => addCollege(c.name, c.slug)} className="w-full text-left px-4 py-2.5 font-body text-sm text-navy hover:bg-cream transition-colors">
                      {c.name} <span className="text-navy/40 text-xs">{c.location}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* College list */}
            <div className="space-y-3">
              {colleges.map(c => (
                <div key={c.slug} className="ktc-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-sm font-medium text-navy">{c.name}</span>
                    <button onClick={() => removeCollege(c.slug)} className="text-navy/30 hover:text-red-400"><X size={16} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-body text-xs text-navy/50 mb-1">Strategy</label>
                      <select value={c.strategy} onChange={e => updateStrategy(c.slug, e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-body text-navy focus:outline-none focus:ring-2 focus:ring-gold">
                        {STRATEGIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-body text-xs text-navy/50 mb-1">Deadline</label>
                      <input type="date" value={c.deadline} onChange={e => updateDeadline(c.slug, e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-body text-navy focus:outline-none focus:ring-2 focus:ring-gold" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {colleges.length === 0 && (
              <p className="text-center font-body text-sm text-navy/40 py-8">Search above to add your target colleges</p>
            )}

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-navy font-body font-medium py-3 rounded-md transition-colors text-sm hover:bg-gray-50">
                &larr; Back
              </button>
              <button onClick={() => setStep(3)} disabled={colleges.length === 0} className="flex-1 bg-gold hover:bg-gold/90 disabled:bg-gray-200 text-navy font-body font-medium py-3 rounded-md transition-colors text-sm">
                Next &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="font-display text-2xl font-bold text-navy mb-1">Confirm your plan</h1>
            <p className="font-body text-sm text-navy/50 mb-8">Step 3 of 3</p>

            <div className="ktc-card p-6 mb-6">
              <h3 className="font-display text-base font-bold text-navy mb-3">Your profile</h3>
              <dl className="grid grid-cols-2 gap-y-2 text-sm font-body">
                <dt className="text-navy/50">Graduation</dt><dd className="text-navy font-medium">{gradYear}</dd>
                {gpa && <><dt className="text-navy/50">GPA</dt><dd className="text-navy font-medium">{gpa}</dd></>}
                {satScore && <><dt className="text-navy/50">SAT</dt><dd className="text-navy font-medium">{satScore}</dd></>}
                {actScore && <><dt className="text-navy/50">ACT</dt><dd className="text-navy font-medium">{actScore}</dd></>}
                <dt className="text-navy/50">Major</dt><dd className="text-navy font-medium">{major}</dd>
              </dl>
            </div>

            <div className="ktc-card p-6 mb-6">
              <h3 className="font-display text-base font-bold text-navy mb-3">Target colleges ({colleges.length})</h3>
              <div className="space-y-2">
                {colleges.map(c => (
                  <div key={c.slug} className="flex items-center justify-between text-sm font-body">
                    <span className="text-navy font-medium">{c.name}</span>
                    <span className="text-navy/40">{STRATEGIES.find(s => s.value === c.strategy)?.label} &middot; {c.deadline}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-navy font-body font-medium py-3 rounded-md transition-colors text-sm hover:bg-gray-50">
                &larr; Back
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-gold hover:bg-gold/90 disabled:bg-gray-200 text-navy font-body font-bold py-3 rounded-md transition-colors text-sm">
                {saving ? "Generating plan..." : "Generate my plan \u2192"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
