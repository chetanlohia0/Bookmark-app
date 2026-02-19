'use client'
import { useState } from 'react'

type Bookmark = { id: string; title: string; url: string; notes: string }
type Result = { index: number; reason: string }

export default function AskBookmarks({ bookmarks }: { bookmarks: Bookmark[] }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<(Bookmark & { reason: string })[]>([])
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleAsk = async () => {
    if (!query.trim()) return
    if (bookmarks.length === 0) { setError('No bookmarks to search through'); return }
    setLoading(true)
    setSearched(false)
    setError('')
    setResults([])

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          bookmarks: bookmarks.map(b => ({
            title: b.title,
            url: b.url,
            notes: b.notes || ''
          }))
        })
      })

      const data = await res.json()
      console.log('Ask result:', data)

      const matched = (data.results as Result[])
        .filter(r => r.index >= 1 && r.index <= bookmarks.length)
        .map(r => ({ ...bookmarks[r.index - 1], reason: r.reason }))
        .filter(Boolean)

      setResults(matched)
      setSearched(true)
    } catch (e) {
      console.error(e)
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>✨</span>
        <h2 className="form-title">Ask your bookmarks</h2>
        <span style={{ fontSize: '0.7rem', color: 'var(--text3)', marginLeft: 4 }}>
          powered by Gemini
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          placeholder='e.g. "articles about React" or "design resources"'
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
          style={{ flex: 1 }}
        />
        <button onClick={handleAsk} disabled={loading || bookmarks.length === 0}
          className="btn-primary"
          style={{ padding: '9px 18px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {loading ? '⟳' : '✨ Ask'}
        </button>
      </div>

      {error && (
        <p style={{ fontSize: '0.78rem', color: 'var(--red)' }}>{error}</p>
      )}

      {searched && !loading && results.length === 0 && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
          No matching bookmarks found for "{query}"
        </p>
      )}

      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: '0.68rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
          {results.map((b, i) => (
            <a key={`${b.id}-${i}`} href={b.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', flexDirection: 'column', gap: 5,
                padding: '12px 14px', borderRadius: 10, textDecoration: 'none',
                background: 'var(--ember-bg)', border: '1px solid var(--ember-border)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(232,113,74,0.16)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--ember-bg)')}>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text1)' }}>
                {b.title}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--ember)' }}>
                {b.reason}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>
                {b.url}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
