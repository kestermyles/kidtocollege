"use client"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase-browser"
import { PageHeader } from "@/components/PageHeader"

const MAJORS = ["Undecided","Computer Science","Engineering","Business","Biology / Pre-Med","Psychology","Economics","Political Science","Communications","Nursing","Education","Art & Design","Film & Media","Environmental Science","Mathematics","Philosophy","Sociology","History","English / Literature","Criminal Justice"]

const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","International"]

interface CollegeResult {
  college: string
  slug: string
  likelihood: "Reach" | "Match" | "Safety" | "Likely"
  percentage: number
  reasoning: string
  tips: string[]
}

export default function MyChancesClient() {
  const [form, setForm] = useState({ gpa: "", sat: "", act: "", state: "", major: "" })
  const [results, setResults] = useState<CollegeResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [savedColleges, setSavedColleges] = useState<string[]>([])
  const [hasFetched, setHasFetched] = useState(false)

  // College search
  const [suggestOpen, setSuggestOpen] = useState(false)
  const [suggestName, setSuggestName] = useState("")
  const [suggestWebsite, setSuggestWebsite] = useState("")
  const [suggestSent, setSuggestSent] = useState(false)
  const [suggestLoading, setSuggestLoading] = useState(false)

  const [collegeQuery, setCollegeQuery] = useState("")
  const [selectedCollege, setSelectedCollege] = useState<{ name: string; slug: string } | null>(null)
  const [collegeVerified, setCollegeVerified] = useState(false)
  const [collegeError, setCollegeError] = useState("")
  const [collegeResults, setCollegeResults] = useState<{ name: string; slug: string }[]>([])
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false)
  const collegeDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(e.target as Node)) {
        setShowCollegeDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const searchColleges = async (query: string) => {
    setCollegeQuery(query)
    setSelectedCollege(null)
    setCollegeVerified(false)
    setCollegeError("")
    if (query.length < 3) { setCollegeResults([]); setShowCollegeDropdown(false); return }
    const supabase = createClient()
    const slugQuery = query.toLowerCase().replace(/ /g, "-")
    const { data } = await supabase
      .from("colleges")
      .select("name, slug")
      .or(`name.ilike.%${query}%,slug.ilike.%${slugQuery}%`)
      .order("total_enrollment", { ascending: false, nullsFirst: false })
      .limit(8)
    setCollegeResults((data as { name: string; slug: string }[]) || [])
    setShowCollegeDropdown(true)
  }

  const fetchSavedColleges = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    const { data } = await supabase.from("saved_colleges").select("college_name").eq("user_id", user.id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data?.map((r: any) => r.college_name) ?? []
  }

  const handleSubmit = async () => {
    if (!form.gpa || !form.state || !form.major) { setError("Please fill in GPA, state, and intended major."); return }
    const gpaNum = parseFloat(form.gpa)
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) { setError("GPA must be between 0.0 and 4.0"); return }

    // Clear unverified college text
    let verifiedCollege = selectedCollege
    if (collegeQuery && !collegeVerified) {
      setCollegeError("Please select a college from the list, or leave the field blank.")
      setCollegeQuery("")
      setSelectedCollege(null)
      verifiedCollege = null
    }

    setError("")
    setLoading(true)
    const colleges = hasFetched ? savedColleges : await fetchSavedColleges()
    if (!hasFetched) { setSavedColleges(colleges); setHasFetched(true) }
    try {
      const res = await fetch("/api/my-chances", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, savedColleges: colleges, specificCollege: verifiedCollege }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")
      setResults(data.results)
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong") } finally { setLoading(false) }
  }

  const likelihoodConfig = (l: string) => {
    const map: Record<string, { colors: string; bar: string }> = {
      Safety:  { colors: "bg-green-100 text-green-800 border-green-200",   bar: "bg-green-500" },
      Likely:  { colors: "bg-emerald-100 text-emerald-800 border-emerald-200", bar: "bg-emerald-500" },
      Match:   { colors: "bg-blue-100 text-blue-800 border-blue-200",     bar: "bg-blue-500" },
      Reach:   { colors: "bg-orange-100 text-orange-800 border-orange-200", bar: "bg-orange-500" },
    }
    return map[l] ?? { colors: "bg-gray-100 text-gray-700 border-gray-200", bar: "bg-gray-400" }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader title="My Chances" subtitle="See how you stack up at any college." />
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-12">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unweighted GPA <span className="text-red-500">*</span></label>
              <input type="number" min="0" max="4.0" step="0.01" placeholder="e.g. 3.7" value={form.gpa} onChange={(e) => setForm({ ...form, gpa: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">SAT Score <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="number" min="400" max="1600" step="10" placeholder="e.g. 1320" value={form.sat} onChange={(e) => setForm({ ...form, sat: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ACT Score <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="number" min="1" max="36" step="1" placeholder="e.g. 29" value={form.act} onChange={(e) => setForm({ ...form, act: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your State <span className="text-red-500">*</span></label>
              <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/40 bg-white">
                <option value="">Select state…</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Intended Major <span className="text-red-500">*</span></label>
              <select value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/40 bg-white">
                <option value="">Select major…</option>
                {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            {/* College search */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specific college <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="relative" ref={collegeDropdownRef}>
                <input
                  type="text"
                  value={selectedCollege ? selectedCollege.name : collegeQuery}
                  onChange={(e) => searchColleges(e.target.value)}
                  onFocus={() => { if (collegeResults.length > 0) setShowCollegeDropdown(true) }}
                  placeholder="e.g. University of Texas at Austin"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
                {selectedCollege && (
                  <button
                    onClick={() => { setSelectedCollege(null); setCollegeQuery(""); setCollegeResults([]); setCollegeVerified(false); setCollegeError("") }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                )}
                {showCollegeDropdown && collegeResults.length > 0 && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {collegeResults.map((c) => (
                      <button
                        key={c.slug}
                        onClick={() => {
                          setSelectedCollege(c)
                          setCollegeQuery(c.name)
                          setCollegeVerified(true)
                          setCollegeError("")
                          setShowCollegeDropdown(false)
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {collegeError && <p className="mt-1.5 text-xs text-red-500">{collegeError}</p>}
              <p className="mt-1 text-xs text-gray-400">Type to search and select from the list — or leave blank to find colleges by major</p>
              {suggestSent ? (
                <p className="mt-2 text-xs text-green-600">Thanks — we&apos;ll review and add it within 48 hours.</p>
              ) : !suggestOpen ? (
                <button onClick={() => setSuggestOpen(true)} className="mt-1.5 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">
                  Think a college is missing? Let us know &rarr;
                </button>
              ) : (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                  <input
                    type="text"
                    value={suggestName}
                    onChange={(e) => setSuggestName(e.target.value)}
                    placeholder="College name"
                    className="w-full border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gold/40"
                  />
                  <input
                    type="text"
                    value={suggestWebsite}
                    onChange={(e) => setSuggestWebsite(e.target.value)}
                    placeholder="Website (optional, e.g. harvard.edu)"
                    className="w-full border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gold/40"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (!suggestName.trim()) return
                        setSuggestLoading(true)
                        await fetch("/api/suggest-college", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ collegeName: suggestName, website: suggestWebsite, page: "/my-chances" }),
                        }).catch(() => {})
                        setSuggestLoading(false)
                        setSuggestSent(true)
                        setSuggestOpen(false)
                      }}
                      disabled={suggestLoading || !suggestName.trim()}
                      className="px-3 py-1.5 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 disabled:opacity-40 transition-colors"
                    >
                      {suggestLoading ? "Sending..." : "Send request"}
                    </button>
                    <button onClick={() => setSuggestOpen(false)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</p>}

          <button onClick={handleSubmit} disabled={loading} className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors">
            {loading ? "Analysing your profile…" : "Check my chances →"}
          </button>
          <p className="mt-3 text-xs text-gray-400 text-center">AI estimates based on typical admission ranges — not guarantees.</p>
        </div>

        {results.length > 0 && (
          <div>
            {/* Results header */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                {selectedCollege ? selectedCollege.name : `${form.major} Programs`}
              </h2>
              <p className="text-sm text-gray-400">
                Personalized report &middot; {form.gpa} GPA{form.sat ? ` · ${form.sat} SAT` : ""}{form.act ? ` · ${form.act} ACT` : ""} &middot; {form.state}
              </p>
            </div>

            <div className="space-y-6">
              {results.map((r, idx) => {
                const cfg = likelihoodConfig(r.likelihood)
                const isFirst = idx === 0 && selectedCollege
                return (
                  <div key={r.slug}>
                    {/* Section divider */}
                    {idx > 0 && <div className="border-t border-gray-200 mt-12" />}

                    <div className={`bg-white rounded-xl border border-gray-200 p-4 ${isFirst ? "ring-1 ring-amber-200" : ""}`}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <a href={`/college/${r.slug}`} className="text-base font-semibold text-gray-900 hover:text-amber-600 transition-colors">{r.college}</a>
                          {isFirst && <span className="ml-2 text-xs text-amber-500 font-medium">Your pick</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.colors}`}>{r.likelihood}</span>
                          <span className="text-lg font-semibold text-gray-800">{r.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                        <div className={`h-1.5 rounded-full transition-all duration-700 ${cfg.bar}`} style={{ width: `${r.percentage}%` }} />
                      </div>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{r.reasoning}</p>
                      {r.tips.length > 0 && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-xs font-mono tracking-widest uppercase text-amber-500 mb-2">How to improve</p>
                          <ul className="space-y-1.5">
                            {r.tips.map((tip, i) => (
                              <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-amber-500 flex-shrink-0">&rarr;</span>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 text-center mt-8">Always verify requirements directly with each college.</p>
          </div>
        )}

        {results.length === 0 && hasFetched && savedColleges.length === 0 && !loading && (
          <p className="text-sm text-gray-400 italic text-center py-8">
            Select a specific college above, or save colleges to your list to see your chances.{" "}
            <a href="/colleges" className="text-amber-600 underline">Browse colleges &rarr;</a>
          </p>
        )}

        {/* Cross-links */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <a href="/matches" className="block p-4 rounded-lg bg-amber-50 border border-amber-200 hover:border-amber-400 transition-colors mb-3">
            <p className="text-sm font-semibold text-gray-900">Want a full portfolio of colleges ranked for you?</p>
            <p className="text-xs text-gray-500 mt-0.5">My Matches ranks every college on financial fit, chances, major, and culture &rarr;</p>
          </a>
          <div className="flex flex-wrap gap-3">
            <a href="/colleges" className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:border-amber-300 transition-colors">Browse colleges</a>
            <a href="/coach" className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:border-amber-300 transition-colors">The Coach</a>
            <a href="/essays" className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:border-amber-300 transition-colors">Essay prompts</a>
            <a href="/scholarships" className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:border-amber-300 transition-colors">Scholarships</a>
          </div>
        </div>
      </div>
    </main>
  )
}
