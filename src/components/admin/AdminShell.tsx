'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/* ── Inline icons (Feather-style strokes, matching NavBar's hand-rolled SVGs) ── */
type IconProps = { size?: number }
const base = (size: number) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.6,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
})

const IcDashboard = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
)
const IcOrders = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
)
const IcPayments = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
)
const IcDeliveries = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
)
const IcMembers = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
)
const IcMail = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
)
const IcMenu = ({ size = 22 }: IconProps) => (
  <svg {...base(size)}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
)
const IcClose = ({ size = 20 }: IconProps) => (
  <svg {...base(size)}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
)
const IcLogout = ({ size = 13 }: IconProps) => (
  <svg {...base(size)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
)

type IconComponent = (props: IconProps) => React.ReactElement

interface NavItem {
  label: string
  href: string
  Icon: IconComponent
  /** Match only on exact path (used for the Dashboard root). */
  exact?: boolean
}

const NAV: NavItem[] = [
  { label: 'Dashboard',  href: '/admin',            Icon: IcDashboard, exact: true },
  { label: 'Orders',     href: '/admin/orders',     Icon: IcOrders },
  { label: 'Payments',   href: '/admin/payments',   Icon: IcPayments },
  { label: 'Deliveries', href: '/admin/deliveries', Icon: IcDeliveries },
  { label: 'Members',    href: '/admin/members',    Icon: IcMembers },
  { label: 'Email',      href: '/admin/email',      Icon: IcMail },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Login page renders standalone — no sidebar chrome.
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const Brand = (
    <div>
      <div style={{ color: '#D90017', fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '.06em' }}>
        ROUGE RABBIT
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '.2em', color: '#A6A6A8', marginTop: 2 }}>
        ADMIN DASHBOARD
      </div>
    </div>
  )

  return (
    <div className="rr-admin-shell">
      {/* Mobile top bar */}
      <div className="rr-admin-topbar">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          style={{ background: 'none', border: 'none', color: '#E6E6E6', cursor: 'pointer', display: 'inline-flex' }}
        >
          <IcMenu />
        </button>
        {Brand}
        <span style={{ width: 22 }} />
      </div>

      {/* Overlay (mobile, when drawer open) */}
      <div className={`rr-admin-overlay${open ? ' open' : ''}`} onClick={() => setOpen(false)} />

      {/* Sidebar */}
      <aside className={`rr-admin-sidebar${open ? ' open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 22px 20px' }}>
          {Brand}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{ background: 'none', border: 'none', color: '#A6A6A8', cursor: 'pointer' }}
            className="rr-admin-close"
          >
            <IcClose />
          </button>
        </div>

        <nav style={{ flex: 1, paddingTop: 8 }}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rr-admin-navlink${isActive(item) ? ' active' : ''}`}
            >
              <span className="rr-admin-navicon"><item.Icon /></span>
              {item.label}
            </Link>
          ))}
        </nav>

        <form action="/api/admin/logout" method="POST" style={{ padding: 18, borderTop: '1px solid #3A3A3C' }}>
          <button
            type="submit"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center',
              background: 'none', border: '1px solid #3A3A3C', color: '#A6A6A8',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em',
              padding: '10px 16px', cursor: 'pointer',
            }}
          >
            <IcLogout /> LOGOUT
          </button>
        </form>
      </aside>

      {/* Main content */}
      <main className="rr-admin-main">{children}</main>
    </div>
  )
}
