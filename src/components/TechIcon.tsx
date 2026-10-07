import type { ReactNode } from 'react'

/** Simple monochrome marks (24×24, stroke-based) keyed by the platform names from lib/tech.ts. */
const MARKS: Record<string, ReactNode> = {
  'Next.js': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 16V8l6 8.5M15.5 8v4" />
    </>
  ),
  WordPress: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m6.8 9.2 2.4 7 2.8-7.4 2.8 7.4 2.4-7" />
    </>
  ),
  Drupal: <path d="M12 3c3 3.6 6 5.6 6 9.6a6 6 0 0 1-12 0C6 8.6 9 6.6 12 3z" />,
  Elementor: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 8v8M13 8h3M13 12h3M13 16h3" />
    </>
  ),
  Docusaurus: (
    <>
      <path d="M5 4.500A2.5 2.5 0 0 1 7.5 2H19v16H7.500A2.5 2.5 0 0 0 5 20.500z" />
      <path d="M5 20.500A2.5 2.5 0 0 0 7.5 23H19v-5" />
    </>
  ),
  Astro: (
    <>
      <path d="m12 3 5 13c-1.5 1-3.2 1.5-5 1.500S8.5 17 7 16z" />
      <path d="M9 21h6" />
    </>
  ),
  Jekyll: (
    <>
      <path d="M7 4h10l4 6-9 10-9-10z" />
      <path d="M3 10h18" />
    </>
  ),
  HubSpot: (
    <>
      <circle cx="14" cy="13.5" r="3.5" />
      <path d="M14 10V5.500M11.2 15.6 6.8 18" />
      <circle cx="14" cy="4.2" r="1.5" />
      <circle cx="5.4" cy="18.7" r="1.5" />
    </>
  ),
  Lovable: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  v0: (
    <>
      <path d="m4 8 3 8 3-8" />
      <ellipse cx="16.5" cy="12" rx="3" ry="4.5" />
    </>
  ),
  Bolt: <path d="M13 2 5 13h6l-1 9 8-11h-6z" />,
  Base44: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  'Likely AI-built': <path d="m12 3 1.8 5.200L19 10l-5.2 1.800L12 17l-1.8-5.200L5 10l5.2-1.800zM19 17v4M17 19h4" />,
}

export const hasTechIcon = (name: string): boolean => name in MARKS

/** Icon for a detected platform, with a tooltip (hover/focus) and an accessible name. */
export function TechIcon({ name }: { name: string }) {
  const mark = MARKS[name]
  if (!mark) return null
  const label = name.startsWith('Likely') ? name : `Built with ${name}`
  return (
    <span className="tech" role="img" aria-label={label} data-tip={name} tabIndex={0}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        {mark}
      </svg>
    </span>
  )
}
