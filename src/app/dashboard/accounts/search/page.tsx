'use client'

import { PageHeader, TabNavigation, accountTabs } from '@/components'
import { AccountSearch } from '@/components/accounts'

export default function AccountSearchPage() {
  return (
    <>
      <PageHeader
        title="取引先検索"
        description="取引先名で検索して、該当する取引先を見つけます"
      >
        <TabNavigation tabs={accountTabs} />
      </PageHeader>

      <AccountSearch />
    </>
  )
}