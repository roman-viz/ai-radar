import type { Filters, Page, SortKey } from '../types'
import { normalizeResponse } from './normalize'

/** Same-origin proxy: FreeSERP's duplicated CORS header blocks direct browser calls. */
const ENDPOINT = '/api/freeserp'
export const PAGE_SIZE = 24
/** FreeSERP Main allows `from` up to 10,000. */
export const MAX_OFFSET = 10_000

/**
 * AI niches that FreeSERP counts as genuine AI products with `ai_startups=1`
 * (taken from https://freeserp.ai/docs.php, "ai_categories" field values).
 */
export const AI_CATEGORIES = [
  'AI Agents & Autonomous',
  'Code & Dev Tools',
  'AI Infrastructure & API',
  'AI Automation & Workflows',
  'LLM & Prompt Tools',
  'AI Search & Answers',
  'AI Website Builder',
  'No-code / App Builder',
  'Image Generation',
  'Video Generation',
  'Voice & Text-to-Speech',
  'Data & Analytics',
  'Research & Science',
  'Design & UI',
  'Chatbot & Assistant',
] as const

const SORT_PARAMS: Record<SortKey, { sort: string; order?: 'asc' | 'desc' }> = {
  relevance: { sort: 'relevance' },
  authority: { sort: 'dr', order: 'desc' },
  newest: { sort: 'went_live', order: 'desc' },
  'name-asc': { sort: 'domain', order: 'asc' },
  'name-desc': { sort: 'domain', order: 'desc' },
}

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export function buildUrl(filters: Filters, offset: number): string {
  const params = new URLSearchParams({
    index: 'sites',
    ai_startups: '1',
    size: String(PAGE_SIZE),
    from: String(offset),
  })
  const q = filters.query.trim()
  if (q) params.set('q', q)
  if (filters.category) params.set('ai_categories', filters.category)
  if (filters.authorityMin > 0) params.set('dr_min', String(filters.authorityMin))
  const { sort, order } = SORT_PARAMS[filters.sort]
  params.set('sort', sort)
  if (order) params.set('order', order)
  return `${ENDPOINT}?${params.toString()}`
}

export async function fetchWebsites(filters: Filters, offset: number, signal: AbortSignal): Promise<Page> {
  let res: Response
  try {
    res = await fetch(buildUrl(filters, offset), { signal, headers: { Accept: 'application/json' } })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new ApiError('Network request failed')
  }
  if (!res.ok) throw new ApiError(`FreeSERP responded with HTTP ${res.status}`, res.status)

  let body: unknown
  try {
    body = await res.json()
  } catch {
    throw new ApiError('FreeSERP returned invalid JSON', res.status)
  }
  return normalizeResponse(body)
}
