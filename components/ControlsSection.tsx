'use client'
type Props = {
  search: string; setSearch: (v: string) => void
  sort: string; setSort: (v: string) => void
  filter: string; setFilter: (v: string) => void
  domains: string[]; total: number
}

export default function ControlsSection({ search, setSearch, sort, setSort, filter, setFilter, domains, total }: Props) {
  return (
    <div className="controls-bar">
      <div className="controls-meta">
        <span className="controls-meta-label">{total} bookmark{total !== 1 ? 's' : ''}</span>
        {search && (
          <button onClick={() => setSearch('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: 'var(--text3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ember)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}>
            Clear ✕
          </button>
        )}
      </div>
      <div className="controls-inputs">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input type="text" placeholder="Search bookmarks..." value={search}
            onChange={e => setSearch(e.target.value)} className="search-input" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ width: 150, flexShrink: 0 }}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="az">Title A–Z</option>
          <option value="za">Title Z–A</option>
          <option value="clicks">Most clicked</option>
        </select>
        {domains.length > 0 && (
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ width: 160, flexShrink: 0 }}>
            <option value="all">All domains</option>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
      </div>
    </div>
  )
}