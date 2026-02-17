'use client'

type Props = {
  search: string
  setSearch: (v: string) => void
  sort: string
  setSort: (v: string) => void
  filter: string
  setFilter: (v: string) => void
  domains: string[]
}

export default function ControlsSection({ search, setSearch, sort, setSort, filter, setFilter, domains }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        placeholder="Search bookmarks..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select
        value={sort}
        onChange={e => setSort(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="az">Title A–Z</option>
        <option value="za">Title Z–A</option>
      </select>
      <select
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
      >
        <option value="all">All Domains</option>
        {domains.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  )
}