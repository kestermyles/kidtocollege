import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export const runtime = "nodejs"

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "")
}

async function getSupabaseWithUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return { supabase: null, userId: null }

  const cookieStore = await cookies()
  const supabase = createServerClient(url, key, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value },
      set() {},
      remove() {},
    },
  })
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null, userCreatedAt: user?.created_at ?? null }
}

export async function POST(req: NextRequest) {
  const { supabase, userId, userCreatedAt } = await getSupabaseWithUser()
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, body: questionBody } = await req.json()
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title required" }, { status: 400 })
  }
  if (title.length > 200) {
    return NextResponse.json({ error: "Title too long" }, { status: 400 })
  }

  const svcUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const svc = createClient(svcUrl, svcKey)

  // Account age check: must be >60s old
  if (userCreatedAt) {
    const age = Date.now() - new Date(userCreatedAt).getTime()
    if (age < 60_000) {
      return NextResponse.json(
        { error: "Please wait a moment before posting." },
        { status: 429 }
      )
    }
  }

  const today = new Date().toISOString().split("T")[0]

  // User rate limit: 3/day
  const { data: userUsage } = await svc
    .from("api_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("date", today)
    .eq("api", "community_question")
    .single()

  if (userUsage && userUsage.count >= 3) {
    return NextResponse.json(
      { error: "You've asked 3 questions today — come back tomorrow." },
      { status: 429 }
    )
  }

  // IP rate limit: 5/day
  const ip = getIp(req)
  const { data: ipUsage } = await svc
    .from("api_usage")
    .select("count")
    .eq("user_id", ip)
    .eq("date", today)
    .eq("api", "community_question_ip")
    .single()

  if (ipUsage && ipUsage.count >= 5) {
    return NextResponse.json(
      { error: "Too many questions from this network today." },
      { status: 429 }
    )
  }

  // Generate unique slug
  let slug = generateSlug(title)
  let suffix = 0
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix + 1}`
    const { data: existing } = await svc
      .from("community_questions")
      .select("id")
      .eq("slug", candidate)
      .single()
    if (!existing) {
      slug = candidate
      break
    }
    suffix++
  }

  // Insert question
  const { data: question, error } = await svc
    .from("community_questions")
    .insert({
      slug,
      title: title.trim(),
      body: questionBody?.trim() || null,
      user_id: userId,
    })
    .select("id, slug")
    .single()

  if (error || !question) {
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 })
  }

  // Upsert usage counters
  await Promise.all([
    svc.from("api_usage").upsert(
      { user_id: userId, date: today, api: "community_question", count: (userUsage?.count ?? 0) + 1 },
      { onConflict: "user_id,date,api" }
    ),
    svc.from("api_usage").upsert(
      { user_id: ip, date: today, api: "community_question_ip", count: (ipUsage?.count ?? 0) + 1 },
      { onConflict: "user_id,date,api" }
    ),
  ])

  // Fire Sam answer non-blocking
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kidtocollege.com"
  Promise.resolve(
    fetch(`${baseUrl}/api/community/sam-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: question.id,
        title: title.trim(),
        body: questionBody?.trim() || "",
      }),
    })
  ).catch(() => {})

  return NextResponse.json({ slug: question.slug })
}
