import type { Website } from '../types'

export type ExportFormat = 'json' | 'csv'

const COLUMNS = ['title', 'domain', 'url', 'summary', 'categories', 'domain_rating', 'went_live', 'first_seen', 'built_with'] as const

const row = (s: Website) => ({
  title: s.title,
  domain: s.domain,
  url: s.url,
  summary: s.summary,
  categories: s.categories,
  domain_rating: s.authority,
  went_live: s.liveSince,
  first_seen: s.firstSeen,
  built_with: s.builtWith,
})

/**
 * One CSV field: always quoted, `"` doubled, any line break replaced by a space so a Favorite
 * can never span several rows. Text starting with a spreadsheet formula character gets a leading apostrophe.
 */
function cell(value: string | number | null): string {
  let text = value === null ? '' : String(value).replace(/[\r\n\u0085\u2028\u2029\v\f]+/g, ' ').trim()
  if (typeof value === 'string' && /^[=+\-@\t]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export function toJson(sites: Website[]): string {
  return JSON.stringify(sites.map(row), null, 2)
}

export function toCsv(sites: Website[]): string {
  const lines = sites.map((s) => {
    const r = row(s)
    return COLUMNS.map((c) => cell(c === 'categories' ? r.categories.join(', ') : r[c])).join(',')
  })
  return [COLUMNS.map(cell).join(','), ...lines].join('\r\n') + '\r\n'
}

export function downloadFavorites(sites: Website[], format: ExportFormat): void {
  const csv = format === 'csv'
  // The BOM makes Excel read the CSV as UTF-8.
  const blob = new Blob([csv ? `\uFEFF${toCsv(sites)}` : toJson(sites)], {
    type: csv ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-radar-favorites.${format}`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
