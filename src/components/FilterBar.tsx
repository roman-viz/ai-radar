import type { ReactNode } from 'react'
import { AI_CATEGORIES } from '../api/freeserp'
import { AUTHORITY_OPTIONS, SORT_OPTIONS } from '../lib/filters'
import type { AuthorityMin, SortKey } from '../types'

interface Props {
  category: string | null
  authorityMin: AuthorityMin
  sort: SortKey
  canReset: boolean
  /** Result count / status line, shown on the left of the controls. */
  summary: ReactNode
  /** Category choices; defaults to the FreeSERP AI niches. */
  categories?: readonly string[]
  /** Sort choices; defaults to the Explore options. */
  sortOptions?: readonly { value: SortKey; label: string }[]
  onCategory: (c: string | null) => void
  onAuthority: (a: AuthorityMin) => void
  onSort: (s: SortKey) => void
  onReset: () => void
}

export function FilterBar({
  category,
  authorityMin,
  sort,
  canReset,
  summary,
  categories = AI_CATEGORIES,
  sortOptions = SORT_OPTIONS,
  onCategory,
  onAuthority,
  onSort,
  onReset,
}: Props) {
  return (
    <div className="filters">
      <div className="toolbar">
        <div className="controls">
          <label className="select select-category">
            <span>Category</span>
            <select value={category ?? ''} onChange={(e) => onCategory(e.target.value || null)}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="select">
            <span>Authority</span>
            <select value={authorityMin} onChange={(e) => onAuthority(Number(e.target.value) as AuthorityMin)}>
              {AUTHORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="select">
            <span>Sort by</span>
            <select value={sort} onChange={(e) => onSort(e.target.value as SortKey)}>
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onReset} disabled={!canReset}>
            Reset
          </button>
        </div>
        {summary}
      </div>
    </div>
  )
}
