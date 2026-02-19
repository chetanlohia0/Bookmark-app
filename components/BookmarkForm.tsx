'use client'
import { useState } from 'react'
import { addBookmark } from '@/lib/bookmarkActions'
import { Collection } from '@/lib/collectionActions'

export default function BookmarkForm({ userId, collections, existingBookmarks }: {
  userId: string; collections: Collection[]; existingBookmarks: { url: string }[]
}) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [collectionId, setCollectionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (!title.trim() || !url.trim()) { setError('Title and URL are required'); return }
    setLoading(true)
    const { error } = await addBookmark({ userId, title, url, notes, collectionId, existingBookmarks })
    if (error) setError(error)
    else { setTitle(''); setUrl(''); setNotes(''); setCollectionId(null); setExpanded(false) }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="form-title">Add Bookmark</h2>
        <button type="button" onClick={() => setExpanded(!expanded)} className="form-expand-btn">
          {expanded ? '▲ Less' : '▼ Notes & Collection'}
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Title</label>
          <input placeholder="e.g. Great article on design..." value={title}
            onChange={e => setTitle(e.target.value)} maxLength={100} />
        </div>
        <div className="form-field">
          <label className="form-label">URL</label>
          <input placeholder="github.com/..." value={url}
            onChange={e => setUrl(e.target.value)} />
        </div>
      </div>

      {expanded && (
        <>
          <div className="form-field">
            <label className="form-label">Notes</label>
            <textarea rows={2} placeholder="Why did you save this?" value={notes}
              onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Collection</label>
            <select value={collectionId ?? ''} onChange={e => setCollectionId(e.target.value || null)}>
              <option value="">No collection</option>
              {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </>
      )}

      <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
        {loading ? 'Saving...' : '+ Save Bookmark'}
      </button>
    </form>
  )
}