import { AI_CATEGORIES } from '../api/freeserp'
import type { Filters } from '../types'
import { AUTHORITY_OPTIONS, DEFAULT_FILTERS, SORT_OPTIONS } from './filters'

/**
 * Explore state <-> query string, e.g. `?q=video&category=Video+Generation&dr=40&sort=name-asc`.
 * Defaults are omitted; unknown or invalid values fall back to defaults.
 * (Sort keys already encode direction: `name-asc` / `name-desc`.)
 */
export function readFilters(search: string): Filters {
  const p = new URLSearchParams(search)
  const category = p.get('category')
  const dr = Number(p.get('dr'))
  const sort = p.get('sort')
  return {
    query: (p.get('q') ?? '').slice(0, 100),
    category: AI_CATEGORIES.find((c) => c === category) ?? null,
    authorityMin: AUTHORITY_OPTIONS.find((o) => o.value > 0 && o.value === dr)?.value ?? 0,
    sort: SORT_OPTIONS.find((o) => o.value === sort)?.value ?? DEFAULT_FILTERS.sort,
  }
}

export function toSearch(f: Filters): string {
  const p = new URLSearchParams()
  const q = f.query.trim()
  if (q) p.set('q', q)
  if (f.category) p.set('category', f.category)
  if (f.authorityMin > 0) p.set('dr', String(f.authorityMin))
  if (f.sort !== DEFAULT_FILTERS.sort) p.set('sort', f.sort)
  return p.toString()
}
