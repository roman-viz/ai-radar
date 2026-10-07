import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (p: P): P => ({
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
  ...p,
})

export const SearchIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)
export const ArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)
export const ArrowUp = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
  </svg>
)
export const CloseIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
export const AlertIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4.5M12 16h.01" />
  </svg>
)
export const RadarIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" opacity=".45" />
    <circle cx="12" cy="12" r="4.5" />
    <path d="m12 12 7-7" />
  </svg>
)

export const StarIcon = ({ filled = false, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? 'currentColor' : 'none'}>
    <path d="m12 3.2 2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8z" />
  </svg>
)
export const SunIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </svg>
)
export const MoonIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </svg>
)

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="var(--logo-bg)" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="var(--accent-bright)" strokeWidth="2" opacity=".5" />
      <circle cx="16" cy="16" r="4.5" fill="none" stroke="var(--accent-bright)" strokeWidth="2" />
      <path d="M16 16 24 8" stroke="var(--accent-bright)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="24" cy="8" r="2" fill="var(--accent-bright)" />
    </svg>
  )
}
