import { useEffect, useRef, useState } from 'react'
import type { ExportFormat } from '../lib/exportFavorites'

export function ExportMenu({ onExport }: { onExport: (format: ExportFormat) => void }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (format: ExportFormat) => {
    setOpen(false)
    onExport(format)
  }

  return (
    <div className="export" ref={root}>
      <button type="button" className="btn btn-ghost btn-sm" aria-expanded={open} aria-controls="export-menu" onClick={() => setOpen((o) => !o)}>
        Export
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m1 1.5 5 5 5-5" />
        </svg>
      </button>
      {open && (
        <div className="export-menu" id="export-menu">
          <button type="button" onClick={() => pick('json')}>
            JSON <span>.json</span>
          </button>
          <button type="button" onClick={() => pick('csv')}>
            CSV <span>.csv</span>
          </button>
        </div>
      )}
    </div>
  )
}
