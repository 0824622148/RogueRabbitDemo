import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'

export const metadata: Metadata = {
  title: 'Payment Confirmed — Rouge Rabbit',
}

export default async function PreorderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const ref = typeof params.ref === 'string' ? params.ref : null

  return (
    <>
      <NavBar />
      <main style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: 520, width: '100%' }}>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            border: '1px solid #2A9D2A', padding: '8px 20px', marginBottom: 32,
          }}>
            <span style={{ color: '#2A9D2A', fontSize: 16 }}>✓</span>
            <span className="rr-mono" style={{ color: '#2A9D2A', fontSize: 11, letterSpacing: '.2em' }}>
              PAYMENT RECEIVED
            </span>
          </div>

          <h1 className="rr-display" style={{ fontSize: 40, margin: '0 0 16px', color: '#E6E6E6', lineHeight: 1 }}>
            YOUR PAIR IS SECURED.
          </h1>

          <p className="rr-mono" style={{ fontSize: 11, color: '#A6A6A8', lineHeight: 1.9, letterSpacing: '.1em', margin: '0 0 32px' }}>
            A CONFIRMATION EMAIL IS ON ITS WAY TO YOUR INBOX.
            YOUR EDITION NUMBER WILL BE ASSIGNED ONCE THE PRE-ORDER CLOSES.
          </p>

          {ref && (
            <div style={{
              border: '1px solid #3A3A3C', padding: '16px 20px', marginBottom: 32,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span className="rr-mono" style={{ fontSize: 10, color: '#A6A6A8', letterSpacing: '.16em' }}>
                REFERENCE
              </span>
              <span className="rr-mono" style={{ fontSize: 13, color: '#E6E6E6', letterSpacing: '.12em', fontWeight: 500 }}>
                {ref}
              </span>
            </div>
          )}

          <Link
            href="/shop"
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 24px',
              background: '#D90017',
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.16em',
              color: '#E6E6E6', textDecoration: 'none',
            }}
          >
            <span>CONTINUE SHOPPING</span>
            <span>→</span>
          </Link>

        </div>
      </main>
      <Footer />
    </>
  )
}
