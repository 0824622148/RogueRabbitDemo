import AdminShell from '@/components/admin/AdminShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#0F0F10', minHeight: '100vh', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
