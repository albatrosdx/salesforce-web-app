'use client'

import { AccountSearch } from '@/components/accounts'

export default function AccountSearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">取引先検索</h1>
        <p className="text-gray-600 mt-1">取引先名で検索して、該当する取引先を見つけます</p>
      </div>
      
      <AccountSearch />
    </div>
  )
}