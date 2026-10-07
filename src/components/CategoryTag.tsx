import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/** Category pill that truncates with an ellipsis and shows its full name in a tooltip on hover. */
export function CategoryTag({ name }: { name: string }) {
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)

  useEffect(() => {
    if (!pos) return
    const hide = () => setPos(null)
    window.addEventListener('scroll', hide, { passive: true, once: true })
    return () => window.removeEventListener('scroll', hide)
  }, [pos])

  const show = (el: HTMLElement) => {
    if (el.scrollWidth <= el.clientWidth) return // not truncated: nothing to reveal
    const r = el.getBoundingClientRect()
    setPos({ left: Math.max(8, Math.min(r.left, window.innerWidth - 278)), top: r.top })
  }

  return (
    <>
      <span className="tag" onMouseEnter={(e) => show(e.currentTarget)} onMouseLeave={() => setPos(null)}>
        {name}
      </span>
      {pos &&
        createPortal(
          <div className="tip" role="tooltip" style={{ left: pos.left, top: pos.top }}>
            {name}
          </div>,
          document.body,
        )}
    </>
  )
}
