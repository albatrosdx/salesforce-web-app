'use client'

import { PageHeader, TabNavigation, contactTabs, CreateButton } from '@/components'

export default function ContactsPage() {
  const handleCreateContact = () => {
    // TODO: Implement contact creation
    console.log('Create new contact')
  }

  return (
    <>
      <PageHeader
        title="取引先責任者"
        description="取引先責任者の一覧を表示し、管理します"
        actions={
          <CreateButton onClick={handleCreateContact}>
            新規取引先責任者
          </CreateButton>
        }
      >
        <TabNavigation tabs={contactTabs} />
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">取引先責任者データ</h3>
            <p className="mt-1 text-sm text-gray-500">
              Salesforceに接続して取引先責任者データを表示します。
            </p>
            <div className="mt-6">
              <CreateButton onClick={handleCreateContact}>
                新規取引先責任者を作成
              </CreateButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}