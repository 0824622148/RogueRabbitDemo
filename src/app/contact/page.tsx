import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import FAQAccordion from '@/components/brand/FAQAccordion'

export const metadata: Metadata = {
  title: 'Contact — Rouge Rabbit',
  description: 'Get in touch with Rouge Rabbit. Customer support, order queries, and frequently asked questions.',
}

const FAQS = [
  {
    q: 'How do pre-orders work?',
    a: "Once you submit your pre-order, your spot is held. You'll receive EFT banking details immediately — payment must be completed within 24 hours to confirm your pair. Your edition number is then assigned and emailed to you. No payment is captured during the form itself.",
  },
  {
    q: 'When will my pre-order be ready for collection?',
    a: 'DROP 003 is expected to be available from 31 July 2026. Once your payment clears we will send a collection confirmation with your chosen store (Rosebank, V&A Waterfront, or Gateway). Delivery to door is coming soon.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We currently accept EFT (Electronic Funds Transfer) only. All banking details are provided on your pre-order confirmation screen. Use your unique order reference as the payment reference to avoid delays.',
  },
  {
    q: 'Can I cancel or modify my pre-order?',
    a: 'Pre-orders can be cancelled or modified within 24 hours of submission, before payment has been processed. Email orders@rougerabbit.co.za with your reference number as soon as possible. Once payment is confirmed, orders are final.',
  },
  {
    q: 'How do I find my size?',
    a: "The Rouge 01 runs true to size. Use the Sizing Guide on any product page or in the shop sidebar to compare UK, EU, and foot-length measurements. If you're between sizes, size up. Still unsure? Drop us an email.",
  },
  {
    q: 'Do you ship internationally?',
    a: 'Not yet. Rouge Rabbit currently operates exclusively within South Africa. International availability is on the roadmap and will be announced via our social channels and mailing list when ready.',
  },
  {
    q: 'What is the 30-Day Fit Guarantee?',
    a: 'First-time customers can request a size exchange within 30 days of receiving their footwear, provided the pair is unworn and in original condition with all original packaging. See our Shipping & Returns page for the full terms.',
  },
  {
    q: 'How do I return or exchange an item?',
    a: 'Email support@rougerabbit.co.za with your order number, reason for return, and photos if applicable. Returns must be requested within 14 days of delivery. Our team will guide you through the rest. See our Returns Policy for full eligibility criteria.',
  },
  {
    q: 'How do I track my order?',
    a: "Once your order has been dispatched you will receive a tracking number via email or SMS. If you haven't received one within the expected processing window, contact orders@rougerabbit.co.za with your order reference number.",
  },
  {
    q: 'Is my personal information secure?',
    a: 'Yes. Your data is stored securely and used only to process your order and communicate with you. We do not sell or share your information with third parties. See our Privacy Policy for full details.',
  },
]

export default function ContactPage() {
  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />

      {/* ── HERO ──────────────────────────────────── */}
      <section
        style={{
          borderBottom: '1px solid #3A3A3C',
          padding: 'clamp(60px, 8vw, 100px) 40px clamp(50px, 7vw, 80px)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <span className="rr-overline" style={{ color: '#D90017', marginBottom: 20, display: 'block' }}>
            ROUGE RABBIT · SUPPORT
          </span>
          <h1
            className="rr-display"
            style={{
              fontSize: 'clamp(52px, 8vw, 104px)',
              margin: '0 0 20px',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
            }}
          >
            GET IN<br /><span style={{ color: '#D90017' }}>TOUCH.</span>
          </h1>
          <p
            style={{
              maxWidth: 500, fontSize: 15, lineHeight: 1.8,
              color: '#A6A6A8', margin: 0, marginTop: 24,
            }}
          >
            We're a small independent team — responses may take up to one business day.
            For the fastest reply, include your order reference number.
          </p>
        </div>
      </section>

      {/* ── CONTACT CARDS ─────────────────────────── */}
      <section style={{ padding: 'clamp(50px, 6vw, 80px) 40px', borderBottom: '1px solid #3A3A3C' }}>
        <div
          style={{
            maxWidth: 1100, margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 1,
            border: '1px solid #3A3A3C',
          }}
        >
          {/* Support */}
          <div
            style={{
              padding: '44px 40px',
              background: '#1E1E20',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}
          >
            <span className="rr-overline" style={{ color: '#D90017' }}>GENERAL SUPPORT</span>
            <p style={{ margin: 0, fontSize: 13, color: '#A6A6A8', lineHeight: 1.75 }}>
              Sizing questions, product info, general enquiries, returns &amp; exchanges,
              and post-purchase support.
            </p>
            <a
              href="mailto:support@rougerabbit.co.za"
              style={{
                marginTop: 8,
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(16px, 2.5vw, 22px)',
                color: '#E6E6E6',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                wordBreak: 'break-all',
              }}
            >
              support@rougerabbit.co.za
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2A9D2A', flexShrink: 0 }} />
              <span className="rr-mono" style={{ fontSize: 10, color: '#A6A6A8', letterSpacing: '.14em' }}>
                REPLY WITHIN 1 BUSINESS DAY
              </span>
            </div>
          </div>

          {/* Orders */}
          <div
            style={{
              padding: '44px 40px',
              background: '#0F0F10',
              borderLeft: '1px solid #3A3A3C',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}
          >
            <span className="rr-overline" style={{ color: '#D90017' }}>ORDER QUERIES</span>
            <p style={{ margin: 0, fontSize: 13, color: '#A6A6A8', lineHeight: 1.75 }}>
              Pre-order status, payment confirmations, EFT queries, collection scheduling,
              and order modifications.
            </p>
            <a
              href="mailto:orders@rougerabbit.co.za"
              style={{
                marginTop: 8,
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(16px, 2.5vw, 22px)',
                color: '#E6E6E6',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                wordBreak: 'break-all',
              }}
            >
              orders@rougerabbit.co.za
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2A9D2A', flexShrink: 0 }} />
              <span className="rr-mono" style={{ fontSize: 10, color: '#A6A6A8', letterSpacing: '.14em' }}>
                REPLY WITHIN 1 BUSINESS DAY
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESPONSE INFO STRIP ───────────────────── */}
      <section style={{ borderBottom: '1px solid #3A3A3C' }}>
        <div
          style={{
            maxWidth: 1100, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          {[
            { label: 'HOURS', value: 'MON – FRI · 09:00 – 17:00 SAST' },
            { label: 'RESPONSE TIME', value: 'WITHIN 1 BUSINESS DAY' },
            { label: 'BASED IN', value: 'SOUTH AFRICA' },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                padding: '28px 40px',
                borderRight: '1px solid #3A3A3C',
              }}
            >
              <div className="rr-overline" style={{ color: '#A6A6A8', marginBottom: 8 }}>{label}</div>
              <div className="rr-mono" style={{ fontSize: 11, color: '#E6E6E6', letterSpacing: '.12em' }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────── */}
      <section style={{ padding: 'clamp(60px, 7vw, 100px) 40px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <span className="rr-overline" style={{ color: '#D90017', display: 'block', marginBottom: 16 }}>
              FREQUENTLY ASKED
            </span>
            <h2
              className="rr-display"
              style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                margin: 0, lineHeight: 0.95, letterSpacing: '-0.01em',
              }}
            >
              QUESTIONS.
            </h2>
          </div>

          <FAQAccordion items={FAQS} />

          <div
            style={{
              marginTop: 56,
              padding: '32px 36px',
              background: '#1E1E20',
              border: '1px solid #3A3A3C',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 20,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="rr-overline" style={{ color: '#D90017', marginBottom: 8 }}>STILL HAVE A QUESTION?</div>
              <p style={{ margin: 0, fontSize: 13, color: '#A6A6A8', lineHeight: 1.7 }}>
                Can't find what you're looking for? Our team is happy to help.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="mailto:support@rougerabbit.co.za"
                className="rr-btn rr-btn--ghost"
                style={{ textDecoration: 'none', padding: '14px 24px', fontSize: 11 }}
              >
                EMAIL SUPPORT
              </a>
              <Link
                href="/shipping-returns"
                className="rr-btn rr-btn--ghost"
                style={{ textDecoration: 'none', padding: '14px 24px', fontSize: 11 }}
              >
                SHIPPING & RETURNS
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
