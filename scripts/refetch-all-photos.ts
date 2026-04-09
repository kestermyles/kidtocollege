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

async function main() {
  if (!UNSPLASH_KEY) {
    console.error("UNSPLASH_ACCESS_KEY not set")
    process.exit(1)
  }

  const { data: colleges, error } = await supabase
    .from("colleges")
    .select("slug, name, location")
    .order("name")

  if (error || !colleges) {
    console.error("Failed to fetch colleges:", error)
    process.exit(1)
  }

  const total = colleges.length
  console.log(`Processing all ${total} colleges...`)

  let updated = 0
  const defaultPhoto = "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"

  for (let i = 0; i < colleges.length; i++) {
    const college = colleges[i]
    const city = college.location?.split(",")?.[0] ?? ""

    let photo = await fetchPhoto(college.name, city)

    // On rate limit, wait 60s and retry once
    if (photo === "__RATE_LIMITED__") {
      console.log(`  [429] Rate limited at ${college.name} — waiting 60s...`)
      await sleep(RETRY_WAIT_MS)
      photo = await fetchPhoto(college.name, city)
      if (photo === "__RATE_LIMITED__") {
        console.log(`  [429] Still rate limited — skipping ${college.name}`)
        continue
      }
    }

    if (photo && photo !== "__RATE_LIMITED__") {
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

    if ((i + 1) % 100 === 0) {
      console.log(`[${i + 1}/${total}] complete`)
    }

    await sleep(DELAY_MS)
  }

  console.log(`\nDone — ${updated} updated out of ${total} total`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
