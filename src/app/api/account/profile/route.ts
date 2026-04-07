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

  const { data: profile } = await supabase
    .from("profiles")
    .select("city, state_abbr, high_school, grad_year, first_choice_college")
    .eq("id", userId)
    .single()

  return NextResponse.json({ profile: profile ?? {} })
}

export async function PATCH(req: NextRequest) {
  const { supabase, userId } = await getSupabaseWithUser()
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const allowed = ["city", "state_abbr", "high_school", "grad_year", "first_choice_college"]
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key] || null
  }

  // Upsert profile
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() }, { onConflict: "id" })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
