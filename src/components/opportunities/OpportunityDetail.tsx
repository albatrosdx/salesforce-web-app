'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Opportunity } from '@/types'  
import { Button } from '@/components/ui'
import { formatDate, formatCurrency, formatPercentage } from '@/lib/utils/format'
import { ActivityTimeline, ActivityCreateModal } from '@/components/activities'
import { EditPermissionGate, DeletePermissionGate, CreatePermissionGate, PermissionDenied } from '@/components/permissions'
import { useActivitiesByWhat } from '@/lib/salesforce/hooks'
import { useOpportunityPermissions } from '@/lib/permissions/hooks'

interface OpportunityDetailProps {
  opportunity: Opportunity
  loading?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function OpportunityDetail({ 
  opportunity, 
  loading = false, 
  onEdit, 
  onDelete 
}: OpportunityDetailProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'activities' | 'other'>('details')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  // Fetch activities data for this opportunity
  const { data: activities, isLoading: activitiesLoading } = useActivitiesByWhat(opportunity.Id)
  
  // Check opportunity permissions
  const { canViewOpportunity } = useOpportunityPermissions()
  
  // If user cannot view opportunities, show permission denied
  if (!canViewOpportunity) {
    return <PermissionDenied object="opportunities" action="read" />
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

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
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
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {opportunity.Name}
            </h3>
            <div className="mt-2 flex items-center space-x-4">
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(opportunity.StageName)}`}
              >
                {opportunity.StageName}
              </span>
              {opportunity.Amount && (
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(opportunity.Amount)}
                </span>
              )}
              {opportunity.Probability !== null && opportunity.Probability !== undefined && (
                <span className="text-sm text-gray-600">
                  確度: {formatPercentage(opportunity.Probability)}
                </span>
              )}
            </div>
            {opportunity.Account?.Name && (
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                取引先: <Link 
                  href={`/dashboard/accounts/${opportunity.AccountId}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {opportunity.Account.Name}
                </Link>
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <EditPermissionGate object="opportunities">
              {onEdit && (
                <Button onClick={onEdit} variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  編集
                </Button>
              )}
            </EditPermissionGate>
            <DeletePermissionGate object="opportunities">
              {onDelete && (
                <Button onClick={onDelete} variant="outline" className="text-red-600 hover:text-red-800">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  削除
                </Button>
              )}
            </DeletePermissionGate>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-4 sm:px-6">
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            詳細
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'activities'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('activities')}
          >
            活動
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'other'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('other')}
          >
            その他
          </button>
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="px-4 py-5 sm:p-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* 基本情報 */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">基本情報</h4>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">商談名</dt>
                  <dd className="mt-1 text-sm text-gray-900">{opportunity.Name}</dd>
                </div>
                {opportunity.Account?.Name && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">取引先</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <Link 
                        href={`/dashboard/accounts/${opportunity.AccountId}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {opportunity.Account.Name}
                      </Link>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">ステージ</dt>
                  <dd className="mt-1">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(opportunity.StageName)}`}
                    >
                      {opportunity.StageName}
                    </span>
                  </dd>
                </div>
                {opportunity.Type && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">種別</dt>
                    <dd className="mt-1 text-sm text-gray-900">{opportunity.Type}</dd>
                  </div>
                )}
                {opportunity.LeadSource && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">リードソース</dt>
                    <dd className="mt-1 text-sm text-gray-900">{opportunity.LeadSource}</dd>
                  </div>
                )}
                {opportunity.Owner?.Name && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">所有者</dt>
                    <dd className="mt-1 text-sm text-gray-900">{opportunity.Owner.Name}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* 売上予測 */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">売上予測</h4>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                {opportunity.Amount && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">金額</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {formatCurrency(opportunity.Amount)}
                    </dd>
                  </div>
                )}
                {opportunity.Probability !== null && opportunity.Probability !== undefined && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">確度</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatPercentage(opportunity.Probability)}
                    </dd>
                  </div>
                )}
                {opportunity.CloseDate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">完了予定日</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(opportunity.CloseDate)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* 説明 */}
            {opportunity.Description && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">説明</h4>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {opportunity.Description}
                  </p>
                </div>
              </div>
            )}

            {/* システム情報 */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">システム情報</h4>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">作成日</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(opportunity.CreatedDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">最終更新日</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(opportunity.LastModifiedDate)}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">活動</h3>
              <CreatePermissionGate object="activities">
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  新しい活動を作成
                </Button>
              </CreatePermissionGate>
            </div>
            
            <ActivityTimeline
              tasks={activities?.tasks.records || []}
              events={activities?.events.records || []}
              loading={activitiesLoading}
              onRefresh={() => {
                // Optional: Add refresh functionality
                window.location.reload()
              }}
            />
          </div>
        )}

        {activeTab === 'other' && (
          <div className="text-center py-12">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">その他の情報</h3>
            <p className="text-gray-600">
              その他の関連情報は今後実装予定です。
            </p>
          </div>
        )}
      </div>

      {/* Activity Creation Modal */}
      <ActivityCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(activityId, activityType) => {
          console.log(`Created ${activityType} with ID: ${activityId}`)
          // Refresh activities data
          window.location.reload()
        }}
        defaultValues={{
          WhatId: opportunity.Id,
          Subject: `${opportunity.Name}に関する活動`
        }}
      />
    </div>
  )
}