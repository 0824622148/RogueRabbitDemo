'use client'

import { useState } from 'react'

type VideoFacadeProps = {
  poster: string
  title: string
  youtubeId: string | null
}

/**
 * Lightweight YouTube facade.
 * - youtubeId === null → branded "TESTIMONIAL · DROPPING SOON" teaser, no interaction.
 * - youtubeId set → poster + play button; clicking swaps in the YouTube iframe.
 *   No YouTube script/iframe loads until the user clicks.
 *
 * Uses a plain <img> (not next/image) so no next.config remote-image config is
 * required — local posters work as-is, and img.youtube.com thumbnails would too.
 */
export default function VideoFacade({ poster, title, youtubeId }: VideoFacadeProps) {
  const [playing, setPlaying] = useState(false)
  const comingSoon = youtubeId === null

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        background: '#0A0A0B',
        overflow: 'hidden',
      }}
    >
      {playing && youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerated-controls; autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      ) : (
        <>
          {/* Poster */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt={title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: comingSoon ? 'brightness(0.4) grayscale(0.3)' : 'brightness(0.72)',
            }}
          />

          {/* Dark gradient for legibility */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.15) 55%, rgba(10,10,11,0.35) 100%)',
            }}
          />

          {comingSoon ? (
            /* Coming-soon teaser */
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 18,
                textAlign: 'center',
                padding: 24,
              }}
            >
              {/* Disabled play glyph */}
              <div
                aria-hidden="true"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  border: '1px solid #3A3A3C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.6,
                }}
              >
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
                  <path d="M1 1L17 10L1 19V1Z" stroke="#A6A6A8" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              </div>
              <span
                className="rr-mono"
                style={{ fontSize: 11, letterSpacing: '0.26em', color: '#D90017' }}
              >
                TESTIMONIAL · DROPPING SOON
              </span>
              <span
                className="rr-mono"
                style={{ fontSize: 9, letterSpacing: '0.2em', color: '#A6A6A8' }}
              >
                CONTENT IN PRODUCTION
              </span>
            </div>
          ) : (
            /* Play button */
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play ${title}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: '#D90017',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 40px rgba(217,0,23,0.4)',
                }}
              >
                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" aria-hidden="true">
                  <path d="M2 2L20 12L2 22V2Z" fill="#E6E6E6" />
                </svg>
              </span>
              <span
                className="rr-mono"
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 24,
                  fontSize: 10,
                  letterSpacing: '0.24em',
                  color: '#E6E6E6',
                }}
              >
                WATCH THE TESTIMONIAL
              </span>
            </button>
          )}
        </>
      )}
    </div>
  )
}
