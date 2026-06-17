import NavBar from './NavBar'
import Footer from './Footer'

interface PolicyLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export default function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '80px 40px 120px' }}>
        <div style={{ marginBottom: 48, borderBottom: '1px solid #3A3A3C', paddingBottom: 32 }}>
          <h1
            className="rr-display"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)', color: '#E6E6E6', margin: '0 0 14px' }}
          >
            {title}
          </h1>
          <p className="rr-mono">Last Updated: {lastUpdated}</p>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.85, color: '#C8C8CA' }}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
