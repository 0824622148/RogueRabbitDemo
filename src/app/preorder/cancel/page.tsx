import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'

export const metadata: Metadata = {
  title: 'Payment Cancelled — Rouge Rabbit',
}

export default async function PreorderCancelPage({
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
            border: '1px solid #D90017', padding: '8px 20px', marginBottom: 32,
          }}>
            <span style={{ color: '#D90017', fontSize: 14 }}>✕</span>
            <span className="rr-mono" style={{ color: '#D90017', fontSize: 11, letterSpacing: '.2em' }}>
              PAYMENT CANCELLED
            </span>
          </div>

          <h1 className="rr-display" style={{ fontSize: 40, margin: '0 0 16px', color: '#E6E6E6', lineHeight: 1 }}>
            NO PAYMENT TAKEN.
          </h1>

          <p className="rr-mono" style={{ fontSize: 11, color: '#A6A6A8', lineHeight: 1.9, letterSpacing: '.1em', margin: '0 0 32px' }}>
            YOUR SPOT HAS BEEN RELEASED. YOU CAN TRY AGAIN FROM THE PRODUCT PAGE BELOW.
          </p>

          {ref && (
            <div style={{
              border: '1px solid #3A3A3C', padding: '16px 20px', marginBottom: 32,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span className="rr-mono" style={{ fontSize: 10, color: '#A6A6A8', letterSpacing: '.16em' }}>
                CANCELLED REFERENCE
              </span>
              <span className="rr-mono" style={{ fontSize: 13, color: '#A6A6A8', letterSpacing: '.12em' }}>
                {ref}
              </span>
            </div>
          )}

          <Link
            href="/shop/rouge-01"
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 24px',
              background: '#D90017',
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.16em',
              color: '#E6E6E6', textDecoration: 'none',
            }}
          >
            <span>TRY AGAIN — ROUGE 01</span>
            <span>→</span>
          </Link>

        </div>
      </main>
      <Footer />
    </>
  )
}
