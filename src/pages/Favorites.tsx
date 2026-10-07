import { useMemo, useRef, useState } from 'react'
import { DetailsDialog } from '../components/DetailsDialog'
import { ExportMenu } from '../components/ExportMenu'
import { FilterBar } from '../components/FilterBar'
import { SearchBox } from '../components/SearchBox'
import { EmptyState, NoFavorites } from '../components/States'
import { WebsiteCard } from '../components/WebsiteCard'
import { useFavorites } from '../hooks/useFavorites'
import { downloadFavorites } from '../lib/exportFavorites'
import { filterFavorites } from '../lib/filterFavorites'
import { DEFAULT_FILTERS, FAVORITE_SORT_OPTIONS } from '../lib/filters'
import type { AuthorityMin, SortKey, Website } from '../types'

export function Favorites() {
  const { favorites, isFavorite, toggle } = useFavorites()
  const [selected, setSelected] = useState<Website | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const [query, setQuery] = useState(DEFAULT_FILTERS.query)
  const [category, setCategory] = useState<string | null>(null)
  const [authorityMin, setAuthorityMin] = useState<AuthorityMin>(0)
  const [sort, setSort] = useState<SortKey>(DEFAULT_FILTERS.sort)

  // Only categories that exist among the saved favorites; a vanished category stops filtering.
  const categories = useMemo(() => [...new Set(favorites.flatMap((f) => f.categories))].sort((a, b) => a.localeCompare(b)), [favorites])
  const activeCategory = category && categories.includes(category) ? category : null
  const filters = { query, category: activeCategory, authorityMin, sort }
  const visible = filterFavorites(favorites, filters)
  const narrowed = query.trim() !== '' || activeCategory !== null || authorityMin !== 0
  const active = narrowed || sort !== DEFAULT_FILTERS.sort
  const reset = () => {
    setQuery('')
    setCategory(null)
    setAuthorityMin(0)
    setSort(DEFAULT_FILTERS.sort)
  }

  const remove = (site: Website) => {
    toggle(site)
    // The focused card disappears, so move focus somewhere predictable.
    heading.current?.focus()
  }

  return (
    <div className="container page">
      <p className="eyebrow">Your collection</p>
      <h1 ref={heading} tabIndex={-1}>
        Favorites
      </h1>

      {favorites.length === 0 ? (
        <NoFavorites />
      ) : (
        <>
          <p
            className="muted page-note"
            title="Saved in this browser only. Details are a snapshot from when you last saw each site on Explore and may have changed."
          >
            Saved in this browser only. Details are a snapshot from when you last saw each site on Explore and may have changed.
          </p>
          <h2 className="sr-only">Search and filter favorites</h2>
          <div className="fav-tools">
            <SearchBox
              id="fav-search"
              className="search-inline"
              label="Search favorites"
              placeholder="Search your favorites"
              value={query}
              onChange={setQuery}
            />
            <ExportMenu onExport={(format) => downloadFavorites(favorites, format)} />
          </div>
          <FilterBar
            category={activeCategory}
            authorityMin={authorityMin}
            sort={sort}
            canReset={active}
            categories={categories}
            sortOptions={FAVORITE_SORT_OPTIONS}
            summary={
              narrowed ? (
                <p className="count" role="status" aria-live="polite">
                  <strong>{visible.length}</strong> of {favorites.length} shown
                </p>
              ) : null
            }
            onCategory={setCategory}
            onAuthority={setAuthorityMin}
            onSort={setSort}
            onReset={reset}
          />
          {visible.length === 0 ? (
            <EmptyState filtered onClear={reset} />
          ) : (
            <div className="grid">
              {visible.map((site) => (
                <WebsiteCard
                  key={site.domain}
                  site={site}
                  saved={isFavorite(site.domain)}
                  onOpen={setSelected}
                  onToggleFavorite={remove}
                />
              ))}
            </div>
          )}
        </>
      )}

      <DetailsDialog site={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
