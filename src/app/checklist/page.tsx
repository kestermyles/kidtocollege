import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ChecklistBoard from '@/components/checklist/ChecklistBoard'

export const metadata = {
  title: 'College Planning Checklist',
  description: 'Track your grade-by-grade college planning tasks in one place.',
}

function gradeFromGradYear(gradYear: number | null | undefined, today = new Date()): string {
  if (!gradYear) return '12'
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  // Academic year starts in August. Before Aug, current calendar year is the year they finish.
  const diff = gradYear - year
  const offset = month >= 8 ? -1 : 0
  const grade = 12 - (diff + offset)
  if (grade === 11 && month >= 6 && month <= 7) return 'summer-before-12'
  if (grade <= 9) return '9'
  if (grade >= 12) return '12'
  return String(grade)
}

export default async function ChecklistPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [tasksRes, progressRes, profileRes] = await Promise.all([
    supabase
      .from('checklist_tasks')
      .select('*')
      .order('grade_level', { ascending: true })
      .order('ideal_completion_month', { ascending: true, nullsFirst: false })
      .order('priority', { ascending: true }),
    supabase
      .from('student_checklist_progress')
      .select('task_id, completed, completed_at')
      .eq('user_id', user.id),
    supabase
      .from('profiles')
      .select('grad_year')
      .eq('id', user.id)
      .maybeSingle(),
  ])

  const defaultGrade = gradeFromGradYear(profileRes.data?.grad_year)

  return (
    <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-navy">
          What should I be doing right now?
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          71 specific things admissions readers look at when evaluating
          your application — from GPA and test scores to clubs, leadership,
          service, summer programs, awards, and recommendations. Tagged by
          grade so you only see what&apos;s relevant now. Check things off as
          you do them.
        </p>
      </div>

      {/* What this covers strip — clarifies scope so students don't think
          this is just paperwork */}
      <div className="mb-8 bg-cream rounded-lg p-5 border border-card">
        <h2 className="font-mono-label text-xs uppercase tracking-wider text-gold mb-3">
          This isn&apos;t just paperwork
        </h2>
        <p className="font-body text-sm text-navy/80 leading-relaxed mb-3">
          Most college-prep checklists only cover the application process
          (file FAFSA, take the SAT, submit Common App). This one also covers
          what admissions readers actually weigh when deciding{" "}
          <em>who you are</em>:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-navy/70">
          <li>✦ Extracurriculars and depth</li>
          <li>✦ Leadership and impact</li>
          <li>✦ Community service</li>
          <li>✦ Summer jobs, internships, programs</li>
          <li>✦ Academic awards and competitions</li>
          <li>✦ Teacher relationships (for recommendations)</li>
          <li>✦ Essays and your personal story</li>
          <li>✦ Logistics: tests, forms, deadlines, visits</li>
        </ul>
      </div>

      <ChecklistBoard
        tasks={tasksRes.data ?? []}
        initialProgress={progressRes.data ?? []}
        defaultGrade={defaultGrade}
      />
    </main>
  )
}
