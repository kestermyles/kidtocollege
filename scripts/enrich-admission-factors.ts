/**
 * Enrich colleges with CDS admission factors via Anthropic (Haiku, from training data).
 *
 * Usage:
 *   npx tsx scripts/enrich-admission-factors.ts
 *   npx tsx scripts/enrich-admission-factors.ts --slugs=mit,stanford,harvard
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
 */

import { createClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"

const DELAY_MS = 1000
const SLUGS_ARG = process.argv.find((a) => a.startsWith("--slugs="))
const SLUGS = SLUGS_ARG ? SLUGS_ARG.replace("--slugs=", "").split(",") : null

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(url, key)
const anthropic = new Anthropic()

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

const VALID_WEIGHTS = new Set([
  "very_important", "important", "considered", "not_considered",
])
const VALID_FACTORS = new Set([
  "gpa", "class_rank", "test_scores", "recommendation",
  "extracurriculars", "first_generation", "geographic_residence",
  "state_residency", "volunteer_work", "work_experience",
  "talent_ability", "character_personal", "alumni_relation",
  "racial_ethnic_status",
])

async function fetchFactors(
  collegeName: string
): Promise<{ cdsYear: number; factors: Record<string, string> } | null> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-3-5-20251001",
    max_tokens: 400,
    system:
      "You are a JSON-only API. Return only raw JSON.",
    messages: [
      {
        role: "user",
        content: `From your training data, what does ${collegeName}'s Common Data Set Section C7 show for admission factor weights? Return ONLY the JSON object, no other text.
{"cds_year":2024,"factors":{"gpa":"very_important","class_rank":"important","test_scores":"considered","recommendation":"important","extracurriculars":"considered","first_generation":"considered","geographic_residence":"important","state_residency":"not_considered","volunteer_work":"considered","work_experience":"considered","talent_ability":"important","character_personal":"very_important","alumni_relation":"considered","racial_ethnic_status":"not_considered"}}
Replace each value with the actual weight. Start with { immediately.`,
      },
    ],
  })

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("")
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim()

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null

  const data = JSON.parse(jsonMatch[0])

  if (data.error || data.status === "not_found") return null

  // Handle both {factors: {...}} and flat {gpa: ..., class_rank: ...}
  let factors = data.factors
  if (!factors) {
    const flat = Object.fromEntries(
      Object.entries(data).filter(([k]) => VALID_FACTORS.has(k))
    )
    if (Object.keys(flat).length >= 3) {
      factors = flat
    }
  }

  if (!factors || Object.keys(factors).length === 0) return null

  // Validate weights
  const cleaned: Record<string, string> = {}
  for (const [k, v] of Object.entries(factors)) {
    if (VALID_FACTORS.has(k) && VALID_WEIGHTS.has(v as string)) {
      cleaned[k] = v as string
    }
  }

  if (Object.keys(cleaned).length < 3) return null

  // Parse year — handle both integer and "2024-2025" format
  const rawYear = data.cds_year
  const cdsYear =
    typeof rawYear === "string"
      ? parseInt(rawYear.split("-")[0], 10)
      : rawYear || new Date().getFullYear()

  return { cdsYear, factors: cleaned }
}

async function main() {
  let colleges: { slug: string; name: string }[]

  if (SLUGS) {
    console.log(`[enrich] Processing ${SLUGS.length} specific slugs...`)
    const { data, error } = await supabase
      .from("colleges")
      .select("slug, name")
      .in("slug", SLUGS)

    if (error || !data) {
      console.error("Failed to fetch colleges:", error)
      process.exit(1)
    }

    colleges = data
  } else {
    console.log(`[enrich] Fetching top 300 traditional 4-year colleges...`)
    const { data, error } = await supabase
      .from("colleges")
      .select("slug, name, official_url")
      .not("official_url", "is", null)
      .gte("total_enrollment", 3000)
      .or("acceptance_rate.is.null,acceptance_rate.lt.95")
      .order("total_enrollment", { ascending: false, nullsFirst: false })
      .limit(300)

    if (error || !data) {
      console.error("Failed to fetch colleges:", error)
      process.exit(1)
    }

    colleges = data
  }

  console.log(`[enrich] Found ${colleges.length} colleges to process`)

  let done = 0
  let skipped = 0
  let errors = 0

  for (const college of colleges) {
    // Check if already enriched for recent year
    const { data: existing } = await supabase
      .from("college_admission_factors")
      .select("cds_year")
      .eq("college_slug", college.slug)
      .gte("cds_year", 2023)
      .limit(1)

    if (existing && existing.length > 0) {
      console.log(`  [skip] ${college.name} — already has CDS ${existing[0].cds_year}`)
      skipped++
      continue
    }

    try {
      const result = await fetchFactors(college.name)

      if (!result) {
        console.log(`  [skip] ${college.name} — no CDS found`)
        skipped++
        await sleep(DELAY_MS)
        continue
      }

      const rows = Object.entries(result.factors).map(([factor, weight]) => ({
        college_slug: college.slug,
        factor,
        weight,
        source: "cds",
        cds_year: result.cdsYear,
        updated_at: new Date().toISOString(),
      }))

      const { error: upsertError } = await supabase
        .from("college_admission_factors")
        .upsert(rows, { onConflict: "college_slug,factor,cds_year" })

      if (upsertError) {
        console.log(`  [error] ${college.name} — upsert failed: ${upsertError.message}`)
        errors++
      } else {
        console.log(`  [done] ${college.name} — CDS ${result.cdsYear}, ${rows.length} factors`)
        done++
      }
    } catch (err: any) {
      console.log(`  [error] ${college.name} — ${err.message || err}`)
      errors++
    }

    await sleep(DELAY_MS)
  }

  console.log(`\n[enrich] Complete. Done: ${done}, Skipped: ${skipped}, Errors: ${errors}`)
}

main()
