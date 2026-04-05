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
    collegeList = ["University of Texas at Austin","Texas A&M University","University of California Los Angeles","University of Michigan","New York University","University of Florida"]
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: `You are a college admissions expert with deep knowledge of US admission statistics.

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
- slug: URL slug (lowercase, hyphens only)
- likelihood: "Safety" | "Likely" | "Match" | "Reach"
- percentage: integer 0-95 (admission probability for this specific student)
- reasoning: 1-2 sentences citing actual median GPA/test ranges for that college
- tips: 2-3 specific actionable improvements (cite actual score targets, named programs, real deadlines)

Account for in-state advantage, major competitiveness, and holistic factors.

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
