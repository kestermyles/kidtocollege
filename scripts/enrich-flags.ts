import { config } from "dotenv"
config({ path: ".env.local" })

import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const BATCH_SIZE = 30
const DELAY_MS = 300
const CONCURRENCY = 5

interface FlagsResult {
  has_greek_life: boolean
  has_d1_sports: boolean
  campus_setting: "Urban" | "Suburban" | "Rural" | "College Town"
}

async function getFlags(
  colleges: { slug: string; name: string; state: string; location: string }[]
): Promise<Record<string, FlagsResult>> {
  const list = colleges
    .map((c, i) => `${i + 1}. ${c.name} — ${c.location}`)
    .join("\n")

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `For each college below, provide three facts. Use your knowledge of US colleges — be accurate, not generic.

${list}

Respond ONLY with valid JSON, no markdown:
{
  "1": { "has_greek_life": true/false, "has_d1_sports": true/false, "campus_setting": "Urban"|"Suburban"|"Rural"|"College Town" },
  "2": { ... },
  ...
}

Guidelines:
- has_greek_life: true if the college has active fraternities/sororities (IFC, Panhellenic, NPHC etc). false for community colleges and schools with no Greek system.
- has_d1_sports: true ONLY if the college competes in NCAA Division I. false for D2, D3, NAIA, NJCAA, and non-athletic schools.
- campus_setting: "Urban" if in a major city downtown area, "Suburban" if in a suburb or smaller city, "Rural" if in a rural/small town area, "College Town" if the town's identity revolves around the university (e.g. College Station TX, State College PA, Ann Arbor MI).`,
      },
    ],
  })

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")

  const clean = text.replace(/```json|```/g, "").trim()
  const parsed = JSON.parse(clean)

  const result: Record<string, FlagsResult> = {}
  colleges.forEach((c, i) => {
    const flags = parsed[String(i + 1)]
    if (flags) {
      result[c.slug] = {
        has_greek_life: !!flags.has_greek_life,
        has_d1_sports: !!flags.has_d1_sports,
        campus_setting: flags.campus_setting || "Suburban",
      }
    }
  })
  return result
}

async function processBatch(
  batch: { slug: string; name: string; state: string; location: string }[]
) {
  try {
    const flags = await getFlags(batch)

    const updates = Object.entries(flags).map(([slug, data]) =>
      supabase.from("colleges").update(data).eq("slug", slug)
    )

    const results = await Promise.all(updates)
    const errors = results.filter((r) => r.error)
    if (errors.length > 0) {
      console.error(`  Warning: ${errors.length} upsert errors in batch`)
      errors.forEach((r) => console.error("   ", r.error?.message))
    }

    return Object.keys(flags).length
  } catch (err) {
    console.error(
      `  Batch failed: ${err instanceof Error ? err.message : err}`
    )
    await sleep(3000)
    try {
      const flags = await getFlags(batch)
      await Promise.all(
        Object.entries(flags).map(([slug, data]) =>
          supabase.from("colleges").update(data).eq("slug", slug)
        )
      )
      return Object.keys(flags).length
    } catch {
      console.error(`  Batch retry also failed, skipping`)
      return 0
    }
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  console.log("Fetching colleges needing flags from Supabase...")

  // Paginated fetch — only colleges where has_greek_life is null
  const allColleges: {
    slug: string
    name: string
    state: string
    location: string
  }[] = []
  let from = 0
  const PAGE_SIZE = 1000

  while (true) {
    const { data, error } = await supabase
      .from("colleges")
      .select("slug, name, state, location")
      .is("has_greek_life", null)
      .order("name")
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      console.error("Fetch error:", error)
      process.exit(1)
    }
    if (!data || data.length === 0) break

    allColleges.push(...data)
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  const colleges = allColleges

  // --skip option
  const skipArg = process.argv.find((a) => a.startsWith("--skip="))
  const skip = skipArg ? parseInt(skipArg.split("=")[1]) : 0
  if (skip > 0) {
    console.log(`Skipping first ${skip} colleges (already enriched)`)
    colleges.splice(0, skip)
  }

  console.log(`Found ${colleges.length} colleges needing flags`)
  console.log(
    `Processing in batches of ${BATCH_SIZE} with ${CONCURRENCY} concurrent batches\n`
  )

  const batches: (typeof colleges)[] = []
  for (let i = 0; i < colleges.length; i += BATCH_SIZE) {
    batches.push(colleges.slice(i, i + BATCH_SIZE))
  }

  console.log(`Total batches: ${batches.length}`)
  console.log(
    `Estimated time: ~${Math.ceil((batches.length / CONCURRENCY) * 3)} minutes\n`
  )

  let totalUpdated = 0

  for (let i = 0; i < batches.length; i += CONCURRENCY) {
    const chunk = batches.slice(i, i + CONCURRENCY)

    const results = await Promise.all(chunk.map((batch) => processBatch(batch)))

    const updated = results.reduce((sum, n) => sum + n, 0)
    totalUpdated += updated

    console.log(
      `Batches ${i + 1}-${Math.min(i + CONCURRENCY, batches.length)} of ${batches.length} — ${totalUpdated}/${colleges.length} colleges enriched`
    )

    if (i + CONCURRENCY < batches.length) {
      await sleep(DELAY_MS)
    }
  }

  console.log(
    `\nDone! ${totalUpdated} colleges enriched with Greek life, D1 sports, and campus setting.`
  )
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
