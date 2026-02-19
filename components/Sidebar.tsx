'use client'
import { useState } from 'react'
import { createCollection, deleteCollection, Collection } from '@/lib/collectionActions'

export default function Sidebar({ userId, collections, activeCollection, setActiveCollection, totalBookmarks }: {
  userId: string; collections: Collection[]
  activeCollection: string | null; setActiveCollection: (id: string | null) => void
  totalBookmarks: number
}) {
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [showInput, setShowInput] = useState(false)

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    await createCollection(userId, newName)
    setNewName(''); setShowInput(false); setCreating(false)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (activeCollection === id) setActiveCollection(null)
    await deleteCollection(id)
  }

  return (
    <aside className="sidebar">
      <p className="sidebar-label">Collections</p>

      <div className={`sidebar-item ${activeCollection === null ? 'active' : ''}`}
        onClick={() => setActiveCollection(null)}>
        <div className="sidebar-item-left">
          <span>📚</span>
          <span className="sidebar-item-name">All Bookmarks</span>
        </div>
        <span className="sidebar-count">{totalBookmarks}</span>
      </div>

      {collections.map(c => (
        <div key={c.id} className={`sidebar-item ${activeCollection === c.id ? 'active' : ''}`}
          onClick={() => setActiveCollection(activeCollection === c.id ? null : c.id)}>
          <div className="sidebar-item-left">
            <span>📁</span>
            <span className="sidebar-item-name">{c.name}</span>
          </div>
          <button className="sidebar-delete" onClick={e => handleDelete(e, c.id)}>✕</button>
        </div>
      ))}

      <div className="sidebar-new">
        {showInput ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <input placeholder="Collection name..." value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '7px 10px' }}
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowInput(false) }}
              autoFocus />
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={handleCreate} disabled={creating} className="btn-primary"
                style={{ flex: 1, padding: '7px', fontSize: '0.78rem' }}>
                {creating ? '...' : 'Create'}
              </button>
              <button onClick={() => { setShowInput(false); setNewName('') }} className="btn-ghost"
                style={{ flex: 1, padding: '7px', fontSize: '0.78rem' }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowInput(true)} className="sidebar-new-btn">
            + New Collection
          </button>
        )}
      </div>
    </aside>
  )
}