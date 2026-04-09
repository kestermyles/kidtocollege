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
    .from("student_checklist")
    .select("*")
    .eq("user_id", userId)
    .order("due_date", { ascending: true })

  return NextResponse.json({ tasks: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  const { supabase, userId } = await getSupabaseWithUser()
  if (!supabase || !userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { taskId, completed } = await req.json()
  if (!taskId) return NextResponse.json({ error: "taskId required" }, { status: 400 })

  await supabase
    .from("student_checklist")
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", taskId)
    .eq("user_id", userId)

  return NextResponse.json({ ok: true })
}
