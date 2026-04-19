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
        <h1 className="font-display text-3xl font-bold text-navy">College Planning Checklist</h1>
        <p className="text-gray-500 mt-1">Track your progress grade by grade</p>
      </div>
      <ChecklistBoard
        tasks={tasksRes.data ?? []}
        initialProgress={progressRes.data ?? []}
        defaultGrade={defaultGrade}
      />
    </main>
  )
}
