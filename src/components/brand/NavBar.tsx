'use client'

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

function IconBtn({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      style={{
        background: 'none', border: 'none', color: '#E6E6E6',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        cursor: 'pointer', padding: 0,
      }}
    >
      {icon}
      <span className="rr-mono" style={{ color: '#E6E6E6' }}>{label}</span>
    </button>
  )
}

export default function NavBar({ cartCount = 2 }: { cartCount?: number }) {
  const pathname = usePathname()
  const isShop = pathname.startsWith('/shop')

  return (
    <header
      style={{
        position: 'relative',
        borderBottom: '1px solid #3A3A3C',
        background: 'rgba(15,15,16,0.9)',
        backdropFilter: 'blur(12px)',
        padding: '18px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      <nav style={{ display: 'flex', gap: 28 }}>
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
              position: 'relative',
              paddingBottom: 4,
              textDecoration: 'none',
              borderBottom: label === 'SHOP' && isShop ? '1px solid #D90017' : '1px solid transparent',
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      <Link href="/" style={{ cursor: 'pointer', display: 'inline-flex' }}>
        <RougeLogo size={36} withWordmark />
      </Link>

      <div style={{ display: 'flex', gap: 24, justifyContent: 'flex-end', alignItems: 'center' }}>
        <IconBtn
          label="SEARCH"
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          }
        />
        <IconBtn
          label="ACCOUNT"
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M1.5 13C1.5 10 4 8.5 7 8.5C10 8.5 12.5 10 12.5 13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          }
        />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#E6E6E6', cursor: 'pointer' }}>
          <span className="rr-mono" style={{ color: '#E6E6E6' }}>BAG</span>
          <span
            style={{
              background: '#D90017',
              color: '#E6E6E6',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              padding: '2px 6px',
              minWidth: 22,
              textAlign: 'center',
            }}
          >
            {String(cartCount).padStart(2, '0')}
          </span>
        </div>
      </div>
    </header>
  )
}
