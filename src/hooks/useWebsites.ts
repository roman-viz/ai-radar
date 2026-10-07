import { useCallback, useEffect, useRef, useState } from 'react'
import { MAX_OFFSET, PAGE_SIZE, fetchWebsites } from '../api/freeserp'
import type { Filters, Website } from '../types'

interface Result {
  /** Identifies the request (filters + retry attempt) this result belongs to. */
  key: string
  status: 'success' | 'error'
  items: Website[]
  total: number
  /** Offset for the next page (raw API results consumed so far). */
  offset: number
  loadingMore: boolean
  moreError: boolean
}

/**
 * Loads websites from FreeSERP for the given filters.
 * Any change to the filters restarts from the first page and cancels in-flight requests.
 * A result only counts while its key matches the current request, so stale data is never shown.
 */
export function useWebsites(filters: Filters) {
  const { query, category, authorityMin, sort } = filters
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const moreController = useRef<AbortController | null>(null)

  const key = JSON.stringify([query, category, authorityMin, sort, attempt])
  const current = result?.key === key ? result : null

  useEffect(() => {
    const ctrl = new AbortController()
    const base = { items: [], total: 0, offset: 0, loadingMore: false, moreError: false }

    fetchWebsites({ query, category, authorityMin, sort }, 0, ctrl.signal)
      .then((page) =>
        setResult({ ...base, key, status: 'success', items: page.items, total: page.total, offset: page.rawCount }),
      )
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return
        console.error('[AI Radar] Failed to load websites', err)
        setResult({ ...base, key, status: 'error' })
      })

    return () => {
      ctrl.abort()
      moreController.current?.abort()
    }
  }, [key, query, category, authorityMin, sort])

  const loadMore = useCallback(() => {
    if (!current || current.status !== 'success' || current.loadingMore) return
    const ctrl = new AbortController()
    moreController.current = ctrl
    const update = (fn: (r: Result) => Result) => setResult((r) => (r && r.key === key ? fn(r) : r))

    update((r) => ({ ...r, loadingMore: true, moreError: false }))
    fetchWebsites({ query, category, authorityMin, sort }, current.offset, ctrl.signal)
      .then((page) =>
        update((r) => {
          const known = new Set(r.items.map((i) => i.domain))
          return {
            ...r,
            items: [...r.items, ...page.items.filter((i) => !known.has(i.domain))],
            total: page.total,
            offset: r.offset + page.rawCount,
            loadingMore: false,
          }
        }),
      )
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return
        console.error('[AI Radar] Failed to load more websites', err)
        update((r) => ({ ...r, loadingMore: false, moreError: true }))
      })
  }, [current, key, query, category, authorityMin, sort])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  const status = current?.status ?? 'loading'
  const offset = current?.offset ?? 0
  const total = current?.total ?? 0
  const hasMore = status === 'success' && offset < total && offset + PAGE_SIZE <= MAX_OFFSET
  const capped = status === 'success' && offset < total && !hasMore

  return {
    status,
    items: current?.items ?? [],
    total,
    loadingMore: current?.loadingMore ?? false,
    moreError: current?.moreError ?? false,
    hasMore,
    capped,
    loadMore,
    retry,
  }
}
