/**
 * Enrich colleges with CDS admission factors via Anthropic web search.
 *
 * Usage:
 *   npx tsx scripts/enrich-admission-factors.ts --batch=50 --start=0
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
 */

import { createClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace("--", "").split("=")
    return [k, parseInt(v) || 0]
  })
)

const BATCH = args.batch || 50
const START = args.start || 0
const DELAY_MS = 1500

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

function stripMarkdown(text: string): string {
  return text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim()
}

async function main() {
  console.log(`[enrich] Fetching colleges (start=${START}, batch=${BATCH})...`)

  const { data: colleges, error } = await supabase
    .from("colleges")
    .select("slug, name")
    .order("total_enrollment", { ascending: false, nullsFirst: false })
    .range(START, START + BATCH - 1)

  if (error || !colleges) {
    console.error("Failed to fetch colleges:", error)
    process.exit(1)
  }

  console.log(`[enrich] Found ${colleges.length} colleges to process`)

  let processed = 0
  let skipped = 0

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
      console.log(`  [fetch] ${college.name}...`)

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 800,
        tools: [{ type: "web_search_20250305" as any, name: "web_search", max_uses: 3 }],
        system:
          "You are a JSON-only API. You never write explanations or natural language. You only output raw JSON objects.",
        messages: [
          {
            role: "user",
            content: `You must respond with ONLY a JSON object. No explanation, no preamble, no markdown, no code fences. Just the raw JSON object starting with { and ending with }.

Search for the Common Data Set (CDS) for ${college.name} and find Section C7. Return this exact JSON structure:
{"cds_year":2024,"factors":{"gpa":"very_important","class_rank":"important","test_scores":"considered","recommendation":"important","extracurriculars":"considered","first_generation":"considered","geographic_residence":"important","state_residency":"not_considered","volunteer_work":"considered","work_experience":"considered","talent_ability":"important","character_personal":"very_important","alumni_relation":"considered","racial_ethnic_status":"not_considered"}}

Replace each value with the actual weight from their CDS C7. Only use these four values: very_important, important, considered, not_considered. Start your response with { immediately.`,
          },
        ],
      })

      // Extract text from response
      const text = response.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { type: "text"; text: string }).text)
        .join("")

      const rawText = stripMarkdown(text)

      // Extract JSON object from response even if there's surrounding text
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error("No JSON object found")
      const cleanText = jsonMatch[0]
      const data = JSON.parse(cleanText)

      if (!data.factors || !data.cds_year) {
        console.log(`  [warn] ${college.name} — invalid response structure`)
        await sleep(DELAY_MS)
        continue
      }

      const year = typeof data.cds_year === "string"
        ? parseInt(data.cds_year.split("-")[0], 10)
        : data.cds_year

      // Upsert factors
      const rows = Object.entries(data.factors).map(([factor, weight]) => ({
        college_slug: college.slug,
        factor,
        weight: weight as string,
        source: "cds",
        cds_year: year,
        updated_at: new Date().toISOString(),
      }))

      const { error: upsertError } = await supabase
        .from("college_admission_factors")
        .upsert(rows, { onConflict: "college_slug,factor,cds_year" })

      if (upsertError) {
        console.log(`  [error] ${college.name} — upsert failed: ${upsertError.message}`)
      } else {
        console.log(`  [done] ${college.name} — CDS ${year}, ${rows.length} factors`)
        processed++
      }
    } catch (err: any) {
      console.log(`  [error] ${college.name} — ${err.message || err}`)
    }

    await sleep(DELAY_MS)
  }

  console.log(`\n[enrich] Complete. Processed: ${processed}, Skipped: ${skipped}, Errors: ${colleges.length - processed - skipped}`)
}

main()
