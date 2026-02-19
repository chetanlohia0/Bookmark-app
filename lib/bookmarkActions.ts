import { createClient } from './supabaseClient'
import { normalizeUrl } from './utils'

// Add bookmark with duplicate check
export async function addBookmark({
  userId,
  title,
  url,
  notes,
  collectionId,
  existingBookmarks,
}: {
  userId: string
  title: string 
  url: string
  notes: string
  collectionId: string | null
  existingBookmarks: { url: string }[]
}): Promise<{ error: string | null }> {
  const supabase = createClient()

  let finalUrl = url.trim()
  if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl

  // Duplicate check
  const normalized = normalizeUrl(finalUrl)
  const isDuplicate = existingBookmarks.some(
    b => normalizeUrl(b.url) === normalized
  )
  if (isDuplicate) return { error: 'You already saved this URL' }

  const { error } = await supabase.from('bookmarks').insert({
    user_id: userId,
    title: title.trim(),
    url: finalUrl,
    notes: notes.trim(),
    collection_id: collectionId || null,
  })

  return { error: error?.message ?? null }
}

// Edit bookmark
export async function editBookmark({
  id,
  title,
  url,
  notes,
  collectionId,
}: {
  id: string
  title: string
  url: string
  notes: string
  collectionId: string | null
}): Promise<{ error: string | null }> {
  const supabase = createClient()

  let finalUrl = url.trim()
  if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl

  const { error } = await supabase
    .from('bookmarks')
    .update({
      title: title.trim(),
      url: finalUrl,
      notes: notes.trim(),
      collection_id: collectionId || null,
    })
    .eq('id', id)

  return { error: error?.message ?? null }
}

// Increment click count
export async function incrementClick(id: string, currentCount: number) {
  const supabase = createClient()
  await supabase
    .from('bookmarks')
    .update({ click_count: currentCount + 1 })
    .eq('id', id)
}

// Delete bookmark
export async function deleteBookmark(id: string): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase.from('bookmarks').delete().eq('id', id)
  return { error: error?.message ?? null }
}