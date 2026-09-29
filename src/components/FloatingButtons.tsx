'use client'

import { useEffect, useState } from 'react'

import { Icon, LineIcon } from './Icon'

export function FloatingButtons({ lineUrl, t }: { lineUrl?: string | null; t: { line: string; lineAria: string; top: string } }) {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="floating">
      {lineUrl ? (
        <a aria-label={t.lineAria} className="float-btn float-line" href={lineUrl} rel="noopener noreferrer" target="_blank">
          <LineIcon size={28} />
          <span className="float-label">{t.line}</span>
        </a>
      ) : null}
      <button
        aria-label={t.top}
        className={`float-btn float-top${showTop ? ' is-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        tabIndex={showTop ? 0 : -1}
        type="button"
      >
        <Icon name="up" size={22} />
        <span className="float-top-text">TOP</span>
      </button>
    </div>
  )
}
