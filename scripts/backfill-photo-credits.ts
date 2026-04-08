import { config } from "dotenv"
config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
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
    const photoId = college.photo_url.split("?")[0].split("/").pop()?.replace("photo-", "")
    if (!photoId) {
      console.log(`  [skip] ${college.name} — can't extract photo ID`)
      skipped++
      continue
    }

    const res = await fetch(`https://api.unsplash.com/photos/${photoId}`, {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    })

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
    const name = data.user?.name
    const url = data.user?.links?.html

    if (name && url) {
      await supabase
        .from("colleges")
        .update({ photo_credit_name: name, photo_credit_url: url })
        .eq("slug", college.slug)
      console.log(`  [ok] ${college.name} — Photo by ${name}`)
      updated++
    } else {
      console.log(`  [skip] ${college.name} — no user data`)
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
