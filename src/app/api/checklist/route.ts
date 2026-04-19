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

  const [tasksRes, progressRes] = await Promise.all([
    supabase
      .from("checklist_tasks")
      .select("*")
      .order("grade_level", { ascending: true })
      .order("ideal_completion_month", { ascending: true, nullsFirst: false })
      .order("priority", { ascending: true }),
    supabase
      .from("student_checklist_progress")
      .select("task_id, completed, completed_at")
      .eq("user_id", userId),
  ])

  if (tasksRes.error) {
    return NextResponse.json({ error: tasksRes.error.message }, { status: 500 })
  }

  return NextResponse.json({
    tasks: tasksRes.data ?? [],
    progress: progressRes.data ?? [],
  })
}

export async function POST(req: NextRequest) {
  const { supabase, userId } = await getSupabaseWithUser()
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { taskId, completed } = body as { taskId?: string; completed?: boolean }

  if (!taskId || typeof completed !== "boolean") {
    return NextResponse.json({ error: "taskId and completed required" }, { status: 400 })
  }

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from("student_checklist_progress")
    .upsert(
      {
        user_id: userId,
        task_id: taskId,
        completed,
        completed_at: completed ? now : null,
        updated_at: now,
      },
      { onConflict: "user_id,task_id" },
    )
    .select("task_id, completed, completed_at")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ progress: data })
}
