import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getMyColleges } from '@/lib/my-colleges'
import CollegeListBoard from '@/components/my-colleges/CollegeListBoard'

export const metadata = {
  title: 'My College List',
  description: 'Track and compare your shortlisted colleges in one place.'
}

export default async function MyCollegesPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const colleges = await getMyColleges(user.id)

  // Try to get home_zip from the user's most recent search
  let homeCity = ''
  const { data: recentSearch } = await supabase
    .from('searches')
    .select('state')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  if (recentSearch?.state) homeCity = recentSearch.state

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My College List</h1>
        <p className="text-gray-500 mt-1">Add up to 20 colleges, drag to reorder, track your applications</p>
      </div>
      <CollegeListBoard
        initialItems={colleges}
        homeCity={homeCity}
      />
    </main>
  )
}
