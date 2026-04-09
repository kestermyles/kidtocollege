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
      set() {}, remove() {},
    },
  })
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

export async function GET() {
  const { supabase, userId } = await getSupabaseWithUser()
  if (!supabase || !userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data } = await supabase
    .from("student_goals")
    .select("*")
    .eq("user_id", userId)
    .single()

  return NextResponse.json({ goals: data })
}

export async function POST(req: NextRequest) {
  const { supabase, userId } = await getSupabaseWithUser()
  if (!supabase || !userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { error } = await supabase.from("student_goals").upsert({
    user_id: userId,
    graduation_year: body.graduation_year,
    current_gpa: body.current_gpa,
    sat_score: body.sat_score || null,
    act_score: body.act_score || null,
    intended_major: body.intended_major,
    target_colleges: body.target_colleges || [],
    application_strategy: body.application_strategy || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
