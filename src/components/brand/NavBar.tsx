'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import RougeLogo from './RougeLogo'

const NAV_LINKS = [
  { label: 'NEW',      href: '/shop' },
  { label: 'SHOP',     href: '/shop' },
  { label: 'DROPS',    href: '/shop' },
  { label: 'LOOKBOOK', href: '/' },
  { label: 'JOURNAL',  href: '/' },
]

export default function NavBar({ cartCount = 2 }: { cartCount?: number }) {
  const pathname = usePathname()
  const isShop = pathname.startsWith('/shop')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header
        style={{
          position: 'relative',
          borderBottom: '1px solid #3A3A3C',
          background: 'rgba(15,15,16,0.95)',
          backdropFilter: 'blur(12px)',
          padding: '18px 40px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          zIndex: 50,
        }}
      >
        {/* Left — desktop nav links / mobile hamburger */}
        <div>
          <nav className="rr-nav-links" style={{ gap: 28 }}>
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '.22em',
                  color: '#E6E6E6',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  paddingBottom: 4,
                  textDecoration: 'none',
                  borderBottom: label === 'SHOP' && isShop ? '1px solid #D90017' : '1px solid transparent',
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            className="rr-nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#E6E6E6',
              cursor: 'pointer',
              padding: 0,
              alignItems: 'center',
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            ) : (
              <svg width="22" height="14" viewBox="0 0 22 14">
                <path d="M0 1H22M0 7H16M0 13H22" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            )}
          </button>
        </div>

        {/* Center — logo */}
        <Link href="/" style={{ cursor: 'pointer', display: 'inline-flex' }}>
          <RougeLogo size={36} withWordmark />
        </Link>

        {/* Right — icons */}
        <div
          className="rr-nav-right"
          style={{ display: 'flex', gap: 24, justifyContent: 'flex-end', alignItems: 'center' }}
        >
          <button
            style={{
              background: 'none', border: 'none', color: '#E6E6E6',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', padding: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span className="rr-mono rr-nav-search-label" style={{ color: '#E6E6E6' }}>SEARCH</span>
          </button>
          <button
            style={{
              background: 'none', border: 'none', color: '#E6E6E6',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', padding: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M1.5 13C1.5 10 4 8.5 7 8.5C10 8.5 12.5 10 12.5 13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span className="rr-mono rr-nav-account-label" style={{ color: '#E6E6E6' }}>ACCOUNT</span>
          </button>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#E6E6E6', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3.5 5.5H14.5L13 15.5H5L3.5 5.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M6.5 5.5C6.5 3.843 7.343 2.5 9 2.5C10.657 2.5 11.5 3.843 11.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="rr-mono rr-nav-search-label" style={{ color: '#E6E6E6' }}>BAG</span>
            <span
              style={{
                background: '#D90017', color: '#E6E6E6',
                fontFamily: 'var(--font-mono)', fontSize: 10,
                padding: '2px 6px', minWidth: 22, textAlign: 'center',
              }}
            >
              {String(cartCount).padStart(2, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed', top: 61, left: 0, right: 0,
            background: '#0F0F10',
            borderBottom: '1px solid #3A3A3C',
            zIndex: 49,
            padding: '0 20px 20px',
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '18px 0',
                borderBottom: '1px solid #3A3A3C',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                letterSpacing: '.22em',
                color: '#E6E6E6',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
