import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { getFavorites, subscribeFavorites, toggleFavorite } from '../lib/favorites'

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribeFavorites, getFavorites, getFavorites)
  const domains = useMemo(() => new Set(favorites.map((f) => f.domain)), [favorites])
  const isFavorite = useCallback((domain: string) => domains.has(domain), [domains])
  return { favorites, isFavorite, toggle: toggleFavorite }
}
