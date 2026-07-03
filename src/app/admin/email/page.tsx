import PageHeader from '@/components/admin/PageHeader'
import EmailComposer from '@/components/admin/EmailComposer'
import { getMembers } from '@/lib/admin/queries'

export const dynamic = 'force-dynamic'

export default async function EmailPage() {
  const members = await getMembers()
  const recipientCount = members.filter((m) => !m.unsubscribed && m.email).length

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>
      <PageHeader title="Email Members" subtitle={`${recipientCount} SUBSCRIBED RECIPIENTS`} />
      <EmailComposer recipientCount={recipientCount} />
    </div>
  )
}
