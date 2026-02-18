'use client'
import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabaseClient'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkCard from '@/components/BookmarkCard'
import ControlsSection from '@/components/ControlsSection'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

export default function DashboardClient({
  userId,
  initialBookmarks,
}: {
  userId: string
  initialBookmarks: Bookmark[]
}) {
  const supabase = createClient()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [filter, setFilter] = useState('all')

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('bookmarks-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks(prev => [payload.new as Bookmark, ...prev])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
            console.log('DELETE payload:', payload)
            console.log('old id:', payload.old.id)
          setBookmarks(prev => prev.filter(b => b.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  const domains = useMemo(() => {
    const all = bookmarks.map(b => {
      try { return new URL(b.url).hostname } catch { return null }
    }).filter(Boolean) as string[]
    return [...new Set(all)]
  }, [bookmarks])

  const filtered = useMemo(() => {
    let result = [...bookmarks]

    if (search) {
      result = result.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (filter !== 'all') {
      result = result.filter(b => {
        try { return new URL(b.url).hostname === filter } catch { return false }
      })
    }

    switch (sort) {
      case 'oldest': result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break
      case 'az': result.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'za': result.sort((a, b) => b.title.localeCompare(a.title)); break
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return result
  }, [bookmarks, search, sort, filter])

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <BookmarkForm userId={userId} />
      <ControlsSection
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        filter={filter} setFilter={setFilter}
        domains={domains}
      />
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔖</p>
          <p className="text-lg">No bookmarks yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(b => <BookmarkCard key={b.id} bookmark={b} />)}
        </div>
      )}
    </main>
  )
}