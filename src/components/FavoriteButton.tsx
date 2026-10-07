import type { Website } from '../types'
import { StarIcon } from './Icons'

interface Props {
  site: Website
  saved: boolean
  onToggle: (site: Website) => void
}

/** Icon button: filled star = saved, outline star = not saved. The accessible name states the action. */
export function FavoriteButton({ site, saved, onToggle }: Props) {
  const label = saved ? `Remove ${site.domain} from favorites` : `Add ${site.domain} to favorites`
  return (
    <button
      type="button"
      className="icon-btn fav"
      data-saved={saved}
      aria-label={label}
      title={saved ? 'Remove from favorites' : 'Add to favorites'}
      onClick={() => onToggle(site)}
    >
      <StarIcon filled={saved} width={20} height={20} />
    </button>
  )
}
