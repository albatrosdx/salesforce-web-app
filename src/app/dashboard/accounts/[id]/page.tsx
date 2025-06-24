'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { AccountDetail, AccountEditForm } from '@/components/accounts'
import { useAccount, useContactsByAccount, useOpportunitiesByAccount } from '@/lib/salesforce/api-hooks'

export default function AccountDetailPage() {
  const params = useParams()
  const router = useRouter()
  const accountId = params.id as string
  const [isEditing, setIsEditing] = useState(false)

  const { data: account, isLoading: accountLoading, error: accountError } = useAccount(accountId)
  const { data: contactsData, isLoading: contactsLoading } = useContactsByAccount(accountId)
  const { data: opportunitiesData, isLoading: opportunitiesLoading } = useOpportunitiesByAccount(accountId)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
    // Refresh the page to reload data
    window.location.reload()
  }

  const handleDelete = () => {
    // TODO: Implement account deletion
    if (confirm('この取引先を削除してもよろしいですか？')) {
      console.log('Delete account:', accountId)
      // After deletion, redirect to accounts list
      // router.push('/dashboard/accounts')
    }
  }

  const handleBack = () => {
    router.back()
  }

  // エラー表示
  if (accountError) {
    return (
      <div className="space-y-6">
        {/* ナビゲーションヘッダー */}
        <div className="flex items-center space-x-4">
          <Button onClick={handleBack} variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            戻る
          </Button>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/dashboard/accounts" className="text-gray-500 hover:text-gray-700">
                  取引先
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-500">詳細</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* エラー表示 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">取引先が見つかりません</h3>
              <p className="text-gray-600 mb-4">{accountError}</p>
              <div className="flex justify-center space-x-4">
                <Button onClick={handleBack} variant="outline">
                  戻る
                </Button>
                <Button onClick={() => window.location.reload()}>
                  再試行
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ナビゲーションヘッダー */}
      <div className="flex items-center space-x-4">
        <Button onClick={handleBack} variant="outline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          戻る
        </Button>
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/dashboard/accounts" className="text-gray-500 hover:text-gray-700">
                取引先
              </Link>
            </li>
            <li>
              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-500">
                {account?.Name || '詳細'}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* 取引先詳細 */}
      {account && (
        isEditing ? (
          <AccountEditForm
            account={account}
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
          />
        ) : (
          <AccountDetail
            account={account}
            contacts={contactsData?.records || []}
            opportunities={opportunitiesData?.records || []}
            loading={accountLoading || contactsLoading || opportunitiesLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )
      )}
    </div>
  )
}