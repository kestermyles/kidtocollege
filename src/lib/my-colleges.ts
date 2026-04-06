import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function getMyColleges(userId: string) {
  const supabase = createServerSupabaseClient()

  // Get user's list
  const { data: list } = await supabase
    .from('college_lists')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!list) return []

  const { data } = await supabase
    .from('college_list_items')
    .select(`
      id, college_slug, category, application_status, notes, added_at,
      colleges (
        name, slug, location, state,
        acceptance_rate, avg_cost_instate,
        photo_url
      )
    `)
    .eq('list_id', list.id)
    .order('added_at', { ascending: true })

  return data ?? []
}
