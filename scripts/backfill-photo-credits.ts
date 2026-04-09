import { config } from "dotenv"
config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY!
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
  if (!UNSPLASH_KEY) {
    console.error("UNSPLASH_ACCESS_KEY not set")
    process.exit(1)
  }

  const { data: colleges, error } = await supabase
    .from("colleges")
    .select("slug, name, photo_url")
    .not("photo_url", "is", null)
    .neq("photo_url", "")
    .is("photo_credit_name", null)
    .order("name")
    .limit(40)

  if (error || !colleges) {
    console.error("Fetch failed:", error)
    process.exit(1)
  }

  console.log(`Found ${colleges.length} colleges needing photo credits`)

  let updated = 0
  let skipped = 0

  for (const college of colleges) {
    // Extract filename from photo_url
    const filename = college.photo_url.split("?")[0].split("/").pop()
    if (!filename) {
      console.log(`  [skip] ${college.name} — can't extract filename`)
      skipped++
      continue
    }

    // Search Unsplash for this college
    const query = encodeURIComponent(`${college.name} campus`)
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=10`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )

    if (res.status === 403 || res.status === 429) {
      console.log(`\n  Rate limit hit after ${updated} updates. Run again in 1 hour.`)
      break
    }

    if (!res.ok) {
      console.log(`  [skip] ${college.name} — API ${res.status}`)
      skipped++
      await sleep(200)
      continue
    }

    const data = await res.json()
    const results = data.results || []

    // Find the result whose URL contains our filename
    const match = results.find((r: any) =>
      [r.urls?.raw, r.urls?.full, r.urls?.regular, r.urls?.small]
        .filter(Boolean)
        .some((url: string) => url.includes(filename))
    )

    if (match?.user?.name && match?.user?.links?.html) {
      await supabase
        .from("colleges")
        .update({
          photo_credit_name: match.user.name,
          photo_credit_url: match.user.links.html,
        })
        .eq("slug", college.slug)
      console.log(`  [ok] ${college.name} — Photo by ${match.user.name}`)
      updated++
    } else {
      console.log(`  [skip] ${college.name} — no matching photo in search results`)
      skipped++
    }

    await sleep(200)
  }

  console.log(`\nDone! ${updated} updated, ${skipped} skipped`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
