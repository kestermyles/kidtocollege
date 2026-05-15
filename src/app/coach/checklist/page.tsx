/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase-browser"
import { CheckCircle2, Circle } from "lucide-react"

const CATEGORY_ORDER = ["Research", "Test Prep", "Essays", "Applications", "Financial Aid"]

function formatDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function daysUntil(d: string): number {
  return Math.ceil((new Date(d + "T00:00:00").getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

interface Task {
  id: string
  task: string
  category: string
  due_date: string | null
  college_name: string | null
  completed: boolean
}

export default function ChecklistPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [hasGoals, setHasGoals] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/account"); return }

      Promise.all([
        fetch("/api/coach/checklist").then(r => r.json()),
        fetch("/api/coach/goals").then(r => r.json()),
      ]).then(([checklistData, goalsData]) => {
        setTasks(checklistData.tasks || [])
        setHasGoals(!!goalsData.goals)
        setLoading(false)
      })
    })
  }, [router])

  const toggleTask = async (taskId: string, completed: boolean) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed } : t))
    await fetch("/api/coach/checklist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, completed }),
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (!hasGoals || tasks.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <h1 className="font-display text-2xl font-bold text-navy mb-3">Your college plan</h1>
          <p className="font-body text-navy/50 mb-6">Set up your goals to generate your personalized plan.</p>
          <Link href="/coach/goals" className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-3 rounded-md transition-colors text-sm">
            Set up your goals &rarr;
          </Link>
        </div>
      </div>
    )
  }

  const completed = tasks.filter(t => t.completed).length
  const total = tasks.length

  const grouped = new Map<string, Task[]>()
  for (const cat of CATEGORY_ORDER) grouped.set(cat, [])
  for (const t of tasks) {
    const list = grouped.get(t.category)
    if (list) list.push(t)
    else grouped.set(t.category, [t])
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy">Your college plan</h1>
            <p className="font-body text-sm text-navy/50 mt-1">{completed} of {total} tasks complete</p>
          </div>
          <Link href="/coach/goals" className="font-body text-sm text-gold hover:text-gold/80 font-medium">
            Edit goals &rarr;
          </Link>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-navy/10 rounded-full overflow-hidden mb-8">
          <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }} />
        </div>

        {CATEGORY_ORDER.map(cat => {
          const catTasks = grouped.get(cat) || []
          if (catTasks.length === 0) return null

          return (
            <section key={cat} className="mb-8">
              <h2 className="font-display text-lg font-bold text-navy mb-3">{cat}</h2>
              <div className="space-y-1.5">
                {catTasks.map(t => {
                  const days = t.due_date ? daysUntil(t.due_date) : null
                  const isOverdue = days !== null && days < 0 && !t.completed
                  const isDueSoon = days !== null && days >= 0 && days <= 14 && !t.completed

                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTask(t.id, !t.completed)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                        t.completed ? "bg-gray-50" : isOverdue ? "bg-red-50" : isDueSoon ? "bg-amber-50" : "hover:bg-cream/50"
                      }`}
                    >
                      {t.completed ? (
                        <CheckCircle2 size={18} className="text-gold flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle size={18} className={`flex-shrink-0 mt-0.5 ${isOverdue ? "text-red-400" : isDueSoon ? "text-amber-400" : "text-navy/20"}`} />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className={`font-body text-sm ${t.completed ? "text-navy/40 line-through" : "text-navy"}`}>
                          {t.task}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {t.college_name && (
                            <span className="font-body text-xs text-navy/30">{t.college_name}</span>
                          )}
                          {t.due_date && (
                            <span className={`font-body text-xs ${isOverdue ? "text-red-500 font-medium" : isDueSoon ? "text-amber-600" : "text-navy/30"}`}>
                              {isOverdue ? `Overdue — ${formatDate(t.due_date)}` : formatDate(t.due_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
