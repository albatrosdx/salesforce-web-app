'use client'

import { useState } from 'react'
import { PageHeader, TabNavigation, accountTabs, CreateButton } from '@/components'
import { AccountList } from '@/components/accounts'
import { useAccounts } from '@/lib/salesforce'

export default function AccountsPage() {
  const [page, setPage] = useState(0)
  const limit = 20
  const { data, isLoading, error } = useAccounts(limit, page * limit)

  const handleCreateAccount = () => {
    // TODO: Implement account creation
    console.log('Create new account')
  }

  const handleRefresh = () => {
    // リフレッシュロジックはuseAccountsフックが自動的に処理
    window.location.reload()
  }

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  return (
    <>
      <PageHeader
        title="取引先"
        description="取引先の一覧を表示し、管理します"
        actions={
          <CreateButton onClick={handleCreateAccount}>
            新規取引先
          </CreateButton>
        }
      >
        <TabNavigation tabs={accountTabs} />
      </PageHeader>

      {error ? (
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">データ取得エラー</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <CreateButton onClick={handleRefresh}>
                再試行
              </CreateButton>
            </div>
          </div>
        </div>
      ) : (
        <AccountList
          accounts={data?.records || []}
          loading={isLoading}
          onRefresh={handleRefresh}
          onLoadMore={data?.done ? undefined : handleLoadMore}
          hasMore={!data?.done}
        />
      )}
    </>
  )
}