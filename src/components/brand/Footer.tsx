'use client'

import Link from 'next/link'
import RougeLogo from './RougeLogo'
import { FaInstagram, FaYoutube } from 'react-icons/fa'
import { FaTiktok, FaXTwitter } from 'react-icons/fa6'

const FOOTER_COLS = [
  {
    title: 'SHOP',
    items: [
      { label: 'New Arrivals',   href: '/shop' },
      { label: 'Footwear',       href: '/shop' },
      { label: 'Apparel',        href: '/shop/apparel' },
      { label: 'Accessories',    href: '/shop/accessories' },
      { label: 'Sale',           href: '/sale' },
    ],
  },
  {
    title: 'WORLD',
    items: [
      { label: 'Drops Calendar', href: '/drops' },
      { label: 'Lookbook',       href: '/lookbook' },
      { label: 'Journal',        href: '/journal' },
      { label: 'Stockists',      href: '/stockists' },
    ],
  },
  {
    title: 'SUPPORT',
    items: [
      { label: 'Sizing Guide',      href: '/sizing-guide' },
      { label: 'Shipping',         href: '/shipping-returns' },
      { label: 'Returns',          href: '/shipping-returns' },
      { label: 'Pre-Order Policy', href: '/preorder-policy' },
      { label: 'Contact',          href: '/contact' },
    ],
  },
  {
    title: 'LEGAL',
    items: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy',     href: '/privacy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer
      className="rr-footer-wrap"
      style={{
        background: '#070708',
        borderTop: '1px solid #3A3A3C',
        padding: '60px 40px 30px',
        color: '#E6E6E6',
      }}
    >
      <div className="rr-footer-grid">
        {/* Brand column — spans full width on mobile */}
        <div className="rr-footer-brand">
          <RougeLogo size={48} withWordmark />
          <p style={{ marginTop: 22, fontSize: 13, color: '#A6A6A8', lineHeight: 1.7, maxWidth: 320 }}>
            Built different. Worn by the ones who refuse to blend in. Independent streetwear out of every corner that
            doesn&apos;t ask for permission.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {[
              { icon: <FaInstagram size={16} />, href: 'https://www.instagram.com/rougerabbit.za?igsh=dmpjcWsyYnFkcjh5&utm_source=qr', label: 'Instagram', soon: false },
              { icon: <FaTiktok size={15} />,    href: 'https://www.tiktok.com/@rouge_rabbitza',                                        label: 'TikTok',   soon: false },
              { icon: <FaYoutube size={16} />,   href: null,                                                                             label: 'YouTube',  soon: true },
              { icon: <FaXTwitter size={15} />,  href: null,                                                                             label: 'X',        soon: true },
            ].map(({ icon, href, label, soon }) =>
              soon ? (
                <div
                  key={label}
                  title="Coming soon"
                  aria-label={`${label} — coming soon`}
                  style={{
                    position: 'relative',
                    width: 36, height: 36, border: '1px solid #3A3A3C',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: '#3A3A3C', cursor: 'default', opacity: 0.5,
                  }}
                >
                  {icon}
                  <span style={{
                    position: 'absolute', bottom: -18,
                    fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '.14em',
                    color: '#A6A6A8', whiteSpace: 'nowrap',
                  }}>
                    SOON
                  </span>
                </div>
              ) : (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 36, height: 36, border: '1px solid #3A3A3C',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: '#E6E6E6', cursor: 'pointer', textDecoration: 'none',
                    transition: 'border-color .2s, color .2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E6E6E6' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#3A3A3C' }}
                >
                  {icon}
                </a>
              )
            )}
          </div>
        </div>

        {FOOTER_COLS.map(({ title, items }) => (
          <div key={title}>
            <div className="rr-overline" style={{ marginBottom: 18 }}>{title}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(({ label, href }) => (
                <li key={label}>
                  {href ? (
                    href.startsWith('mailto:') || href.startsWith('http') ? (
                      <a href={href} style={{ color: '#E6E6E6', fontSize: 13, textDecoration: 'none' }}>{label}</a>
                    ) : (
                      <Link href={href} style={{ color: '#E6E6E6', fontSize: 13, textDecoration: 'none' }}>{label}</Link>
                    )
                  ) : (
                    <span style={{ color: '#E6E6E6', fontSize: 13, cursor: 'default' }}>{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rr-hair" />
      <div
        style={{
          display: 'flex', justifyContent: 'space-between',
          paddingTop: 22, alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}
      >
        <span className="rr-mono">© 2026 ROUGE RABBIT · ALL RIGHTS RESERVED</span>
        <span className="rr-mono">REAL · RAW · ROUGE</span>
        <span className="rr-mono">EST 2023 · INDEPENDENT</span>
      </div>
    </footer>
  )
}
