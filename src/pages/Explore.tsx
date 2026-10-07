import { useEffect, useMemo, useState } from 'react'
import { PAGE_SIZE } from '../api/freeserp'
import { DetailsDialog } from '../components/DetailsDialog'
import { FilterBar } from '../components/FilterBar'
import { Hero } from '../components/Hero'
import { SkeletonCard } from '../components/SkeletonCard'
import { EmptyState, ErrorState } from '../components/States'
import { WebsiteCard } from '../components/WebsiteCard'
import { useFavorites } from '../hooks/useFavorites'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useWebsites } from '../hooks/useWebsites'
import { refreshFavorites } from '../lib/favorites'
import { readFilters, toSearch } from '../lib/urlState'
import { DEFAULT_FILTERS, hasActiveFilters } from '../lib/filters'
import { formatNumber } from '../lib/format'
import type { AuthorityMin, Filters, SortKey, Website } from '../types'

export function Explore() {
  const [initial] = useState(() => readFilters(window.location.search))
  const [input, setInput] = useState(initial.query)
  const [category, setCategory] = useState<string | null>(initial.category)
  const [authorityMin, setAuthorityMin] = useState<AuthorityMin>(initial.authorityMin)
  const [sort, setSort] = useState<SortKey>(initial.sort)
  const [selected, setSelected] = useState<Website | null>(null)

  const query = useDebouncedValue(input, 350)
  const filters = useMemo<Filters>(() => ({ query, category, authorityMin, sort }), [query, category, authorityMin, sort])
  const data = useWebsites(filters)
  const { isFavorite, toggle } = useFavorites()

  // Keep saved snapshots current with whatever fresh API data is loaded.
  useEffect(() => refreshFavorites(data.items), [data.items])

  // State -> URL. Typing replaces the current history entry; other changes add one (Back/Forward).
  useEffect(() => {
    const next = { query: input, category, authorityMin, sort }
    const search = toSearch(next)
    const current = readFilters(window.location.search)
    if (search === toSearch(current)) return
    const url = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
    const textOnly = current.category === category && current.authorityMin === authorityMin && current.sort === sort
    window.history[textOnly ? 'replaceState' : 'pushState'](null, '', url)
  }, [input, category, authorityMin, sort])

  // URL -> state (Back/Forward).
  useEffect(() => {
    const onPop = () => {
      const f = readFilters(window.location.search)
      setInput(f.query)
      setCategory(f.category)
      setAuthorityMin(f.authorityMin)
      setSort(f.sort)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const active = hasActiveFilters({ query: input, category, authorityMin, sort })
  // Narrowing by search/category/authority is what makes an empty result "filtered".
  const narrowed = input.trim() !== '' || category !== null || authorityMin !== 0

  const reset = () => {
    setInput(DEFAULT_FILTERS.query)
    setCategory(DEFAULT_FILTERS.category)
    setAuthorityMin(DEFAULT_FILTERS.authorityMin)
    setSort(DEFAULT_FILTERS.sort)
  }

  const trimmed = query.trim()
  let count = 'Searching…'
  if (data.status === 'success') {
    count = `${formatNumber(data.total)} ${data.total === 1 ? 'website' : 'websites'}`
  } else if (data.status === 'error') {
    count = 'Results unavailable'
  }

  return (
    <>
      <div className="container">
        <Hero value={input} onChange={setInput} />
      </div>

      <section className="container results" aria-labelledby="results-title">
        <h2 id="results-title" className="sr-only">
          Results
        </h2>
        <FilterBar
          category={category}
          authorityMin={authorityMin}
          sort={sort}
          canReset={active}
          summary={
            <p className="count" role="status" aria-live="polite">
              <strong>{count}</strong>
              {data.status === 'success' && data.total > 0 && trimmed && <> matching “{trimmed}”</>}
              {data.status === 'success' && data.total > 0 && category && <> in {category}</>}
            </p>
          }
          onCategory={setCategory}
          onAuthority={setAuthorityMin}
          onSort={setSort}
          onReset={reset}
        />

        {data.status === 'loading' && (
          <div className="grid" aria-busy="true">
            {Array.from({ length: 9 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {data.status === 'error' && <ErrorState onRetry={data.retry} />}

        {data.status === 'success' && data.items.length === 0 && <EmptyState filtered={narrowed} onClear={reset} />}

        {data.status === 'success' && data.items.length > 0 && (
          <>
            <div className="grid">
              {data.items.map((site) => (
                <WebsiteCard
                  key={site.domain}
                  site={site}
                  saved={isFavorite(site.domain)}
                  onOpen={setSelected}
                  onToggleFavorite={toggle}
                />
              ))}
              {data.loadingMore && Array.from({ length: 3 }, (_, i) => <SkeletonCard key={`more-${i}`} />)}
            </div>

            <div className="more">
              <p>
                Showing {formatNumber(data.items.length)} of {formatNumber(data.total)}
              </p>
              {data.moreError && (
                <p className="more-error" role="alert">
                  Couldn’t load more results.
                </p>
              )}
              {data.hasMore && (
                <button type="button" className="btn btn-primary" onClick={data.loadMore} disabled={data.loadingMore}>
                  {data.loadingMore ? 'Loading…' : data.moreError ? 'Try again' : `Load ${PAGE_SIZE} more`}
                </button>
              )}
              {data.capped && <p className="muted">That’s the deepest FreeSERP can page. Refine your search to see more.</p>}
            </div>
          </>
        )}
      </section>

      <DetailsDialog site={selected} onClose={() => setSelected(null)} />
    </>
  )
}
