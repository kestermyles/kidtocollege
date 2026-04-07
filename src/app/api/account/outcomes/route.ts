import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const runtime = "nodejs"

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
  return { supabase, userId: user?.id ?? null }
}

export async function GET() {
  const { supabase, userId } = await getSupabaseWithUser()
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data } = await supabase
    .from("college_outcomes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return NextResponse.json({ outcomes: data ?? [] })
}

export async function PUT(req: NextRequest) {
  const { supabase, userId } = await getSupabaseWithUser()
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { college_slug, college_name, outcome, app_year } = await req.json()
  if (!college_slug || !outcome) {
    return NextResponse.json({ error: "college_slug and outcome required" }, { status: 400 })
  }

  const { error } = await supabase
    .from("college_outcomes")
    .upsert(
      { user_id: userId, college_slug, college_name, outcome, app_year: app_year || new Date().getFullYear() },
      { onConflict: "user_id,college_slug,app_year" }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
