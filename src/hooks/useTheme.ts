import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const KEY = 'ai-radar:theme'
const THEME_COLOR: Record<Theme, string> = { light: '#f6f5f1', dark: '#0c1412' }
const query = () => window.matchMedia('(prefers-color-scheme: dark)')

const saved = (): Theme | null => {
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

const paint = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
}

/**
 * Theme state. The initial value is applied before first paint by the inline script in index.html
 * (saved choice, otherwise the system preference); this hook keeps React in sync with it.
 * Until the user picks a theme explicitly, the app keeps following the system preference.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'))

  useEffect(() => {
    const mq = query()
    const onChange = () => {
      if (saved()) return
      const next: Theme = mq.matches ? 'dark' : 'light'
      paint(next)
      setTheme(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      // Preference just won't persist.
    }
    paint(next)
    setTheme(next)
  }, [theme])

  return { theme, toggle }
}
