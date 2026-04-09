import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

export const maxDuration = 60

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 })

  const supabase = createClient(url, key)
  const resend = new Resend(process.env.RESEND_API_KEY)

  const today = new Date()
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const todayStr = today.toISOString().split("T")[0]
  const weekStr = weekFromNow.toISOString().split("T")[0]

  // Get upcoming incomplete tasks
  const { data: tasks } = await supabase
    .from("student_checklist")
    .select("user_id, task, due_date, college_name")
    .eq("completed", false)
    .gte("due_date", todayStr)
    .lte("due_date", weekStr)
    .order("due_date", { ascending: true })

  if (!tasks || tasks.length === 0) {
    return NextResponse.json({ sent: 0, message: "No upcoming tasks" })
  }

  // Group by user
  const byUser = new Map<string, typeof tasks>()
  for (const t of tasks) {
    if (!byUser.has(t.user_id)) byUser.set(t.user_id, [])
    byUser.get(t.user_id)!.push(t)
  }

  let sent = 0

  for (const [userId, userTasks] of Array.from(byUser.entries())) {
    // Get user email
    const { data: userData } = await supabase.auth.admin.getUserById(userId)
    if (!userData?.user?.email) continue

    const email = userData.user.email
    const firstName = email.split("@")[0].split(/[._-]/)[0]
    const name = firstName.charAt(0).toUpperCase() + firstName.slice(1)

    const taskList = userTasks
      .map(t => {
        const date = new Date(t.due_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
        return `• ${t.task}${t.college_name ? ` (${t.college_name})` : ""} — due ${date}`
      })
      .join("\n")

    try {
      await resend.emails.send({
        from: "KidToCollege <hello@kidtocollege.com>",
        to: email,
        subject: "Your college deadlines this week — KidToCollege",
        text: `Hi ${name},\n\nHere's what's coming up on your college plan this week:\n\n${taskList}\n\nLog in to mark tasks complete and see your full plan.\nhttps://www.kidtocollege.com/coach/checklist\n\n— KidToCollege`,
      })
      sent++
    } catch {
      // Skip failed emails
    }
  }

  return NextResponse.json({ sent, users: byUser.size })
}
