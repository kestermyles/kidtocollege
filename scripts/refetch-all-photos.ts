import { config } from "dotenv"
config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY!
const DELAY_MS = 100
const RETRY_WAIT_MS = 60_000

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

interface PhotoResult {
  url: string
  creditName: string | null
  creditUrl: string | null
}

async function fetchPhoto(
  collegeName: string,
  city: string
): Promise<PhotoResult | "__RATE_LIMITED__" | null> {
  const query = encodeURIComponent(`${collegeName} campus`)
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  )

  if (res.status === 429 || res.status === 403) return "__RATE_LIMITED__"
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

  // Fallback: city + university campus
  const res2 = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city + " university campus")}&per_page=1&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  )

  if (res2.status === 429 || res2.status === 403) return "__RATE_LIMITED__"
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

const FALLBACK_QUERIES = [
  "american university campus quad students",
  "US college campus brick building",
  "university campus architecture USA",
  "college library interior USA",
  "american campus students walking",
]

async function fetchFallbackPhoto(): Promise<PhotoResult | "__RATE_LIMITED__" | null> {
  for (const query of FALLBACK_QUERIES) {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )

    if (res.status === 429 || res.status === 403) return "__RATE_LIMITED__"
    if (!res.ok) continue

    const data = await res.json()
    const results = data.results || []
    if (results.length === 0) continue

    const randomIndex = Math.floor(Math.random() * Math.min(results.length, 5))
    const pick = results[randomIndex]
    if (pick?.urls?.regular) {
      return {
        url: pick.urls.regular,
        creditName: pick.user?.name ?? null,
        creditUrl: pick.user?.links?.html ?? null,
      }
    }
  }
  return null
}

async function main() {
  if (!UNSPLASH_KEY) {
    console.error("UNSPLASH_ACCESS_KEY not set")
    process.exit(1)
  }

  // Get total count first
  const { count } = await supabase
    .from("colleges")
    .select("*", { count: "exact", head: true })

  const total = count || 0
  console.log(`Processing all ${total} colleges...`)

  let updated = 0
  let processed = 0
  const defaultPhoto = "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"
  const BATCH = 1000

  for (let offset = 0; ; offset += BATCH) {
    const { data: colleges, error } = await supabase
      .from("colleges")
      .select("slug, name, location")
      .order("name")
      .range(offset, offset + BATCH - 1)

    if (error) {
      console.error("Fetch failed:", error)
      process.exit(1)
    }

    if (!colleges || colleges.length === 0) break

    for (const college of colleges) {
      const city = college.location?.split(",")?.[0] ?? ""

      let photo = await fetchPhoto(college.name, city)

      // On rate limit, wait 60s and retry once
      if (photo === "__RATE_LIMITED__") {
        console.log(`  [429] Rate limited at ${college.name} — waiting 60s...`)
        await sleep(RETRY_WAIT_MS)
        photo = await fetchPhoto(college.name, city)
        if (photo === "__RATE_LIMITED__") {
          console.log(`  [429] Still rate limited — skipping ${college.name}`)
          processed++
          continue
        }
      }

      // Try fallback if no specific photo found
      if (!photo || typeof photo === "string") {
        photo = await fetchFallbackPhoto()
        if (photo === "__RATE_LIMITED__") {
          console.log(`  [429] Rate limited on fallback for ${college.name} — waiting 60s...`)
          await sleep(RETRY_WAIT_MS)
          photo = await fetchFallbackPhoto()
        }
        if (photo && typeof photo !== "string") {
          console.log(`  [fallback] ${college.name} — Photo by ${photo.creditName}`)
        }
      }

      if (photo && typeof photo !== "string") {
        await supabase
          .from("colleges")
          .update({
            photo_url: photo.url,
            photo_credit_name: photo.creditName,
            photo_credit_url: photo.creditUrl,
          })
          .eq("slug", college.slug)
        updated++
      } else {
        await supabase
          .from("colleges")
          .update({ photo_url: defaultPhoto })
          .eq("slug", college.slug)
      }

      processed++
      if (processed % 100 === 0) {
        console.log(`[${processed}/${total}] complete`)
      }

      await sleep(DELAY_MS)
    }
  }

  console.log(`\nDone — ${updated} updated out of ${processed} total`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
