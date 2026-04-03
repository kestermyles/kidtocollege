import { config } from "dotenv"
config({ path: ".env.local" })

import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const BATCH_SIZE = 20      // colleges per AI call (keeps prompts tight)
const DELAY_MS = 200       // ms between batches
const CONCURRENCY = 10     // parallel batches at once

async function getPrograms(colleges: { slug: string; name: string; state: string }[]): Promise<Record<string, string[]>> {
  const list = colleges.map((c, i) => `${i + 1}. ${c.name} (${c.state})`).join("\n")

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `For each college below, list the 6-8 programs or majors it is genuinely well-known for or most popular at that specific institution. Use the actual college's identity — flagship programs, named schools, standout departments. For community colleges, list their strongest transfer pathways and vocational programs. Be specific to the institution, not generic.

${list}

Respond ONLY with valid JSON, no markdown, in this exact format:
{
  "1": ["Program A", "Program B", "Program C", "Program D", "Program E", "Program F"],
  "2": ["Program A", "Program B", ...],
  ...
}

Use short names (2-4 words max per program). Examples of good specificity:
- "McCombs Business" not just "Business"
- "Cockrell Engineering" not just "Engineering"
- "Pre-Med / Biology" not just "Biology"
- "Criminal Justice" not just "Law"
- "Welding Technology" for a community college
- "Nursing (RN)" for a community college`
      }
    ]
  })

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("")

  const clean = text.replace(/```json|```/g, "").trim()
  const parsed = JSON.parse(clean)

  // Map numeric keys back to slugs
  const result: Record<string, string[]> = {}
  colleges.forEach((c, i) => {
    const programs = parsed[String(i + 1)]
    if (programs && Array.isArray(programs)) {
      result[c.slug] = programs
    }
  })
  return result
}

async function processBatch(batch: { slug: string; name: string; state: string }[]) {
  try {
    const programs = await getPrograms(batch)

    // Upsert each college's programs
    const updates = Object.entries(programs).map(([slug, progs]) =>
      supabase
        .from("colleges")
        .update({ programs: progs })
        .eq("slug", slug)
    )

    const results = await Promise.all(updates)
    const errors = results.filter((r) => r.error)
    if (errors.length > 0) {
      console.error(`  Warning: ${errors.length} upsert errors in batch`)
      errors.forEach((r) => console.error("   ", r.error?.message))
    }

    return Object.keys(programs).length
  } catch (err) {
    console.error(`  Batch failed: ${err instanceof Error ? err.message : err}`)
    // Wait and retry once
    await new Promise((r) => setTimeout(r, 3000))
    try {
      const programs = await getPrograms(batch)
      await Promise.all(
        Object.entries(programs).map(([slug, progs]) =>
          supabase.from("colleges").update({ programs: progs }).eq("slug", slug)
        )
      )
      return Object.keys(programs).length
    } catch {
      console.error(`  Batch retry also failed, skipping`)
      return 0
    }
  }
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  console.log("Fetching colleges from Supabase...")

  // Paginated fetch to get ALL colleges (Supabase caps at 1000 per query)
  const allColleges: { slug: string; name: string; state: string }[] = []
  let from = 0
  const PAGE_SIZE = 1000

  while (true) {
    const { data, error } = await supabase
      .from("colleges")
      .select("slug, name, state")
      .order("name")
      .range(from, from + PAGE_SIZE - 1)

    if (error) { console.error("Fetch error:", error); process.exit(1) }
    if (!data || data.length === 0) break

    allColleges.push(...data)
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  const colleges = allColleges

  // --skip option to resume from a given offset
  const skipArg = process.argv.find(a => a.startsWith("--skip="))
  const skip = skipArg ? parseInt(skipArg.split("=")[1]) : 0
  if (skip > 0) {
    console.log(`Skipping first ${skip} colleges (already enriched)`)
    colleges.splice(0, skip)
  }

  console.log(`Found ${colleges.length} colleges to enrich`)
  console.log(`Processing in batches of ${BATCH_SIZE} with ${CONCURRENCY} concurrent batches\n`)

  // Split into batches of BATCH_SIZE
  const batches: typeof colleges[] = []
  for (let i = 0; i < colleges.length; i += BATCH_SIZE) {
    batches.push(colleges.slice(i, i + BATCH_SIZE))
  }

  console.log(`Total batches: ${batches.length}`)
  console.log(`Estimated time: ~${Math.ceil(batches.length / CONCURRENCY * 3)} minutes\n`)

  let totalUpdated = 0

  // Process CONCURRENCY batches at a time
  for (let i = 0; i < batches.length; i += CONCURRENCY) {
    const chunk = batches.slice(i, i + CONCURRENCY)

    const results = await Promise.all(
      chunk.map((batch) => processBatch(batch))
    )

    const updated = results.reduce((sum, n) => sum + n, 0)
    totalUpdated += updated

    console.log(`Batches ${i + 1}-${Math.min(i + CONCURRENCY, batches.length)} of ${batches.length} — ${totalUpdated}/${colleges.length} colleges enriched`)

    // Pause between chunks to avoid rate limits
    if (i + CONCURRENCY < batches.length) {
      await sleep(DELAY_MS)
    }
  }

  console.log(`\nDone! ${totalUpdated} colleges enriched with specific popular programs.`)
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
