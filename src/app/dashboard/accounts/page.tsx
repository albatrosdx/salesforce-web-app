'use client'

import { PageHeader, TabNavigation, accountTabs, CreateButton } from '@/components'

export default function AccountsPage() {
  const handleCreateAccount = () => {
    // TODO: Implement account creation
    console.log('Create new account')
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

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">取引先データ</h3>
            <p className="mt-1 text-sm text-gray-500">
              Salesforceに接続して取引先データを表示します。
            </p>
            <div className="mt-6">
              <CreateButton onClick={handleCreateAccount}>
                新規取引先を作成
              </CreateButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}