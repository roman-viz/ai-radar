import { useEffect, useState } from 'react'
import { ArrowUp } from './Icons'

const SHOW_AFTER_PX = 400

/** Floating "back to top" button. Stays mounted (hidden via CSS) so it can fade without layout shifts. */
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    // The button hides once we are back at the top, so hand focus to the page content.
    document.getElementById('main')?.focus({ preventScroll: true })
  }

  return (
    <button type="button" className="to-top" data-visible={visible} onClick={toTop} aria-label="Back to top">
      <ArrowUp />
    </button>
  )
}
