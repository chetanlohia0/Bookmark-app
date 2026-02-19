'use client'
type Bookmark = { created_at: string; click_count: number }

export default function StatsBar({ bookmarks }: { bookmarks: Bookmark[] }) {
  const total = bookmarks.length
  const oneWeekAgo = new Date(); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const thisWeek = bookmarks.filter(b => new Date(b.created_at) > oneWeekAgo).length
  const totalClicks = bookmarks.reduce((s, b) => s + (b.click_count || 0), 0)

  return (
    <div className="stats-grid">
      {[
        { label: 'Total Saved', value: total },
        { label: 'Added This Week', value: thisWeek },
        { label: 'Total Clicks', value: totalClicks },
      ].map(s => (
        <div key={s.label} className="stat-card fade-up d1">
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  )
}