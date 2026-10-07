import { useFavorites } from '../hooks/useFavorites'
import type { Route } from '../hooks/useHashRoute'
import { Logo } from './Icons'
import { ThemeToggle } from './ThemeToggle'

export function Header({ route }: { route: Route }) {
  const { favorites } = useFavorites()
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#/" aria-label="AI Radar — home">
          <Logo />
          <span>AI Radar</span>
        </a>
        <nav aria-label="Main">
          <a href="#/" aria-current={route === 'explore' ? 'page' : undefined}>
            Explore
          </a>
          <a href="#/favorites" aria-current={route === 'favorites' ? 'page' : undefined}>
            Favorites
            {favorites.length > 0 && (
              <>
                <span className="nav-count" aria-hidden="true">
                  {favorites.length}
                </span>
                <span className="sr-only"> ({favorites.length} saved)</span>
              </>
            )}
          </a>
          <a href="#/about" aria-current={route === 'about' ? 'page' : undefined}>
            About
          </a>
        </nav>
        <div className="header-end">
          <a className="powered" href="https://freeserp.ai" target="_blank" rel="noopener noreferrer">
            <span className="powered-dot" aria-hidden="true" />
            <span className="powered-long">Powered by </span>
            <strong>FreeSERP</strong>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
