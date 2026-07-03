/** Consistent section header for admin pages. Server component. */
export default function PageHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, letterSpacing: '.04em', color: '#E6E6E6', margin: 0 }}>
        {title}
      </h1>
      {subtitle && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', color: '#A6A6A8', marginTop: 6 }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}
