import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getStudentContext(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return ""

  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(url, key, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set() {}, remove() {},
      },
    })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return ""

    const { data: goals } = await supabase
      .from("student_goals")
      .select("graduation_year, current_gpa, sat_score, act_score, intended_major, target_colleges")
      .eq("user_id", user.id)
      .single()

    if (!goals) return ""

    const colleges = (goals.target_colleges as { name: string }[] || []).map(c => c.name).join(", ")

    const parts = [
      `Student context: graduating ${goals.graduation_year || "unknown"}`,
      goals.current_gpa ? `GPA ${goals.current_gpa}` : null,
      goals.sat_score ? `SAT ${goals.sat_score}` : null,
      goals.act_score ? `ACT ${goals.act_score}` : null,
      colleges ? `target colleges: ${colleges}` : null,
      goals.intended_major ? `intended major: ${goals.intended_major}` : null,
    ].filter(Boolean).join(", ")

    return `${parts}. Tailor all responses to this student's specific situation and target schools.`
  } catch {
    return ""
  }
}
