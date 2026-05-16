import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"

export const maxDuration = 60

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

const STATE_NAME_TO_ABBR: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA",
  Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
  Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS",
  Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK",
  Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI",
  Wyoming: "WY",
}

/**
 * Pick 6 colleges spanning the student's realistic selectivity range:
 *   - 1 home-state safety (4-year residential, in their state if possible)
 *   - 2 broad safety
 *   - 2 likely/match (mid-range selectivity)
 *   - 2 reach (selective, aspirational)
 *
 * Filters out community colleges, online-mostly schools, and tech/trade
 * institutes so a 3.8 GPA student doesn't see "Austin Community College"
 * and "SNHU" as their headline safeties.
 */
async function buildDefaultCollegeList(
  supabase: ReturnType<typeof getSupabase>,
  gpa: string | number,
  stateName?: string,
): Promise<string[]> {
  const FALLBACK = [
    "Arizona State University",
    "University of Central Florida",
    "Texas State University",
    "University of California Los Angeles",
    "University of Texas at Austin",
    "Rice University",
  ]
  if (!supabase) return FALLBACK

  const gpaNum = typeof gpa === "string" ? parseFloat(gpa) : gpa
  const stateAbbr = stateName ? STATE_NAME_TO_ABBR[stateName] : undefined

  // GPA-aware tier definitions. Safety ceiling caps at 95 so we never
  // suggest 99-100% open-enrollment schools as the headline match.
  const safetyMin = gpaNum >= 3.7 ? 55 : gpaNum >= 3.3 ? 70 : 80
  const safetyMax = gpaNum >= 3.7 ? 90 : gpaNum >= 3.3 ? 95 : 99
  const matchMin = gpaNum >= 3.7 ? 25 : gpaNum >= 3.3 ? 40 : 55
  const matchMax = gpaNum >= 3.7 ? 55 : gpaNum >= 3.3 ? 70 : 85
  const reachMax = gpaNum >= 3.7 ? 25 : gpaNum >= 3.3 ? 40 : 55

  // Excluded name patterns: community colleges, online-mostly schools,
  // narrowly-scoped institutes. These are legitimate paths but not what
  // most high-school-senior applicants are evaluating against.
  const NAME_BLOCKLIST = [
    "community college", "online", "digital", "world campus", "global campus",
    "campus immersion", "technical college", "vocational", "trade school",
    "western governors", "southern new hampshire", "grand canyon",
    "university of phoenix", "liberty university", "ashford", "capella",
  ]
  function isExcluded(name: string): boolean {
    const lower = name.toLowerCase()
    return NAME_BLOCKLIST.some((p) => lower.includes(p))
  }

  async function pick(
    minAccept: number,
    maxAccept: number,
    n: number,
    preferState = false,
  ): Promise<string[]> {
    let query = supabase!
      .from("colleges")
      .select("name, state, graduation_rate")
      .gte("acceptance_rate", minAccept)
      .lte("acceptance_rate", maxAccept)
      .not("acceptance_rate", "is", null)
      // Prefer schools with strong outcomes — proxy for residential 4-year.
      .gte("graduation_rate", 50)
      .order("graduation_rate", { ascending: false, nullsFirst: false })
      .limit(40)
    if (preferState && stateAbbr) query = query.eq("state", stateAbbr)
    const { data } = await query
    return (data ?? [])
      .filter((r: { name: string }) => !isExcluded(r.name))
      .slice(0, n)
      .map((r: { name: string }) => r.name)
  }

  const [stateSafety, broadSafety, match, reach] = await Promise.all([
    pick(safetyMin, safetyMax, 1, true),
    pick(safetyMin, safetyMax, 3),
    pick(matchMin, matchMax, 2),
    pick(1, reachMax, 2),
  ])

  const seen = new Set<string>()
  const ordered: string[] = []
  for (const list of [stateSafety, broadSafety, match, reach]) {
    for (const name of list) {
      if (!seen.has(name)) {
        seen.add(name)
        ordered.push(name)
      }
    }
  }
  return ordered.length >= 4 ? ordered.slice(0, 6) : FALLBACK
}

export async function POST(req: NextRequest) {
  const { gpa, sat, act, state, major, savedColleges, specificCollege } = await req.json()
  if (!gpa || !state || !major) return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

  const client = new Anthropic()
  const supabase = getSupabase()

  let collegeList: string[]
  let specificCollegeNote = ""
  let cachedContext = ""

  if (specificCollege?.name) {
    collegeList = [specificCollege.name]
    specificCollegeNote = `\n\nThe student is specifically interested in ${specificCollege.name}. Evaluate this college first with extra detail — include its actual acceptance rate, cost of attendance, and any scholarships for ${major} students. Then suggest 3-5 similar colleges the student should also consider based on their profile.`

    // Check for cached AI data
    if (supabase && specificCollege.slug) {
      try {
        const { data: cached } = await supabase
          .from("colleges")
          .select("ai_acceptance_notes, ai_cost_after_aid, ai_scholarship_summary, ai_gpa_notes, ai_last_enriched")
          .eq("slug", specificCollege.slug)
          .single()

        if (cached?.ai_last_enriched) {
          const daysSince = (Date.now() - new Date(cached.ai_last_enriched).getTime()) / (1000 * 60 * 60 * 24)
          if (daysSince < 30) {
            const parts = []
            if (cached.ai_acceptance_notes) parts.push(`Acceptance: ${cached.ai_acceptance_notes}`)
            if (cached.ai_cost_after_aid) parts.push(`Cost estimates: ${cached.ai_cost_after_aid}`)
            if (cached.ai_scholarship_summary) parts.push(`Scholarships: ${cached.ai_scholarship_summary}`)
            if (cached.ai_gpa_notes) parts.push(`GPA notes: ${cached.ai_gpa_notes}`)
            if (parts.length > 0) {
              cachedContext = `\n\nKnown data for this college (from recent research): ${parts.join(". ")}. Use this as your base — personalise for the student's specific profile.`
            }
          }
        }
      } catch {
        // No cache — proceed without
      }
    }
  } else if (savedColleges?.length > 0) {
    collegeList = savedColleges.slice(0, 8)
  } else {
    // Smart default: spread across selectivity tiers so a typical
    // applicant sees Safety + Likely + Match + Reach, not 6 elite reaches.
    collegeList = await buildDefaultCollegeList(supabase, gpa, state)
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: `You are a college admissions expert with deep knowledge of US admission statistics. Be calibrated and encouraging — do not assume every applicant is aiming for the Ivy League. Most US 4-year colleges admit the majority of applicants; a student with a 3.5+ GPA is competitive at the vast majority of US schools.

Student profile:
- Unweighted GPA: ${gpa}
- SAT: ${sat || "not provided"}
- ACT: ${act || "not provided"}
- Home state: ${state}
- Intended major: ${major}

Colleges to evaluate:
${collegeList.map((c: string, i: number) => `${i + 1}. ${c}`).join("\n")}${specificCollegeNote}${cachedContext}

For each college return:
- college: college name
- slug: URL slug (lowercase, hyphens only — must match the college's KidToCollege slug if known)
- likelihood: "Safety" | "Likely" | "Match" | "Reach"
- percentage: integer 0-95 (calibrated admission probability for this specific student)
- reasoning: 1-2 sentences citing actual median GPA/test ranges for that college
- tips: 2-3 specific actionable improvements (cite actual score targets, named programs, real deadlines)

Calibration rules:
- If the college's overall acceptance rate is >70% AND the student's GPA is within or above that college's typical range, classify as Safety (percentage 80-95).
- If the college's acceptance rate is 40-70% AND the student is within the college's typical range, classify as Likely or Match (60-85%).
- A Reach should be a school where percentage is realistically under 35%.
- Account for in-state advantage, major competitiveness, and holistic factors.

Respond ONLY with valid JSON, no markdown:
{"results":[{"college":"...","slug":"...","likelihood":"...","percentage":0,"reasoning":"...","tips":["...","..."]}]}`
    }]
  })

  const text = message.content.filter((b) => b.type === "text").map((b) => (b as { type: "text"; text: string }).text).join("")
  let parsed
  try { parsed = JSON.parse(text) } catch { parsed = JSON.parse(text.replace(/```json|```/g, "").trim()) }

  // Write back enrichment data for the specific college (fire and forget)
  if (supabase && specificCollege?.slug && parsed?.results?.length > 0) {
    const primary = parsed.results[0]
    supabase
      .from("colleges")
      .update({
        ai_acceptance_notes: primary.reasoning || null,
        ai_gpa_notes: `Evaluated for ${gpa} GPA, ${sat || "no SAT"}, ${major}`,
        ai_last_enriched: new Date().toISOString(),
      })
      .eq("slug", specificCollege.slug)
      .then(() => {})

    // Increment search count
    supabase.rpc("increment_search_count", { college_slug: specificCollege.slug }).then(() => {})
  }

  return NextResponse.json(parsed)
}
