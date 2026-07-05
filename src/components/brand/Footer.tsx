'use client'

import Link from 'next/link'
import RougeLogo from './RougeLogo'
import SubscribeForm from './SubscribeForm'
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
      { label: 'Influencers',    href: '/influencers' },
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
      {/* Newsletter / members signup */}
      <div
        className="rr-footer-join"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 24,
          paddingBottom: 40,
          marginBottom: 40,
          borderBottom: '1px solid #3A3A3C',
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <div className="rr-overline" style={{ color: '#D90017', marginBottom: 12 }}>[ JOIN THE LIST ]</div>
          <h3 className="rr-display" style={{ fontSize: 'clamp(32px, 4vw, 44px)', lineHeight: 0.95, margin: 0 }}>
            FIRST ACCESS.<br />NO NOISE.
          </h3>
          <p style={{ color: '#A6A6A8', fontSize: 13, lineHeight: 1.7, margin: '14px 0 0' }}>
            48-hour early access to every drop. Numbered pairs reserved for members.
          </p>
        </div>
        <div style={{ flex: '1 1 320px', minWidth: 260, maxWidth: 460 }}>
          <SubscribeForm source="footer" variant="inline" tone="onDark" buttonLabel="JOIN" />
        </div>
      </div>

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
        <span className="rr-mono">EST 2026 · INDEPENDENT</span>
      </div>
    </footer>
  )
}
