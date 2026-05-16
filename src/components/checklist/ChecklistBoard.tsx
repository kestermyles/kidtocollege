'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  Check,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  FileText,
  DollarSign,
  MapPin,
  PenLine,
  Compass,
  Download,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'

type Task = {
  task_id: string
  grade_level: '9' | '10' | '11' | '12' | 'summer-before-12'
  task_category: 'testing' | 'applications' | 'financial_aid' | 'visits' | 'essays' | 'planning'
  task_title: string
  task_description: string
  ideal_completion_month: number | null
  priority: 'critical' | 'important' | 'recommended'
  related_tool_url: string | null
}

type Progress = {
  task_id: string
  completed: boolean
  completed_at: string | null
}

const GRADES: { value: Task['grade_level']; label: string }[] = [
  { value: '9', label: 'Freshman' },
  { value: '10', label: 'Sophomore' },
  { value: '11', label: 'Junior' },
  { value: 'summer-before-12', label: 'Summer Pre-Senior' },
  { value: '12', label: 'Senior' },
]

const CATEGORIES: { value: Task['task_category']; label: string; Icon: React.ComponentType<{ size?: number | string }> }[] = [
  { value: 'planning', label: 'Profile & Planning', Icon: Compass },
  { value: 'testing', label: 'Testing', Icon: GraduationCap },
  { value: 'applications', label: 'Applications & Recommendations', Icon: FileText },
  { value: 'essays', label: 'Essays', Icon: PenLine },
  { value: 'financial_aid', label: 'Financial Aid', Icon: DollarSign },
  { value: 'visits', label: 'Campus Visits', Icon: MapPin },
]

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PRIORITY_ORDER: Record<Task['priority'], number> = { critical: 0, important: 1, recommended: 2 }

// Converts calendar month (1-12) into academic-year month (Aug=0 ... Jul=11).
function academicMonthIndex(m: number | null): number | null {
  if (m == null) return null
  return m >= 8 ? m - 8 : m + 4
}

export default function ChecklistBoard({
  tasks,
  initialProgress,
  defaultGrade,
  isAnonymous = false,
}: {
  tasks: Task[]
  initialProgress: Progress[]
  defaultGrade: string
  isAnonymous?: boolean
}) {
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>(() => {
    const map: Record<string, Progress> = {}
    for (const p of initialProgress) map[p.task_id] = p
    return map
  })
  const [activeGrade, setActiveGrade] = useState<string>(defaultGrade)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [, startTransition] = useTransition()

  const currentMonth = new Date().getMonth() + 1
  const currentAcademicMonth = academicMonthIndex(currentMonth) ?? 0

  const allGradeTasks = useMemo(
    () => tasks.filter(t => t.grade_level === activeGrade),
    [tasks, activeGrade]
  )

  const gradeTasks = useMemo(() => {
    return allGradeTasks
      .filter(t => activeCategory === 'all' || t.task_category === activeCategory)
      .sort((a, b) => {
        const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        if (p !== 0) return p
        const am = academicMonthIndex(a.ideal_completion_month) ?? 99
        const bm = academicMonthIndex(b.ideal_completion_month) ?? 99
        return am - bm
      })
  }, [allGradeTasks, activeCategory])

  const completedCount = allGradeTasks.filter(t => progressMap[t.task_id]?.completed).length
  const pctComplete = allGradeTasks.length > 0
    ? Math.round((completedCount / allGradeTasks.length) * 100)
    : 0

  const toggleTask = (taskId: string) => {
    if (isAnonymous) {
      window.location.href = '/signup?next=/checklist'
      return
    }
    const current = progressMap[taskId]
    const nextCompleted = !current?.completed
    const optimistic: Progress = {
      task_id: taskId,
      completed: nextCompleted,
      completed_at: nextCompleted ? new Date().toISOString() : null,
    }
    const prev = current
    setProgressMap(m => ({ ...m, [taskId]: optimistic }))

    startTransition(async () => {
      try {
        const res = await fetch('/api/checklist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId, completed: nextCompleted }),
        })
        if (!res.ok) throw new Error(await res.text())
      } catch (e) {
        console.error('Failed to save checklist progress', e)
        setProgressMap(m => {
          const next = { ...m }
          if (prev) next[taskId] = prev
          else delete next[taskId]
          return next
        })
      }
    })
  }

  const toggleExpanded = (taskId: string) => {
    setExpanded(s => {
      const next = new Set(s)
      if (next.has(taskId)) next.delete(taskId)
      else next.add(taskId)
      return next
    })
  }

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 border-b border-card">
        {GRADES.map(g => {
          const active = g.value === activeGrade
          const isUserGrade = g.value === defaultGrade
          return (
            <button
              key={g.value}
              onClick={() => setActiveGrade(g.value)}
              className={`px-3 py-1.5 text-sm whitespace-nowrap rounded-full border transition-colors ${
                active
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-navy border-card hover:border-navy/40'
              }`}
            >
              {g.label}
              {isUserGrade && <span className="ml-1 text-[10px] opacity-75">● you</span>}
            </button>
          )
        })}
      </div>

      {!isAnonymous && (
        <div className="mb-5">
          <div className="flex items-baseline justify-between text-sm mb-1.5">
            <span className="font-medium text-navy">
              {GRADES.find(g => g.value === activeGrade)?.label} progress
            </span>
            <span className="text-gray-500">
              {completedCount} of {allGradeTasks.length} complete ({pctComplete}%)
            </span>
          </div>
          <div className="h-2 bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-sage transition-all duration-300"
              style={{ width: `${pctComplete}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
              activeCategory === 'all'
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-gray-600 border-card hover:border-navy/40'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(c => {
            const active = c.value === activeCategory
            return (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border transition-colors ${
                  active
                    ? 'bg-navy text-white border-navy'
                    : 'bg-white text-gray-600 border-card hover:border-navy/40'
                }`}
              >
                <c.Icon size={12} />
                {c.label}
              </button>
            )
          })}
        </div>
        <a
          href="/downloads/college-planning-checklist.pdf"
          download
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-navy border border-card rounded-full hover:border-navy/40 transition-colors"
        >
          <Download size={12} />
          Download PDF
        </a>
      </div>

      {gradeTasks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No tasks match this filter</p>
          <p className="text-sm mt-1">Try another category or switch grades</p>
        </div>
      ) : (
        <div className="space-y-2">
          {gradeTasks.map(task => {
            const progress = progressMap[task.task_id]
            const completed = !!progress?.completed
            const isExpanded = expanded.has(task.task_id)
            const taskAm = academicMonthIndex(task.ideal_completion_month)
            const isOverdue =
              !completed &&
              activeGrade === defaultGrade &&
              taskAm != null &&
              taskAm < currentAcademicMonth
            const cat = CATEGORIES.find(c => c.value === task.task_category)
            const Icon = cat?.Icon ?? Compass
            return (
              <div
                key={task.task_id}
                className={`border rounded-lg bg-white p-3 shadow-card transition-all ${
                  completed
                    ? 'border-card opacity-60'
                    : isOverdue
                    ? 'border-crimson/40'
                    : 'border-card'
                }`}
              >
                <div className="flex gap-3 items-start">
                  <button
                    onClick={() => toggleTask(task.task_id)}
                    className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      completed
                        ? 'bg-sage border-sage text-white'
                        : 'border-gray-300 hover:border-navy'
                    }`}
                    aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {completed && <Check size={14} strokeWidth={3} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-medium text-sm text-navy ${completed ? 'line-through' : ''}`}>
                        {task.task_title}
                      </h3>
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Icon size={12} /> {cat?.label}
                      </span>
                      {task.ideal_completion_month && (
                        <span>By {MONTH_NAMES[task.ideal_completion_month]}</span>
                      )}
                      {isOverdue && (
                        <span className="flex items-center gap-1 text-crimson font-medium">
                          <AlertTriangle size={12} /> Overdue
                        </span>
                      )}
                      {completed && progress?.completed_at && (
                        <span className="text-sage">
                          ✓ Completed {new Date(progress.completed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleExpanded(task.task_id)}
                      className="mt-2 flex items-center gap-1 text-xs text-navy/70 hover:text-navy"
                    >
                      {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      Why this matters
                    </button>

                    {isExpanded && (
                      <div className="mt-2 text-sm text-gray-700 leading-relaxed">
                        {task.task_description}
                        {task.related_tool_url && (
                          <div className="mt-2">
                            <a
                              href={task.related_tool_url}
                              className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:underline"
                            >
                              Open related tool <ExternalLink size={11} />
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PriorityBadge({ priority }: { priority: Task['priority'] }) {
  const styles: Record<Task['priority'], string> = {
    critical: 'bg-crimson/10 text-crimson border-crimson/20',
    important: 'bg-gold/10 text-gold border-gold/30',
    recommended: 'bg-gray-100 text-gray-600 border-gray-200',
  }
  const label = priority.charAt(0).toUpperCase() + priority.slice(1)
  return (
    <span
      className={`shrink-0 text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded border ${styles[priority]}`}
    >
      {label}
    </span>
  )
}
