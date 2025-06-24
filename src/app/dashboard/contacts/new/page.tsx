import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { ContactCreateForm } from '@/components/contacts/ContactCreateForm'

export default async function NewContactPage({
  searchParams
}: {
  searchParams: Promise<{ accountId?: string }>
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  const params = await searchParams
  const accountId = params.accountId

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">新規取引先責任者</h1>
      <ContactCreateForm accountId={accountId} />
    </div>
  )
}