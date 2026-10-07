import type { Filters, Website } from '../types'

const desc = (a: string | number | null, b: string | number | null): number =>
  a === b ? 0 : a === null ? 1 : b === null ? -1 : a < b ? 1 : -1

/** Local counterpart of the FreeSERP query used on Explore: search, category, authority, sort. */
export function filterFavorites(sites: Website[], { query, category, authorityMin, sort }: Filters): Website[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const result = sites.filter((s) => {
    if (category && !s.categories.includes(category)) return false
    if (authorityMin > 0 && (s.authority ?? -1) < authorityMin) return false
    if (words.length === 0) return true
    const text = [s.title, s.domain, s.url, s.summary ?? '', ...s.categories].join(' ').toLowerCase()
    return words.every((w) => text.includes(w))
  })
  switch (sort) {
    case 'authority':
      return result.sort((a, b) => desc(a.authority, b.authority))
    case 'newest':
      return result.sort((a, b) => desc(a.liveSince, b.liveSince))
    case 'name-asc':
      return result.sort((a, b) => a.domain.localeCompare(b.domain))
    case 'name-desc':
      return result.sort((a, b) => b.domain.localeCompare(a.domain))
    default:
      return result
  }
}
