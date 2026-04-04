"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"

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
    setError("")
    setLoading(true)
    const colleges = hasFetched ? savedColleges : await fetchSavedColleges()
    if (!hasFetched) { setSavedColleges(colleges); setHasFetched(true) }
    try {
      const res = await fetch("/api/my-chances", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, savedColleges: colleges }) })
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
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">My Chances</h1>
          <p className="text-lg text-gray-600">Enter your academic profile and get an AI-powered estimate of your admission chances at your saved colleges — plus specific tips to improve them.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unweighted GPA <span className="text-red-500">*</span></label>
              <input type="number" min="0" max="4.0" step="0.01" placeholder="e.g. 3.7" value={form.gpa} onChange={(e) => setForm({ ...form, gpa: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">SAT Score <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="number" min="400" max="1600" step="10" placeholder="e.g. 1320" value={form.sat} onChange={(e) => setForm({ ...form, sat: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ACT Score <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="number" min="1" max="36" step="1" placeholder="e.g. 29" value={form.act} onChange={(e) => setForm({ ...form, act: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your State <span className="text-red-500">*</span></label>
              <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Select state…</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Intended Major <span className="text-red-500">*</span></label>
              <select value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Select major…</option>
                {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</p>}

          <button onClick={handleSubmit} disabled={loading} className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors">
            {loading ? "Analysing your profile…" : "Check my chances →"}
          </button>
          <p className="mt-3 text-xs text-gray-400 text-center">AI estimates based on typical admission ranges — not guarantees.</p>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Results</h2>
            {results.map((r) => {
              const cfg = likelihoodConfig(r.likelihood)
              return (
                <div key={r.slug} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <a href={`/college/${r.slug}`} className="text-lg font-bold text-blue-600 hover:underline">{r.college}</a>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${cfg.colors}`}>{r.likelihood}</span>
                      <span className="text-2xl font-bold text-gray-800">{r.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                    <div className={`h-2 rounded-full transition-all duration-700 ${cfg.bar}`} style={{ width: `${r.percentage}%` }} />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{r.reasoning}</p>
                  {r.tips.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">How to improve your chances</p>
                      <ul className="space-y-1">
                        {r.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-blue-500 font-bold flex-shrink-0">→</span>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
            <p className="text-xs text-gray-400 text-center pt-2">Always verify requirements directly with each college.</p>
          </div>
        )}

        {results.length === 0 && hasFetched && savedColleges.length === 0 && !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <p className="text-amber-800 font-medium mb-2">No saved colleges found</p>
            <p className="text-sm text-amber-700">Save colleges to your list first and we&apos;ll analyse your chances at each one. <a href="/colleges" className="underline font-semibold">Browse colleges →</a></p>
          </div>
        )}
      </div>
    </main>
  )
}
