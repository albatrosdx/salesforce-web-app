import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { AccountCreateForm } from '@/components/accounts/AccountCreateForm'

export default async function NewAccountPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">新規取引先</h1>
      <AccountCreateForm />
    </div>
  )
}