'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import RougeLogo from './RougeLogo'
import { useWishlist } from '@/context/WishlistContext'
import { useSubscribeModal } from '@/context/SubscribeContext'
import { useCart } from '@/context/CartContext'
import { useNavMenu } from '@/context/NavMenuContext'
import { hrefsOf } from '@/lib/nav'
import type { NavItem } from '@/types'

/**
 * Which top-level item to underline: the one with the most specific href
 * matching the current path. Product links (with ?colour=) are ignored so a
 * product page lights up SHOP, not FEATURED. Ties go to the later item, so
 * /drops/bagged-league is DROPS rather than FEATURED.
 */
function activeLabel(menu: NavItem[], pathname: string): string | null {
  let best: { label: string; score: number } | null = null
  for (const item of menu) {
    for (const href of hrefsOf(item)) {
      if (href.includes('?')) continue
      if (pathname !== href && !pathname.startsWith(href + '/')) continue
      if (!best || href.length >= best.score) best = { label: item.label, score: href.length }
    }
  }
  return best?.label ?? null
}

const tagStyle: React.CSSProperties = {
  marginLeft: 10,
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  letterSpacing: '.18em',
  color: '#D90017',
  border: '1px solid #D90017',
  padding: '2px 6px',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
}

/** Desktop dropdown body. Children with their own children become headed columns. */
function DropdownPanel({ item }: { item: NavItem }) {
  const children = item.children ?? []
  return (
    <div className="rr-nav-dd-inner">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
        {children.map((c) =>
          c.children?.length ? (
            <div key={c.href}>
              <Link href={c.href} className="rr-display rr-nav-dd-link" style={{ fontSize: 40, lineHeight: 1 }}>
                {c.label}
                {c.tag && <span style={tagStyle}>{c.tag}</span>}
              </Link>
              <div style={{ display: 'flex', gap: 56, marginTop: 18, flexWrap: 'wrap' }}>
                {c.children.map((g) => (
                  <div key={g.href} style={{ minWidth: 160 }}>
                    <Link href={g.href} className="rr-mono rr-nav-dd-link" style={{ color: '#D90017', letterSpacing: '.22em' }}>
                      {g.label} →
                    </Link>
                    <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {(g.children ?? []).map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className="rr-nav-dd-link" style={{ fontSize: 13, letterSpacing: '.06em' }}>
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Link key={c.href + c.label} href={c.href} className="rr-display rr-nav-dd-link" style={{ fontSize: 34, lineHeight: 1 }}>
              {c.label}
              {c.tag && <span style={tagStyle}>{c.tag}</span>}
            </Link>
          ),
        )}
      </div>
      {item.image && (
        <Link href={item.href} className="rr-nav-dd-image" aria-hidden="true" tabIndex={-1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt="" />
        </Link>
      )}
    </div>
  )
}

/** Mobile accordion rows for one section, indented by depth. */
function MobileLinks({ items, depth, onNavigate }: { items: NavItem[]; depth: number; onNavigate: () => void }) {
  return (
    <>
      {items.map((c) => (
        <div key={c.href + c.label}>
          <Link
            href={c.href}
            onClick={onNavigate}
            style={{
              display: 'block',
              padding: `${depth === 1 ? 12 : 8}px 0 ${depth === 1 ? 12 : 8}px ${depth * 16}px`,
              fontFamily: 'var(--font-mono)',
              fontSize: depth === 1 ? 12 : 11,
              letterSpacing: '.18em',
              color: depth === 2 ? '#D90017' : depth > 2 ? '#A6A6A8' : '#E6E6E6',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            {c.label}
            {c.tag && <span style={tagStyle}>{c.tag}</span>}
          </Link>
          {c.children?.length ? <MobileLinks items={c.children} depth={depth + 1} onNavigate={onNavigate} /> : null}
        </div>
      ))}
    </>
  )
}

export default function NavBar() {
  const pathname = usePathname()
  const menu = useNavMenu()
  const active = activeLabel(menu, pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  // Desktop dropdown: label of the open top-level item.
  const [openLabel, setOpenLabel] = useState<string | null>(null)
  // Mobile accordion: label of the expanded section.
  const [expanded, setExpanded] = useState<string | null>(null)
  const { count: wishlistCount, openDrawer } = useWishlist()
  const { openSubscribe } = useSubscribeModal()
  const { count: cartCount, openCart } = useCart()

  // Close everything on navigation (adjust-state-during-render, no effect).
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpenLabel(null)
    setMenuOpen(false)
  }

  const openItem = menu.find((m) => m.label === openLabel && m.children?.length)

  return (
    <>
      <header
        className="rr-nav-header"
        style={{
          position: 'sticky',
          top: 0,
          borderBottom: '1px solid #3A3A3C',
          background: 'rgba(15,15,16,0.95)',
          backdropFilter: 'blur(12px)',
          padding: '18px 40px',
          display: 'grid',
          // Side columns never shrink below their content, so the links can't
          // run under the logo — it shifts off-centre slightly instead.
          gridTemplateColumns: 'minmax(max-content, 1fr) auto minmax(max-content, 1fr)',
          columnGap: 32,
          alignItems: 'center',
          zIndex: 50,
        }}
        onMouseLeave={() => setOpenLabel(null)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpenLabel(null) }}
      >
        {/* Left — desktop nav links / mobile hamburger */}
        <div>
          <nav className="rr-nav-links" style={{ gap: 28 }}>
            {menu.map((item) => {
              const hasPanel = !!item.children?.length
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-haspopup={hasPanel || undefined}
                  aria-expanded={hasPanel ? openLabel === item.label : undefined}
                  onMouseEnter={() => setOpenLabel(item.label)}
                  onFocus={() => setOpenLabel(item.label)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '.18em',
                    color: '#E6E6E6',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    paddingBottom: 4,
                    textDecoration: 'none',
                    borderBottom:
                      active === item.label || openLabel === item.label
                        ? '1px solid #D90017'
                        : '1px solid transparent',
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
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
          <RougeLogo size={30} className="rr-nav-logo" />
        </Link>

        {/* Right — icons */}
        <div
          className="rr-nav-right"
          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
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
            onClick={() => openSubscribe('navbar')}
            aria-label="Join the members list"
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
            <span className="rr-mono rr-nav-account-label" style={{ color: '#E6E6E6' }}>JOIN</span>
          </button>
          <button
            onClick={openDrawer}
            style={{
              background: 'none', border: 'none', color: '#E6E6E6',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', padding: 0,
            }}
            aria-label="Open wishlist"
          >
            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" aria-hidden="true">
              <path
                d="M8 13.5C8 13.5 1.5 9 1.5 4.5C1.5 2.567 3.067 1 5 1C6.26 1 7.368 1.68 8 2.697C8.632 1.68 9.74 1 11 1C12.933 1 14.5 2.567 14.5 4.5C14.5 9 8 13.5 8 13.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill={wishlistCount > 0 ? 'currentColor' : 'none'}
                strokeLinejoin="round"
              />
            </svg>
            <span className="rr-mono rr-nav-search-label" style={{ color: '#E6E6E6' }}>WISHLIST</span>
            {wishlistCount > 0 && (
              <span style={{
                background: '#D90017', color: '#E6E6E6',
                fontFamily: 'var(--font-mono)', fontSize: 10,
                padding: '2px 6px', minWidth: 22, textAlign: 'center',
              }}>
                {String(wishlistCount).padStart(2, '0')}
              </span>
            )}
          </button>
          <button
            onClick={openCart}
            aria-label={`Open bag${cartCount ? ` (${cartCount} items)` : ''}`}
            style={{
              background: 'none', border: 'none', color: '#E6E6E6',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', padding: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3.5 5.5H14.5L13 15.5H5L3.5 5.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M6.5 5.5C6.5 3.843 7.343 2.5 9 2.5C10.657 2.5 11.5 3.843 11.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="rr-mono rr-nav-search-label" style={{ color: '#E6E6E6' }}>BAG</span>
            {cartCount > 0 && (
              <span
                style={{
                  background: '#D90017', color: '#E6E6E6',
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  padding: '2px 6px', minWidth: 22, textAlign: 'center',
                }}
              >
                {String(cartCount).padStart(2, '0')}
              </span>
            )}
          </button>
        </div>

        {/* Desktop dropdown panel */}
        {openItem && (
          // Clicks inside close it too — covers links to the page you're already on.
          <div className="rr-nav-dd" onClick={() => setOpenLabel(null)}>
            <DropdownPanel item={openItem} />
          </div>
        )}
      </header>

      {/* Mobile slide-down menu — accordion per section */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed', top: 64, left: 0, right: 0,
            maxHeight: 'calc(100vh - 64px)', overflowY: 'auto',
            background: '#0F0F10',
            borderBottom: '1px solid #3A3A3C',
            zIndex: 49,
            padding: '0 20px 20px',
          }}
        >
          {menu.map((item) => {
            const hasKids = !!item.children?.length
            const isOpen = expanded === item.label
            return (
              <div key={item.label} style={{ borderBottom: '1px solid #3A3A3C' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      flex: 1,
                      display: 'block',
                      padding: '18px 0',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      letterSpacing: '.22em',
                      color: active === item.label ? '#D90017' : '#E6E6E6',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                  >
                    {item.label}
                  </Link>
                  {hasKids && (
                    <button
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
                      style={{ background: 'none', border: 'none', color: '#E6E6E6', cursor: 'pointer', padding: '18px 0 18px 24px' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M1 6H11" stroke="currentColor" strokeWidth="1.4" />
                        {!isOpen && <path d="M6 1V11" stroke="currentColor" strokeWidth="1.4" />}
                      </svg>
                    </button>
                  )}
                </div>
                {hasKids && isOpen && (
                  <div style={{ paddingBottom: 14 }}>
                    <MobileLinks items={item.children!} depth={1} onNavigate={() => setMenuOpen(false)} />
                  </div>
                )}
              </div>
            )
          })}
          <button
            onClick={() => { setMenuOpen(false); openSubscribe() }}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '18px 0',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid #3A3A3C',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '.22em',
              color: '#D90017',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Join →
          </button>
        </div>
      )}
    </>
  )
}
