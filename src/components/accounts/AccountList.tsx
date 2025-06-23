'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Account } from '@/types'
import { Card, CardContent, Button } from '@/components/ui'
import { formatDate, formatCurrency, truncateText } from '@/utils'

interface AccountListProps {
  accounts: Account[]
  loading?: boolean
  onRefresh?: () => void
  onLoadMore?: () => void
  hasMore?: boolean
}

export function AccountList({ 
  accounts, 
  loading = false, 
  onRefresh, 
  onLoadMore,
  hasMore = false 
}: AccountListProps) {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    )
  }

  const handleSelectAll = () => {
    if (selectedAccounts.length === accounts.length) {
      setSelectedAccounts([])
    } else {
      setSelectedAccounts(accounts.map(account => account.Id))
    }
  }

  if (loading && accounts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-salesforce-blue mx-auto mb-4"></div>
            <p className="text-gray-500">取引先データを読み込み中...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">取引先が見つかりません</h3>
            <p className="text-gray-500 mb-4">検索条件を変更するか、新しい取引先を作成してください。</p>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline">
                再読み込み
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* リストヘッダー */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedAccounts.length === accounts.length && accounts.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-salesforce-blue focus:ring-salesforce-blue"
              />
              <span className="text-sm text-gray-700">
                {selectedAccounts.length > 0 
                  ? `${selectedAccounts.length}件選択中`
                  : `${accounts.length}件の取引先`
                }
              </span>
            </div>
            {onRefresh && (
              <Button
                onClick={onRefresh}
                variant="outline"
                size="sm"
                loading={loading}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                更新
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 取引先リスト */}
      <div className="space-y-2">
        {accounts.map((account) => (
          <Card key={account.Id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedAccounts.includes(account.Id)}
                  onChange={() => handleSelectAccount(account.Id)}
                  className="mt-1 rounded border-gray-300 text-salesforce-blue focus:ring-salesforce-blue"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/dashboard/accounts/${account.Id}`}
                        className="text-lg font-medium text-salesforce-blue hover:text-salesforce-darkblue transition-colors"
                      >
                        {account.Name}
                      </Link>
                      
                      <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        {account.Type && (
                          <div>
                            <span className="font-medium">種別:</span> {account.Type}
                          </div>
                        )}
                        {account.Industry && (
                          <div>
                            <span className="font-medium">業界:</span> {account.Industry}
                          </div>
                        )}
                        {account.Phone && (
                          <div>
                            <span className="font-medium">電話:</span> {account.Phone}
                          </div>
                        )}
                      </div>

                      {account.BillingAddress && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">住所:</span> 
                          {[
                            account.BillingAddress.state,
                            account.BillingAddress.city,
                            account.BillingAddress.street
                          ].filter(Boolean).join(' ')}
                        </div>
                      )}

                      {account.Description && (
                        <div className="mt-2 text-sm text-gray-600">
                          {truncateText(account.Description, 150)}
                        </div>
                      )}
                    </div>

                    <div className="ml-4 text-right text-sm text-gray-500">
                      {account.AnnualRevenue && (
                        <div className="font-medium text-gray-900">
                          {formatCurrency(account.AnnualRevenue)}
                        </div>
                      )}
                      {account.NumberOfEmployees && (
                        <div className="mt-1">
                          従業員数: {account.NumberOfEmployees}名
                        </div>
                      )}
                      <div className="mt-1">
                        更新: {formatDate(account.LastModifiedDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More ボタン */}
      {hasMore && onLoadMore && (
        <div className="text-center pt-4">
          <Button
            onClick={onLoadMore}
            variant="outline"
            loading={loading}
          >
            さらに読み込む
          </Button>
        </div>
      )}
    </div>
  )
}