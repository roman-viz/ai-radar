import { resolveTech } from '../lib/tech'
import type { Page, Website } from '../types'
import type { RawSiteResult, RawSitesResponse } from './types'

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const str = (v: unknown): string | null => {
  if (typeof v !== 'string') return null
  const t = v.replace(/\s+/g, ' ').trim()
  return t.length > 0 ? t : null
}

const isoDate = (v: unknown): string | null => {
  const s = str(v)
  return s && /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : null
}

/** Only http(s) URLs are ever linked to. */
export const safeHttpUrl = (v: unknown): string | null => {
  const s = str(v)
  if (!s) return null
  try {
    const u = new URL(s)
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null
  } catch {
    return null
  }
}

const builder = (v: unknown): string | null => resolveTech(str(v))

const uniqueStrings = (v: unknown): string[] =>
  Array.isArray(v) ? [...new Set(v.map(str).filter((c): c is string => c !== null))] : []

const rating = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100 ? Math.round(v) : null

const hostOnly = (domain: string): string => domain.replace(/^www\./, '')

/** Maps one raw result to the internal model, or returns null if it is unusable. */
export function normalizeSite(raw: unknown): Website | null {
  if (!isRecord(raw)) return null
  const r = raw as RawSiteResult

  const domain = str(r.domain)?.toLowerCase() ?? null
  if (!domain || !/^[a-z0-9.-]+$/.test(domain)) return null

  const url = safeHttpUrl(r.url) ?? safeHttpUrl(`https://${domain}`)
  if (!url) return null

  return {
    domain: hostOnly(domain),
    url,
    title: str(r.title) ?? hostOnly(domain),
    summary: str(r.ai_summary),
    categories: uniqueStrings(r.ai_categories),
    authority: rating(r.dr),
    liveSince: isoDate(r.went_live),
    firstSeen: isoDate(r.first_seen),
    builtWith: builder(r.ai_source),
  }
}

/** Validates the response envelope and keeps only well-formed, de-duplicated results. */
export function normalizeResponse(body: unknown): Page {
  if (!isRecord(body)) throw new Error('Unexpected response: not an object')
  const data = body as RawSitesResponse
  if (data.ok === false) throw new Error(`API reported an error: ${str(data.error) ?? 'unknown'}`)
  if (!Array.isArray(data.results)) throw new Error('Unexpected response: missing results')

  const seen = new Set<string>()
  const items: Website[] = []
  for (const raw of data.results) {
    const site = normalizeSite(raw)
    if (site && !seen.has(site.domain)) {
      seen.add(site.domain)
      items.push(site)
    }
  }
  const total = typeof data.total === 'number' && Number.isFinite(data.total) ? data.total : items.length
  return { items, total, rawCount: data.results.length }
}

/**
 * Rebuilds a Website from data previously saved in localStorage. Stored data is as untrusted
 * as API data (it can be stale, edited or from an older version), so it is validated again.
 */
export function restoreSite(raw: unknown): Website | null {
  if (!isRecord(raw)) return null
  const domain = str(raw.domain)?.toLowerCase() ?? null
  if (!domain || !/^[a-z0-9.-]+$/.test(domain)) return null
  const url = safeHttpUrl(raw.url) ?? safeHttpUrl(`https://${domain}`)
  if (!url) return null

  return {
    domain,
    url,
    title: str(raw.title) ?? domain,
    summary: str(raw.summary),
    categories: uniqueStrings(raw.categories),
    authority: rating(raw.authority),
    liveSince: isoDate(raw.liveSince),
    firstSeen: isoDate(raw.firstSeen),
    builtWith: str(raw.builtWith),
  }
}
