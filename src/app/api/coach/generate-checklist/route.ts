import { NextResponse } from "next/server"
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

function addDays(date: Date, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

interface TargetCollege {
  name: string
  slug: string
  strategy: string
  deadline: string // YYYY-MM-DD
}

function generateTasks(college: TargetCollege, gradYear: number) {
  const deadline = new Date(college.deadline)
  const tasks: { task: string; category: string; due_date: string; college_name: string }[] = []

  // Research — 3 months before
  const researchDate = addDays(deadline, -90)
  tasks.push(
    { task: `Research ${college.name} financial aid and net price calculator`, category: "Research", due_date: researchDate, college_name: college.name },
    { task: `Visit ${college.name} campus or attend virtual info session`, category: "Research", due_date: researchDate, college_name: college.name },
    { task: `Check ${college.name} Common Data Set — note need-met % and merit aid thresholds`, category: "Research", due_date: researchDate, college_name: college.name },
  )

  // Test Prep — 4 months before
  const testDate = addDays(deadline, -120)
  tasks.push(
    { task: "Register for next SAT/ACT sitting", category: "Test Prep", due_date: testDate, college_name: college.name },
    { task: `Complete 2 practice tests targeting ${college.name} score range`, category: "Test Prep", due_date: addDays(deadline, -90), college_name: college.name },
  )

  // Essays — 6 weeks before
  const essayDate = addDays(deadline, -42)
  tasks.push(
    { task: "Draft Common App personal statement", category: "Essays", due_date: essayDate, college_name: "" },
    { task: `Draft ${college.name} supplemental essays (check requirements)`, category: "Essays", due_date: essayDate, college_name: college.name },
    { task: "Submit essay draft to Coach for review", category: "Essays", due_date: addDays(deadline, -28), college_name: college.name },
  )

  // Applications — 2 weeks before
  const appDate = addDays(deadline, -14)
  tasks.push(
    { task: "Request letters of recommendation from 2 teachers", category: "Applications", due_date: addDays(deadline, -60), college_name: college.name },
    { task: `Complete ${college.name} application form`, category: "Applications", due_date: appDate, college_name: college.name },
    { task: "Review application with a parent or trusted adult", category: "Applications", due_date: addDays(deadline, -7), college_name: college.name },
    { task: `Submit ${college.name} application`, category: "Applications", due_date: college.deadline, college_name: college.name },
  )

  // Financial Aid — FAFSA opens Oct 1
  const fafsaYear = gradYear - 1
  const fafsaDate = `${fafsaYear}-10-01`
  tasks.push(
    { task: `File FAFSA — opens October 1, ${fafsaYear}`, category: "Financial Aid", due_date: fafsaDate, college_name: "" },
    { task: `File CSS Profile if required by ${college.name}`, category: "Financial Aid", due_date: fafsaDate, college_name: college.name },
    { task: "Compare financial aid award letters", category: "Financial Aid", due_date: addDays(deadline, 120), college_name: "" },
  )

  return tasks
}

export async function POST() {
  const { supabase, userId } = await getSupabaseWithUser()
  if (!supabase || !userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: goals } = await supabase
    .from("student_goals")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (!goals) return NextResponse.json({ error: "No goals set" }, { status: 404 })

  const colleges = (goals.target_colleges || []) as TargetCollege[]
  if (colleges.length === 0) return NextResponse.json({ error: "No target colleges" }, { status: 400 })

  // Clear existing checklist
  await supabase.from("student_checklist").delete().eq("user_id", userId)

  // Generate tasks for each college
  const allTasks: { task: string; category: string; due_date: string; college_name: string; user_id: string }[] = []
  const seen = new Set<string>()

  for (const college of colleges) {
    const tasks = generateTasks(college, goals.graduation_year)
    for (const t of tasks) {
      // Dedup generic tasks (e.g. Common App essay, FAFSA)
      const key = t.college_name ? `${t.task}` : `${t.task}-generic`
      if (!t.college_name && seen.has(key)) continue
      seen.add(key)
      allTasks.push({ ...t, user_id: userId })
    }
  }

  const { error } = await supabase.from("student_checklist").insert(allTasks)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, taskCount: allTasks.length })
}
