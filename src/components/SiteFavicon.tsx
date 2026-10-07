import { useState } from 'react'

interface Props {
  domain: string
  size?: number
}

/** Favicon with a lettered fallback when the icon is missing or fails to load. */
export function SiteFavicon({ domain, size = 40 }: Props) {
  const [failed, setFailed] = useState(false)
  const letter = (domain.match(/[a-z0-9]/i)?.[0] ?? '?').toUpperCase()
  const hue = [...domain].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7)

  return (
    <span className="favicon" style={{ width: size, height: size }} aria-hidden="true">
      {failed ? (
        <span className="favicon-letter" style={{ background: `hsl(${hue} 38% 90%)`, color: `hsl(${hue} 45% 28%)` }}>
          {letter}
        </span>
      ) : (
        <img
          src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`}
          alt=""
          width={size * 0.6}
          height={size * 0.6}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          onLoad={(e) => {
            if (e.currentTarget.naturalWidth <= 16 && size > 24) setFailed(true)
          }}
        />
      )}
    </span>
  )
}
