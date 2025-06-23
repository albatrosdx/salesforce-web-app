'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { SignInButton } from '@/components/auth'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-salesforce-blue"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="flex justify-end mb-4">
          <SignInButton />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Salesforce Web App
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          モダンなUIでSalesforceデータを管理
        </p>
        
        <div className="card max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">アプリケーション機能</h2>
          <ul className="space-y-2 text-left">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-salesforce-blue rounded-full mr-3"></span>
              取引先管理
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-salesforce-blue rounded-full mr-3"></span>
              取引先責任者管理
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-salesforce-blue rounded-full mr-3"></span>
              商談管理
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-salesforce-blue rounded-full mr-3"></span>
              活動タイムライン
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}