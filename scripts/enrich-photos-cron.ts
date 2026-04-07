import { config } from "dotenv"
config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!
const MAX_PER_RUN = 45
const DELAY_MS = 1200

interface PhotoResult {
  url: string
  creditName: string | null
  creditUrl: string | null
}

async function getCollegePhoto(collegeName: string, city: string): Promise<PhotoResult | "__RATE_LIMITED__" | null> {
  const query = encodeURIComponent(`${collegeName} campus`)
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
  )
  if (res.status === 403 || res.status === 429) {
    console.log("Rate limit hit — stopping.")
    return "__RATE_LIMITED__"
  }
  if (!res.ok) return null
  const data = await res.json()
  const result = data.results?.[0]
  if (result?.urls?.regular) {
    return {
      url: result.urls.regular,
      creditName: result.user?.name ?? null,
      creditUrl: result.user?.links?.html ?? null,
    }
  }

  // Fallback: city campus
  const res2 = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city + " university campus")}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
  )
  if (!res2.ok) return null
  const data2 = await res2.json()
  const result2 = data2.results?.[0]
  if (result2?.urls?.regular) {
    return {
      url: result2.urls.regular,
      creditName: result2.user?.name ?? null,
      creditUrl: result2.user?.links?.html ?? null,
    }
  }
  return null
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error("UNSPLASH_ACCESS_KEY not set")
    process.exit(1)
  }

  const { data: colleges, error, count } = await supabase
    .from("colleges")
    .select("slug, name, location", { count: "exact" })
    .is("photo_url", null)
    .order("name")
    .limit(MAX_PER_RUN)

  if (error || !colleges) {
    console.error("Fetch failed:", error)
    process.exit(1)
  }

  const remaining = (count || 0) - colleges.length
  console.log(`Found ${colleges.length} colleges needing photos (${remaining} more after this batch)`)

  if (colleges.length === 0) {
    console.log("All colleges have photos!")
    return
  }

  let processed = 0
  let failed = 0

  for (const college of colleges) {
    const city = college.location?.split(",")?.[0] ?? ""
    const photo = await getCollegePhoto(college.name, city)

    if (photo === "__RATE_LIMITED__") {
      console.log(`Processed ${processed} colleges before rate limit.`)
      console.log(`Rate limit reached — run again in 1 hour.`)
      return
    }

    if (photo) {
      await supabase.from("colleges").update({
        photo_url: photo.url,
        photo_credit_name: photo.creditName,
        photo_credit_url: photo.creditUrl,
      }).eq("slug", college.slug)
      processed++
    } else {
      // Set a default so we don't retry endlessly
      await supabase
        .from("colleges")
        .update({ photo_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80" })
        .eq("slug", college.slug)
      failed++
    }

    if (processed % 10 === 0 && processed > 0) {
      console.log(`  Processed ${processed} of ${colleges.length}`)
    }

    await sleep(DELAY_MS)
  }

  console.log(`Done! ${processed} updated, ${failed} set to default.`)
  if (remaining > 0) {
    console.log(`${remaining} colleges remaining — run again in 1 hour.`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
