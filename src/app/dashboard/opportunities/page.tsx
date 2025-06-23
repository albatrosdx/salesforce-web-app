'use client'

import { PageHeader, TabNavigation, opportunityTabs, CreateButton } from '@/components'

export default function OpportunitiesPage() {
  const handleCreateOpportunity = () => {
    // TODO: Implement opportunity creation
    console.log('Create new opportunity')
  }

  return (
    <>
      <PageHeader
        title="商談"
        description="商談の一覧を表示し、管理します"
        actions={
          <CreateButton onClick={handleCreateOpportunity}>
            新規商談
          </CreateButton>
        }
      >
        <TabNavigation tabs={opportunityTabs} />
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">商談データ</h3>
            <p className="mt-1 text-sm text-gray-500">
              Salesforceに接続して商談データを表示します。
            </p>
            <div className="mt-6">
              <CreateButton onClick={handleCreateOpportunity}>
                新規商談を作成
              </CreateButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}