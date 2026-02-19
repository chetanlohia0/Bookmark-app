import { createClient } from './supabaseClient'

export type Collection = {
  id: string
  name: string
  user_id: string
  created_at: string
}

export async function fetchCollections(userId: string): Promise<Collection[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  return data ?? []
}

export async function createCollection(userId: string, name: string): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase
    .from('collections')
    .insert({ user_id: userId, name: name.trim() })
  return { error: error?.message ?? null }
}

export async function deleteCollection(id: string): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id)
  return { error: error?.message ?? null }
}