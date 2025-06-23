'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Opportunity } from '@/types'
import { Button } from '@/components/ui'
import { formatDate, formatCurrency, formatPercentage } from '@/lib/utils/format'

interface OpportunityListProps {
  opportunities: Opportunity[]
  loading?: boolean
  onRefresh?: () => void
  onLoadMore?: () => void
  hasMore?: boolean
}

export function OpportunityList({ 
  opportunities, 
  loading = false, 
  onRefresh, 
  onLoadMore, 
  hasMore = false 
}: OpportunityListProps) {
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOpportunities(opportunities.map(opportunity => opportunity.Id))
    } else {
      setSelectedOpportunities([])
    }
  }

  const handleSelectOpportunity = (opportunityId: string, checked: boolean) => {
    if (checked) {
      setSelectedOpportunities(prev => [...prev, opportunityId])
    } else {
      setSelectedOpportunities(prev => prev.filter(id => id !== opportunityId))
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Prospecting':
      case '初期段階':
        return 'bg-gray-100 text-gray-800'
      case 'Qualification':
      case '検討段階':
        return 'bg-blue-100 text-blue-800'
      case 'Needs Analysis':
      case 'ニーズ分析':
        return 'bg-yellow-100 text-yellow-800'
      case 'Value Proposition':
      case '提案段階':
        return 'bg-orange-100 text-orange-800'
      case 'Id. Decision Makers':
      case '決裁者特定':
        return 'bg-purple-100 text-purple-800'
      case 'Proposal/Price Quote':
      case '見積提示':
        return 'bg-indigo-100 text-indigo-800'
      case 'Negotiation/Review':
      case '交渉段階':
        return 'bg-pink-100 text-pink-800'
      case 'Closed Won':
      case '受注':
        return 'bg-green-100 text-green-800'
      case 'Closed Lost':
      case '失注':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading && opportunities.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (opportunities.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">商談が見つかりません</h3>
            <p className="text-gray-600 mb-4">
              商談が登録されていないか、検索条件に一致する商談がありません。
            </p>
            {onRefresh && (
              <Button onClick={onRefresh}>
                再読み込み
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* ヘッダー */}
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={selectedOpportunities.length === opportunities.length && opportunities.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span className="ml-3 text-sm text-gray-700">
              {selectedOpportunities.length > 0 ? `${selectedOpportunities.length}件選択中` : '全選択'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {onRefresh && (
              <Button variant="outline" onClick={onRefresh}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                更新
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* リスト */}
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {opportunities.map((opportunity) => (
            <li key={opportunity.Id} className="px-4 py-4 hover:bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectedOpportunities.includes(opportunity.Id)}
                  onChange={(e) => handleSelectOpportunity(opportunity.Id, e.target.checked)}
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link 
                              href={`/dashboard/opportunities/${opportunity.Id}`}
                              className="hover:text-blue-600"
                            >
                              {opportunity.Name}
                            </Link>
                          </h3>
                          {opportunity.Account?.Name && (
                            <p className="text-sm text-gray-600">
                              <Link 
                                href={`/dashboard/accounts/${opportunity.AccountId}`}
                                className="hover:text-blue-600"
                              >
                                {opportunity.Account.Name}
                              </Link>
                            </p>
                          )}
                          <div className="mt-1">
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(opportunity.StageName)}`}
                            >
                              {opportunity.StageName}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          {opportunity.Amount && (
                            <p className="text-lg font-semibold text-gray-900">
                              {formatCurrency(opportunity.Amount)}
                            </p>
                          )}
                          {opportunity.Probability !== null && opportunity.Probability !== undefined && (
                            <p className="text-sm text-gray-600">
                              確度: {formatPercentage(opportunity.Probability)}
                            </p>
                          )}
                          {opportunity.CloseDate && (
                            <p className="text-sm text-gray-600">
                              完了予定: {formatDate(opportunity.CloseDate)}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          {opportunity.Owner?.Name && (
                            <p className="text-sm text-gray-900">
                              所有者: {opportunity.Owner.Name}
                            </p>
                          )}
                          {opportunity.Type && (
                            <p className="text-sm text-gray-600">
                              種別: {opportunity.Type}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {formatDate(opportunity.LastModifiedDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* フッター */}
      {(onLoadMore || loading) && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              {opportunities.length}件の商談を表示中
            </p>
            {onLoadMore && hasMore && (
              <Button 
                onClick={onLoadMore} 
                variant="outline"
                disabled={loading}
              >
                {loading ? '読み込み中...' : 'さらに読み込む'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}