import { useEffect, useState } from 'react'

export type Route = 'explore' | 'favorites' | 'about'

const parse = (): Route => {
  const path = window.location.hash.replace(/^#\/?/, '')
  return path === 'about' || path === 'favorites' ? path : 'explore'
}

/** Minimal hash router: works on any static host without server rewrites. */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const onChange = () => {
      setRoute(parse())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
