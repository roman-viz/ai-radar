import { AlertIcon, RadarIcon, StarIcon } from './Icons'

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="state" role="alert">
      <span className="state-icon state-icon-error">
        <AlertIcon width={26} height={26} />
      </span>
      <h2>Unable to load AI websites</h2>
      <p>We couldn’t reach the FreeSERP data service just now. Check your connection and try again.</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

interface EmptyProps {
  filtered: boolean
  onClear: () => void
}

export function EmptyState({ filtered, onClear }: EmptyProps) {
  return (
    <div className="state">
      <span className="state-icon">
        <RadarIcon width={26} height={26} />
      </span>
      {filtered ? (
        <>
          <h2>No AI websites found.</h2>
          <p>Nothing matches your current search and filters. Try a broader term or remove a filter.</p>
          <button type="button" className="btn btn-primary" onClick={onClear}>
            Clear filters
          </button>
        </>
      ) : (
        <>
          <h2>No AI websites available yet</h2>
          <p>FreeSERP returned an empty list. Please check back a little later.</p>
        </>
      )}
    </div>
  )
}

export function NoFavorites() {
  return (
    <div className="state">
      <span className="state-icon">
        <StarIcon width={26} height={26} />
      </span>
      <h2>No favorites yet</h2>
      <p>Tap the star on any AI website to keep it here for later. Favorites are saved in this browser.</p>
      <a className="btn btn-primary" href="#/">
        Explore AI websites
      </a>
    </div>
  )
}
