'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

async function getOrCreateList(userId: string) {
  const supabase = createServerSupabaseClient()
  let { data: list } = await supabase
    .from('college_lists')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!list) {
    const { data: newList } = await supabase
      .from('college_lists')
      .insert({ user_id: userId })
      .select('id')
      .single()
    list = newList
  }

  return { supabase, listId: list?.id ?? null }
}

export async function getMyColleges(userId: string) {
  const { supabase, listId } = await getOrCreateList(userId)
  if (!listId) return []

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
    .eq('list_id', listId)
    .order('added_at', { ascending: true })

  return data ?? []
}

export async function addCollegeToList(userId: string, collegeSlug: string) {
  const { supabase, listId } = await getOrCreateList(userId)
  if (!listId) throw new Error('Failed to create list')

  const { error } = await supabase
    .from('college_list_items')
    .upsert(
      { list_id: listId, college_slug: collegeSlug, category: 'unknown' },
      { onConflict: 'list_id,college_slug' }
    )

  if (error) throw error
  revalidatePath('/my-colleges')
}

export async function removeCollegeFromList(userId: string, itemId: string) {
  const { supabase, listId } = await getOrCreateList(userId)
  if (!listId) return

  await supabase
    .from('college_list_items')
    .delete()
    .eq('id', itemId)
    .eq('list_id', listId)

  revalidatePath('/my-colleges')
}

export async function updateCollegeStatus(userId: string, itemId: string, applicationStatus: string) {
  const { supabase, listId } = await getOrCreateList(userId)
  if (!listId) return

  await supabase
    .from('college_list_items')
    .update({ application_status: applicationStatus })
    .eq('id', itemId)
    .eq('list_id', listId)

  revalidatePath('/my-colleges')
}
