'use client'
import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabaseClient'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkCard from '@/components/BookmarkCard'
import ControlsSection from '@/components/ControlsSection'
import StatsBar from '@/components/StatsBar'
import Sidebar from '@/components/Sidebar'
import { Collection } from '@/lib/collectionActions'

type Bookmark = {
  id: string; title: string; url: string; created_at: string
  user_id: string; notes: string; click_count: number; collection_id: string | null
}

export default function DashboardClient({
  userId, initialBookmarks, initialCollections,
}: {
  userId: string; initialBookmarks: Bookmark[]; initialCollections: Collection[]
}) {
  const supabase = createClient()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [collections, setCollections] = useState<Collection[]>(initialCollections)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [filter, setFilter] = useState('all')
  const [activeCollection, setActiveCollection] = useState<string | null>(null)

  // Realtime — bookmarks
  useEffect(() => {
    const channel = supabase.channel('bookmarks-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${userId}` },
        payload => setBookmarks(prev => [payload.new as Bookmark, ...prev]))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookmarks' },
        payload => setBookmarks(prev => prev.map(b => b.id === payload.new.id ? payload.new as Bookmark : b)))
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bookmarks' },
        payload => {
          console.log('DELETE payload:', payload)
          console.log('old id:', payload.old.id)
          setBookmarks(prev => prev.filter(b => b.id !== payload.old.id))
        })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId])

  // Realtime — collections (fixed: no filter on DELETE)
  useEffect(() => {
  const channel = supabase.channel('collections-realtime')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'collections' },
      payload => {
        const newCol = payload.new as Collection
        if (newCol.user_id === userId) {
          setCollections(prev => [...prev, newCol])
        }
      })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'collections' },
      payload => {
        console.log('DELETE payload:', payload)
        console.log('old id:', payload.old.id)
        setCollections(prev => prev.filter(c => c.id !== payload.old.id))
      })
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}, [userId])

  const domains = useMemo(() => {
    const all = bookmarks.map(b => { try { return new URL(b.url).hostname } catch { return null } }).filter(Boolean) as string[]
    return [...new Set(all)]
  }, [bookmarks])

  const filtered = useMemo(() => {
    let result = [...bookmarks]
    if (activeCollection) result = result.filter(b => b.collection_id === activeCollection)
    if (search) result = result.filter(b => b.title.toLowerCase().includes(search.toLowerCase()))
    if (filter !== 'all') result = result.filter(b => { try { return new URL(b.url).hostname === filter } catch { return false } })
    switch (sort) {
      case 'oldest': result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break
      case 'az': result.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'za': result.sort((a, b) => b.title.localeCompare(a.title)); break
      case 'clicks': result.sort((a, b) => (b.click_count || 0) - (a.click_count || 0)); break
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    return result
  }, [bookmarks, search, sort, filter, activeCollection])

  return (
  <div className="app-shell">
    <Sidebar
      userId={userId} collections={collections}
      activeCollection={activeCollection} setActiveCollection={setActiveCollection}
      totalBookmarks={bookmarks.length}
    />
    <main className="main-content">
      <StatsBar bookmarks={bookmarks} />
      <BookmarkForm userId={userId} collections={collections} existingBookmarks={bookmarks} />
      <ControlsSection
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        filter={filter} setFilter={setFilter}
        domains={domains} total={filtered.length}
      />
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔖</div>
          <p className="empty-text font-display">
            {activeCollection ? 'No bookmarks in this collection yet.' : 'No bookmarks yet. Add your first one!'}
          </p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map(b => <BookmarkCard key={b.id} bookmark={b} collections={collections} />)}
        </div>
      )}
    </main>
  </div>
)
}