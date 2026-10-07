/** Raw shapes returned by FreeSERP Main (`index=sites`). Every field is treated as untrusted. */
export interface RawSiteResult {
  domain?: unknown
  url?: unknown
  title?: unknown
  ai_summary?: unknown
  ai_categories?: unknown
  ai_source?: unknown
  dr?: unknown
  went_live?: unknown
  first_seen?: unknown
}

export interface RawSitesResponse {
  ok?: unknown
  total?: unknown
  count?: unknown
  results?: unknown
  error?: unknown
}
