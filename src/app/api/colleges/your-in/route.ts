import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"

export const maxDuration = 30

const FACTOR_LABELS: Record<string, string> = {
  gpa: "GPA",
  class_rank: "Class Rank",
  test_scores: "Test Scores",
  recommendation: "Recommendations",
  extracurriculars: "Extracurriculars",
  first_generation: "First Generation",
  geographic_residence: "Geographic Diversity",
  state_residency: "State Residency",
  volunteer_work: "Volunteer Work",
  work_experience: "Work Experience",
  talent_ability: "Talent / Ability",
  character_personal: "Character",
  alumni_relation: "Legacy",
  racial_ethnic_status: "Racial / Ethnic Status",
}

function getSvc() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("college_slug")
  if (!slug) return NextResponse.json({ error: "college_slug required" }, { status: 400 })

  const svc = getSvc()
  const { data } = await svc
    .from("college_your_in")
    .select("headline, angles, generated_at")
    .eq("college_slug", slug)
    .single()

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { college_slug, college_name, user_state, user_major, user_gpa } = await req.json()
  if (!college_slug || !college_name) {
    return NextResponse.json({ error: "college_slug and college_name required" }, { status: 400 })
  }

  const svc = getSvc()

  // Check cache (30 days)
  const { data: cached } = await svc
    .from("college_your_in")
    .select("headline, angles, generated_at")
    .eq("college_slug", college_slug)
    .gte("generated_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .single()

  if (cached) return NextResponse.json(cached)

  // Fetch CDS factors
  const { data: factors } = await svc
    .from("college_admission_factors")
    .select("factor, weight")
    .eq("college_slug", college_slug)
    .order("updated_at", { ascending: false })

  const factorsList = (factors || [])
    .map((f) => `${FACTOR_LABELS[f.factor] || f.factor}: ${f.weight.replace(/_/g, " ")}`)
    .join(", ")

  const client = new Anthropic()
  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 600,
    system:
      "You are a college admissions strategist. Identify the best angle for a student to get into this college. Be specific. Do not be generic. Return only valid JSON, no markdown.",
    messages: [
      {
        role: "user",
        content: `College: ${college_name}
CDS admission factors: ${factorsList || "not available"}
Student state: ${user_state || "unknown"}
Student intended major: ${user_major || "unknown"}
Student GPA: ${user_gpa || "unknown"}

Return ONLY:
{
  "headline": "one sentence strongest angle",
  "angles": [
    {
      "type": "programme|geographic|demographic|growth|aid",
      "title": "max 8 words",
      "detail": "one specific sentence",
      "confidence": "high|medium|low"
    }
  ]
}
Max 3 angles. Only include angles with real signal.`,
      },
    ],
  })

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("")

  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim()

  let parsed: { headline: string; angles: unknown[] }
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
  }

  // Upsert
  await svc.from("college_your_in").upsert(
    {
      college_slug,
      headline: parsed.headline,
      angles: parsed.angles,
      generated_at: new Date().toISOString(),
      model_used: "claude-sonnet-4-5",
    },
    { onConflict: "college_slug" }
  )

  return NextResponse.json({
    headline: parsed.headline,
    angles: parsed.angles,
    generated_at: new Date().toISOString(),
  })
}
