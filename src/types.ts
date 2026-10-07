/** Normalized website model used throughout the UI. */
export interface Website {
  domain: string
  url: string
  title: string
  summary: string | null
  categories: string[]
  /** Domain Rating 0–100. Missing for very new domains. */
  authority: number | null
  /** Date FreeSERP first confirmed the site live (ISO date). */
  liveSince: string | null
  firstSeen: string | null
  /** Detected platform / builder name (e.g. "Next.js"), when FreeSERP recognises one. */
  builtWith: string | null
}

export type SortKey = 'relevance' | 'authority' | 'newest' | 'name-asc' | 'name-desc'

export type AuthorityMin = 0 | 20 | 40 | 60

export interface Filters {
  query: string
  category: string | null
  authorityMin: AuthorityMin
  sort: SortKey
}

export interface Page {
  items: Website[]
  /** Total matches reported by the API. */
  total: number
  /** Number of raw results the API returned (used as the paging offset). */
  rawCount: number
}
