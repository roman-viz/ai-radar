import { formatDate } from '../lib/format'
import type { Website } from '../types'
import { CategoryTag } from './CategoryTag'
import { FavoriteButton } from './FavoriteButton'
import { ArrowUpRight } from './Icons'
import { TechIcon } from './TechIcon'
import { SiteFavicon } from './SiteFavicon'

interface Props {
  site: Website
  saved: boolean
  onOpen: (site: Website) => void
  onToggleFavorite: (site: Website) => void
}

export function WebsiteCard({ site, saved, onOpen, onToggleFavorite }: Props) {
  const [first, second] = site.categories
  const extra = site.categories.length - 2

  return (
    <article className="card">
      <div className="card-head">
        <SiteFavicon domain={site.domain} />
        <div className="card-id">
          <h3 className="card-title">
            <button type="button" className="card-open" onClick={() => onOpen(site)}>
              {site.title}
            </button>
          </h3>
          <p className="card-domain">{site.domain}</p>
        </div>
        <FavoriteButton site={site} saved={saved} onToggle={onToggleFavorite} />
      </div>

      {site.summary && <p className="card-summary">{site.summary}</p>}

      <div className="card-bottom">
        {site.categories.length > 0 && (
          <div className="tags">
            {first && <CategoryTag name={first} />}
            {second && <CategoryTag name={second} />}
            {extra > 0 && (
              <span className="tag tag-muted" title={site.categories.slice(2).join(', ')}>
                +{extra}
              </span>
            )}
          </div>
        )}
        <div className="card-foot">
          <div className="meta-group">
            {site.authority !== null ? (
              <span className="meta" title="Domain Rating (0–100), FreeSERP's authority score">
                DR <strong>{site.authority}</strong>
              </span>
            ) : (
              site.liveSince && (
                <span className="meta">
                  Live <strong>{formatDate(site.liveSince)}</strong>
                </span>
              )
            )}
            {site.builtWith && <TechIcon name={site.builtWith} />}
          </div>
          <a className="visit" href={site.url} target="_blank" rel="noopener noreferrer">
            Visit
            <ArrowUpRight width={15} height={15} />
            <span className="sr-only"> {site.domain} (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </article>
  )
}
