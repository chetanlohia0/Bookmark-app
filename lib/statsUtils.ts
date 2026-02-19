type Bookmark = {
  url: string
  created_at: string
  click_count: number
  tags: string[]
}

export function getStats(bookmarks: Bookmark[]) {
  const total = bookmarks.length

  // Bookmarks added this week
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const thisWeek = bookmarks.filter(
    b => new Date(b.created_at) > oneWeekAgo
  ).length

  // Top domain
  const domainCounts: Record<string, number> = {}
  bookmarks.forEach(b => {
    try {
      const domain = new URL(b.url).hostname
      domainCounts[domain] = (domainCounts[domain] || 0) + 1
    } catch {}
  })
  const topDomain = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  // Total clicks
  const totalClicks = bookmarks.reduce((sum, b) => sum + (b.click_count || 0), 0)

  // Most used tag
  const tagCounts: Record<string, number> = {}
  bookmarks.forEach(b => {
    b.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  const topTag = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  return { total, thisWeek, topDomain, totalClicks, topTag }
}