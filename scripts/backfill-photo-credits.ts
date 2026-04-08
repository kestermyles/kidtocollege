/**
 * Backfill photo_credit_name and photo_credit_url for colleges
 * that already have a photo_url but no credit data.
 *
 * Extracts the Unsplash photo ID from the existing photo_url
 * and fetches photographer info via GET /photos/{id}.
 *
 * Usage:
 *   npx tsx scripts/backfill-photo-credits.ts
 */

import { config } from "dotenv"
config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!
const DELAY_MS = 200
const MAX_PER_RUN = 40

function extractPhotoId(photoUrl: string): string | null {
  // URL: https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&q=80
  // Strip query params, take last path segment, strip "photo-" prefix
  try {
    const withoutParams = photoUrl.split("?")[0]
    const segments = withoutParams.split("/")
    const lastSegment = segments[segments.length - 1]
    if (!lastSegment || !lastSegment.startsWith("photo-")) return null
    return lastSegment.replace("photo-", "")
  } catch {
    return null
  }
}

async function getPhotoCredit(
  photoId: string
): Promise<{ name: string; url: string } | "__RATE_LIMITED__" | null> {
  const res = await fetch(`https://api.unsplash.com/photos/${photoId}`, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  })
  if (res.status === 403 || res.status === 429) return "__RATE_LIMITED__"
  if (!res.ok) return null
  const data = await res.json()
  const name = data.user?.name
  const url = data.user?.links?.html
  if (name && url) return { name, url }
  return null
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error("UNSPLASH_ACCESS_KEY not set in .env.local")
    process.exit(1)
  }

  const { data: colleges, error } = await supabase
    .from("colleges")
    .select("slug, name, photo_url")
    .not("photo_url", "is", null)
    .neq("photo_url", "")
    .is("photo_credit_name", null)
    .order("name")
    .limit(MAX_PER_RUN)

  if (error || !colleges) {
    console.error("Fetch failed:", error)
    process.exit(1)
  }

  console.log(`Found ${colleges.length} colleges needing photo credits (max ${MAX_PER_RUN} per run)`)

  let updated = 0
  let skipped = 0

  for (const college of colleges) {
    const photoId = extractPhotoId(college.photo_url)
    if (!photoId) {
      console.log(`  [skip] ${college.name} — can't extract photo ID from ${college.photo_url}`)
      skipped++
      continue
    }

    const credit = await getPhotoCredit(photoId)
    if (credit === "__RATE_LIMITED__") {
      console.log(`\n  Rate limit hit after ${updated} updates. Run again in 1 hour.`)
      break
    }
    if (credit) {
      await supabase
        .from("colleges")
        .update({
          photo_credit_name: credit.name,
          photo_credit_url: credit.url,
        })
        .eq("slug", college.slug)
      console.log(`  [ok] ${college.name} — Photo by ${credit.name}`)
      updated++
    } else {
      console.log(`  [skip] ${college.name} — no user data in response`)
      skipped++
    }

    await sleep(DELAY_MS)
  }

  console.log(`\nDone! ${updated} updated, ${skipped} skipped`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
