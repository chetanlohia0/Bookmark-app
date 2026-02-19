'use client'
import { useState } from 'react'
import { deleteBookmark, editBookmark, incrementClick } from '@/lib/bookmarkActions'
import { checkLink } from '@/lib/utils'
import { Collection } from '@/lib/collectionActions'

type Bookmark = {
  id: string; title: string; url: string; created_at: string
  notes: string; click_count: number; collection_id: string | null
}

export default function BookmarkCard({ bookmark, collections }: { bookmark: Bookmark; collections: Collection[] }) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [linkStatus, setLinkStatus] = useState<'idle'|'checking'|'ok'|'dead'|'unknown'>('idle')
  const [showNotes, setShowNotes] = useState(false)
  const [editTitle, setEditTitle] = useState(bookmark.title)
  const [editUrl, setEditUrl] = useState(bookmark.url)
  const [editNotes, setEditNotes] = useState(bookmark.notes || '')
  const [editCollectionId, setEditCollectionId] = useState(bookmark.collection_id)
  const [saving, setSaving] = useState(false)

  let domain = ''
  try { domain = new URL(bookmark.url).hostname } catch {}

  const handleCopy = () => { navigator.clipboard.writeText(bookmark.url); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await deleteBookmark(bookmark.id)
    if (error) { console.log('DELETE payload:', error); console.log('old id:', bookmark.id); setDeleting(false) }
  }
  const handleVisit = async () => {
    await incrementClick(bookmark.id, bookmark.click_count)
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
  }
  const handleCheckLink = async () => {
    setLinkStatus('checking')
    const s = await checkLink(bookmark.url)
    setLinkStatus(s)
    setTimeout(() => setLinkStatus('idle'), 5000)
  }
  const handleSaveEdit = async () => {
    setSaving(true)
    const { error } = await editBookmark({ id: bookmark.id, title: editTitle, url: editUrl, notes: editNotes, collectionId: editCollectionId })
    if (!error) setEditing(false)
    setSaving(false)
  }

  if (deleting) return null

  if (editing) return (
    <div className="edit-card">
      <p className="edit-label">Edit Bookmark</p>
      <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" />
      <input value={editUrl} onChange={e => setEditUrl(e.target.value)} placeholder="URL" />
      <textarea rows={2} value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Notes..." />
      <select value={editCollectionId ?? ''} onChange={e => setEditCollectionId(e.target.value || null)}>
        <option value="">No collection</option>
        {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSaveEdit} disabled={saving} className="btn-primary" style={{ flex: 1, padding: '8px' }}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
        <button onClick={() => setEditing(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="bookmark-card">
      <div className="card-header">
        <div className="card-favicon">
          <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt=""
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="card-title">{bookmark.title}</div>
          <div className="card-domain">{domain}</div>
        </div>
      </div>

      <button onClick={handleVisit} className="card-url">↗ {bookmark.url}</button>

      {linkStatus !== 'idle' && (
        <div className="card-link-status" style={{
          background: linkStatus === 'ok' ? 'rgba(74,222,128,0.07)' : linkStatus === 'dead' ? 'rgba(248,113,113,0.07)' : 'var(--bg3)',
          border: `1px solid ${linkStatus === 'ok' ? 'rgba(74,222,128,0.2)' : linkStatus === 'dead' ? 'rgba(248,113,113,0.2)' : 'var(--border)'}`,
          color: linkStatus === 'ok' ? 'var(--green)' : linkStatus === 'dead' ? 'var(--red)' : 'var(--text2)',
        }}>
          {linkStatus === 'checking' ? '⟳ Checking...' : linkStatus === 'ok' ? '✓ Link active' : linkStatus === 'dead' ? '✕ Link broken' : '? Cannot verify'}
        </div>
      )}

      {bookmark.notes && (
        <>
          <button className="card-notes-btn" onClick={() => setShowNotes(!showNotes)}>
            {showNotes ? '▲ Hide note' : '▼ View note'}
          </button>
          {showNotes && <p className="card-notes-body">{bookmark.notes}</p>}
        </>
      )}

      <div className="card-footer">
        <div className="card-meta">
          {new Date(bookmark.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {bookmark.click_count > 0 && <span> · {bookmark.click_count} clicks</span>}
        </div>
        <div className="card-actions">
          <button onClick={handleCheckLink} className="btn-icon" title="Check link">⚡</button>
          <button onClick={() => setEditing(true)} className="btn-icon edit" title="Edit">✎</button>
          <button onClick={handleCopy} className={`btn-icon copy ${copied ? 'copied' : ''}`} title="Copy">
            {copied ? '✓' : '⎘'}
          </button>
          <button onClick={handleDelete} className="btn-icon delete" title="Delete">✕</button>
        </div>
      </div>
    </div>
  )
}