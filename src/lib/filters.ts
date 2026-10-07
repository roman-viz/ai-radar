import type { AuthorityMin, Filters, SortKey } from '../types'

export const DEFAULT_FILTERS: Filters = {
  query: '',
  category: null,
  authorityMin: 0,
  sort: 'relevance',
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Best match' },
  { value: 'authority', label: 'Highest authority' },
  { value: 'newest', label: 'Recently live' },
  { value: 'name-asc', label: 'Domain A–Z' },
  { value: 'name-desc', label: 'Domain Z–A' },
]

export const AUTHORITY_OPTIONS: { value: AuthorityMin; label: string }[] = [
  { value: 0, label: 'Any authority' },
  { value: 20, label: 'Authority 20+' },
  { value: 40, label: 'Authority 40+' },
  { value: 60, label: 'Authority 60+' },
]

/** True when any filter other than sorting differs from the defaults. */
export const hasActiveFilters = (f: Filters): boolean =>
  f.query.trim() !== '' || f.category !== null || f.authorityMin !== 0 || f.sort !== DEFAULT_FILTERS.sort

/** Favorites keep their saved order (newest first), which is what "relevance" means there. */
export const FAVORITE_SORT_OPTIONS = SORT_OPTIONS.map((o) => (o.value === 'relevance' ? { ...o, label: 'Recently saved' } : o))
