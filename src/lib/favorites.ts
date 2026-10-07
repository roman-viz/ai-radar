import { restoreSite } from '../api/normalize'
import type { Website } from '../types'

/**
 * Favorites live only in localStorage. Each entry is the website's normalized record, keyed by
 * its domain: the snapshot lets the Favorites page render without calling FreeSERP, and it is
 * refreshed whenever newer API data for the same domain is loaded.
 */
const KEY = 'ai-radar:favorites:v1'

function load(): Website[] {
  try {
    const raw = window.localStorage.getItem(KEY)
    const data: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(data)) return []
    const seen = new Set<string>()
    const sites: Website[] = []
    for (const item of data) {
      const site = restoreSite(item)
      if (site && !seen.has(site.domain)) {
        seen.add(site.domain)
        sites.push(site)
      }
    }
    return sites
  } catch {
    return []
  }
}

let current: Website[] = load()
const listeners = new Set<() => void>()

function commit(next: Website[]): void {
  current = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Storage unavailable (private mode, quota): favorites still work for this session.
  }
  listeners.forEach((l) => l())
}

// Keep several open tabs in sync.
window.addEventListener('storage', (e) => {
  if (e.key === KEY || e.key === null) {
    current = load()
    listeners.forEach((l) => l())
  }
})

export const subscribeFavorites = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getFavorites = (): Website[] => current

/** Adds the site (newest first) or removes it if already saved. */
export function toggleFavorite(site: Website): void {
  commit(
    current.some((f) => f.domain === site.domain)
      ? current.filter((f) => f.domain !== site.domain)
      : [site, ...current],
  )
}

/** Replaces saved snapshots with fresher API data for the same domains. */
export function refreshFavorites(fresh: Website[]): void {
  if (current.length === 0) return
  const byDomain = new Map(fresh.map((s) => [s.domain, s]))
  let changed = false
  const next = current.map((f) => {
    const update = byDomain.get(f.domain)
    if (update && JSON.stringify(update) !== JSON.stringify(f)) {
      changed = true
      return update
    }
    return f
  })
  if (changed) commit(next)
}
