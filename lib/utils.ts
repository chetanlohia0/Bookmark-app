// Check if URL is valid
export function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith('http') ? url : 'https://' + url)
    return true
  } catch {
    return false
  }
}

// Normalize URL for duplicate checking
export function normalizeUrl(url: string): string {
  let u = url.trim().toLowerCase()
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u
  try {
    const parsed = new URL(u)
    // Remove trailing slash
    return parsed.origin + parsed.pathname.replace(/\/$/, '') + parsed.search
  } catch {
    return u
  }
}

// Extract domain
export function getDomain(url: string): string {
  try { return new URL(url).hostname } catch { return '' }
}

// Check if a link is reachable
export async function checkLink(url: string): Promise<'ok' | 'dead' | 'unknown'> {
  try {
    const res = await fetch(`/api/check-link?url=${encodeURIComponent(url)}`)
    const data = await res.json()
    return data.status
  } catch {
    return 'unknown'
  }
}