import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { renderChecklistReminder, type ReminderTask } from "@/emails/checklistReminder"

export const maxDuration = 60

const MS_PER_DAY = 24 * 60 * 60 * 1000

type TaskRow = ReminderTask & {
  grade_level: string
  reminder_days_before: number | null
}

function gradeFromGradYear(gradYear: number | null | undefined, today: Date): string | null {
  if (!gradYear) return null
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const diff = gradYear - year
  const offset = month >= 8 ? -1 : 0
  const grade = 12 - (diff + offset)
  if (grade === 11 && month >= 6 && month <= 7) return 'summer-before-12'
  if (grade <= 9) return '9'
  if (grade >= 12) return '12'
  return String(grade)
}

// For a task with ideal_completion_month M (1-12), compute the target Date
// in the user's current academic year (year runs Aug → Jul).
function taskTargetDate(idealMonth: number, today: Date): Date {
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const yearStart = month >= 8 ? year : year - 1
  const targetYear = idealMonth >= 8 ? yearStart : yearStart + 1
  return new Date(targetYear, idealMonth - 1, 1)
}

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

  const { data: tasks, error: tasksErr } = await supabase
    .from("checklist_tasks")
    .select(
      "task_id, grade_level, task_title, task_description, priority, ideal_completion_month, reminder_days_before, related_tool_url",
    )
    .not("ideal_completion_month", "is", null)
    .not("reminder_days_before", "is", null)

  if (tasksErr || !tasks) {
    return NextResponse.json({ error: tasksErr?.message ?? "Failed to load tasks" }, { status: 500 })
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, grad_year")
    .not("grad_year", "is", null)

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ sent: 0, message: "No users with grad_year set" })
  }

  const userIds = profiles.map(p => p.id)
  const { data: progress } = await supabase
    .from("student_checklist_progress")
    .select("user_id, task_id, completed, reminder_sent")
    .in("user_id", userIds)

  const progressIndex = new Map<string, { completed: boolean; reminder_sent: boolean }>()
  for (const p of progress ?? []) {
    progressIndex.set(`${p.user_id}:${p.task_id}`, {
      completed: p.completed,
      reminder_sent: p.reminder_sent,
    })
  }

  let sentCount = 0
  let scannedUsers = 0
  const errors: string[] = []

  for (const profile of profiles) {
    scannedUsers++
    const grade = gradeFromGradYear(profile.grad_year, today)
    if (!grade) continue

    const userTasks: TaskRow[] = []
    for (const t of tasks as TaskRow[]) {
      if (t.grade_level !== grade) continue
      if (!t.ideal_completion_month || !t.reminder_days_before) continue
      const target = taskTargetDate(t.ideal_completion_month, today)
      const reminderDate = new Date(target.getTime() - t.reminder_days_before * MS_PER_DAY)
      if (today < reminderDate || today > target) continue
      const prog = progressIndex.get(`${profile.id}:${t.task_id}`)
      if (prog?.completed) continue
      if (prog?.reminder_sent) continue
      userTasks.push(t)
    }

    if (userTasks.length === 0) continue

    const { data: userData } = await supabase.auth.admin.getUserById(profile.id)
    const email = userData?.user?.email
    if (!email) continue

    const firstName = email.split("@")[0].split(/[._-]/)[0]
    const name = firstName.charAt(0).toUpperCase() + firstName.slice(1)

    const { subject, html, text } = renderChecklistReminder({ name, tasks: userTasks })

    try {
      await resend.emails.send({
        from: "KidToCollege <hello@kidtocollege.com>",
        to: email,
        subject,
        html,
        text,
      })
      sentCount++

      const now = new Date().toISOString()
      const upserts = userTasks.map(t => ({
        user_id: profile.id,
        task_id: t.task_id,
        completed: false,
        reminder_sent: true,
        reminder_sent_at: now,
        updated_at: now,
      }))
      const { error: upErr } = await supabase
        .from("student_checklist_progress")
        .upsert(upserts, { onConflict: "user_id,task_id" })
      if (upErr) errors.push(`Upsert for ${profile.id}: ${upErr.message}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      errors.push(`Send for ${email}: ${msg}`)
    }
  }

  return NextResponse.json({
    sent: sentCount,
    scanned: scannedUsers,
    errors: errors.length ? errors : undefined,
  })
}
