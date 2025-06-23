'use client'

import { ContactSearch } from '@/components/contacts'

export default function ContactSearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">取引先責任者検索</h1>
        <p className="text-gray-600 mt-1">取引先責任者を氏名やメールアドレスで検索して、該当する取引先責任者を見つけます</p>
      </div>
      
      <ContactSearch />
    </div>
  )
}