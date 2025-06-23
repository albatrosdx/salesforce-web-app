'use client'

import { PageHeader, TabNavigation, contactTabs } from '@/components'
import { ContactSearch } from '@/components/contacts'

export default function ContactSearchPage() {
  return (
    <>
      <PageHeader
        title="取引先責任者検索"
        description="取引先責任者を氏名やメールアドレスで検索して、該当する取引先責任者を見つけます"
      >
        <TabNavigation tabs={contactTabs} />
      </PageHeader>

      <ContactSearch />
    </>
  )
}