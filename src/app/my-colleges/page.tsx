import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getMyColleges } from '@/lib/my-colleges'
import CollegeListBoard from '@/components/my-colleges/CollegeListBoard'

export const metadata = {
  title: 'My College List | KidToCollege',
  description: 'Track and compare your shortlisted colleges in one place.'
}

export default async function MyCollegesPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [colleges, profileResult] = await Promise.all([
    getMyColleges(user.id),
    supabase.from('profiles').select('sat_total, act_score, gpa, home_zip').eq('id', user.id).single()
  ])

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My College List</h1>
        <p className="text-gray-500 mt-1">Add up to 20 colleges, drag to reorder, track your applications</p>
      </div>
      <CollegeListBoard
        initialItems={colleges}
        userId={user.id}
        userProfile={profileResult.data}
      />
    </main>
  )
}
