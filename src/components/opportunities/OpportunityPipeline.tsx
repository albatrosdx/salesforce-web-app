'use client'

import React from 'react'
import Link from 'next/link'
import { Opportunity } from '@/types'
import { formatCurrency, formatPercentage } from '@/lib/utils/format'

interface OpportunityPipelineProps {
  opportunities: Opportunity[]
  loading?: boolean
}

interface StageColumn {
  name: string
  displayName: string
  color: string
  opportunities: Opportunity[]
}

export function OpportunityPipeline({ opportunities, loading = false }: OpportunityPipelineProps) {
  // ステージ定義
  const stageDefinitions = [
    { name: 'Prospecting', displayName: '初期段階', color: 'bg-gray-50 border-gray-200' },
    { name: 'Qualification', displayName: '検討段階', color: 'bg-blue-50 border-blue-200' },
    { name: 'Needs Analysis', displayName: 'ニーズ分析', color: 'bg-yellow-50 border-yellow-200' },
    { name: 'Value Proposition', displayName: '提案段階', color: 'bg-orange-50 border-orange-200' },
    { name: 'Id. Decision Makers', displayName: '決裁者特定', color: 'bg-purple-50 border-purple-200' },
    { name: 'Proposal/Price Quote', displayName: '見積提示', color: 'bg-indigo-50 border-indigo-200' },
    { name: 'Negotiation/Review', displayName: '交渉段階', color: 'bg-pink-50 border-pink-200' },
    { name: 'Closed Won', displayName: '受注', color: 'bg-green-50 border-green-200' },
  ]

  // ステージ別に商談をグループ化
  const stageColumns: StageColumn[] = stageDefinitions.map(stage => ({
    ...stage,
    opportunities: opportunities.filter(opp => opp.StageName === stage.name)
  }))

  const getStageCardColor = (stage: string) => {
    switch (stage) {
      case 'Prospecting':
        return 'border-l-gray-400'
      case 'Qualification':
        return 'border-l-blue-400'
      case 'Needs Analysis':
        return 'border-l-yellow-400'
      case 'Value Proposition':
        return 'border-l-orange-400'
      case 'Id. Decision Makers':
        return 'border-l-purple-400'
      case 'Proposal/Price Quote':
        return 'border-l-indigo-400'
      case 'Negotiation/Review':
        return 'border-l-pink-400'
      case 'Closed Won':
        return 'border-l-green-400'
      default:
        return 'border-l-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 統計情報の計算
  const totalOpportunities = opportunities.length
  const totalAmount = opportunities.reduce((sum, opp) => sum + (opp.Amount || 0), 0)
  const weightedAmount = opportunities.reduce((sum, opp) => {
    const amount = opp.Amount || 0
    const probability = (opp.Probability || 0) / 100
    return sum + (amount * probability)
  }, 0)

  return (
    <div className="space-y-6">
      {/* 統計情報 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <dt className="text-sm font-medium text-gray-500">商談数</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalOpportunities}</dd>
            </div>
            <div className="text-center">
              <dt className="text-sm font-medium text-gray-500">総金額</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(totalAmount)}</dd>
            </div>
            <div className="text-center">
              <dt className="text-sm font-medium text-gray-500">加重平均金額</dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600">{formatCurrency(weightedAmount)}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* パイプライン */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 overflow-x-auto">
            {stageColumns.map((stage) => (
              <div key={stage.name} className={`${stage.color} border rounded-lg p-4 min-h-96`}>
                {/* ステージヘッダー */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 text-sm">{stage.displayName}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {stage.opportunities.length}件
                    {stage.opportunities.length > 0 && (
                      <span className="block">
                        {formatCurrency(
                          stage.opportunities.reduce((sum, opp) => sum + (opp.Amount || 0), 0)
                        )}
                      </span>
                    )}
                  </p>
                </div>

                {/* 商談カード */}
                <div className="space-y-3">
                  {stage.opportunities.map((opportunity) => (
                    <div 
                      key={opportunity.Id} 
                      className={`bg-white border-l-4 ${getStageCardColor(stage.name)} shadow-sm rounded-r-md p-3 hover:shadow-md transition-shadow`}
                    >
                      <Link href={`/dashboard/opportunities/${opportunity.Id}`} className="block">
                        <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                          {opportunity.Name}
                        </h4>
                        
                        {opportunity.Account?.Name && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                            {opportunity.Account.Name}
                          </p>
                        )}
                        
                        {opportunity.Amount && (
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {formatCurrency(opportunity.Amount)}
                          </p>
                        )}
                        
                        {opportunity.Probability !== null && opportunity.Probability !== undefined && (
                          <p className="text-xs text-gray-600 mb-2">
                            確度: {formatPercentage(opportunity.Probability)}
                          </p>
                        )}
                        
                        {opportunity.CloseDate && (
                          <p className="text-xs text-gray-500">
                            {new Date(opportunity.CloseDate).toLocaleDateString('ja-JP')}
                          </p>
                        )}
                        
                        {opportunity.Owner?.Name && (
                          <p className="text-xs text-gray-500 mt-1">
                            {opportunity.Owner.Name}
                          </p>
                        )}
                      </Link>
                    </div>
                  ))}
                  
                  {/* 空のステージメッセージ */}
                  {stage.opportunities.length === 0 && (
                    <div className="text-center py-8">
                      <svg
                        className="mx-auto h-8 w-8 text-gray-400 mb-2"
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
                      <p className="text-xs text-gray-500">商談なし</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}