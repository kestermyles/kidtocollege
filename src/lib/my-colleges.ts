'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMyColleges(userId: string) {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('user_college_list')
    .select(`
      id, position, status, added_at,
      college_id,
      colleges (
        id, name, slug, city, state,
        admission_rate, avg_net_price,
        sat_math_75, sat_reading_75, act_75,
        photo_url
      )
    `)
    .eq('user_id', userId)
    .order('position', { ascending: true })
  return data ?? []
}

export async function addCollegeToList(userId: string, collegeId: string) {
  const supabase = createServerClient()
  const { data: existing } = await supabase
    .from('user_college_list')
    .select('position')
    .eq('user_id', userId)
    .order('position', { ascending: false })
    .limit(1)
  const nextPosition = (existing?.[0]?.position ?? -1) + 1
  const { error } = await supabase.from('user_college_list').insert({
    user_id: userId,
    college_id: collegeId,
    position: nextPosition
  })
  if (error) throw error
  revalidatePath('/my-colleges')
}

export async function removeCollegeFromList(userId: string, collegeId: string) {
  const supabase = createServerClient()
  await supabase
    .from('user_college_list')
    .delete()
    .eq('user_id', userId)
    .eq('college_id', collegeId)
  revalidatePath('/my-colleges')
}

export async function reorderColleges(userId: string, orderedIds: string[]) {
  const supabase = createServerClient()
  const updates = orderedIds.map((id, index) => ({
    id,
    user_id: userId,
    position: index
  }))
  await supabase.from('user_college_list').upsert(updates)
}

export async function updateCollegeStatus(userId: string, entryId: string, status: string) {
  const supabase = createServerClient()
  await supabase
    .from('user_college_list')
    .update({ status })
    .eq('id', entryId)
    .eq('user_id', userId)
  revalidatePath('/my-colleges')
}
