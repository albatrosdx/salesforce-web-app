'use client'

import { useState } from 'react'
import { Account, Contact, Opportunity } from '@/types'
import { Card, CardContent, CardHeader, Button } from '@/components/ui'
import { formatDate, formatCurrency, formatAddress } from '@/utils'
import { ActivityTimeline } from '@/components/activities/ActivityTimeline'
import { useActivitiesByWhat } from '@/lib/salesforce/hooks'

interface AccountDetailProps {
  account: Account
  contacts?: Contact[]
  opportunities?: Opportunity[]
  loading?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function AccountDetail({ 
  account, 
  contacts = [], 
  opportunities = [],
  loading = false,
  onEdit,
  onDelete 
}: AccountDetailProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'contacts' | 'opportunities' | 'activities'>('details')
  
  // Fetch activities data for this account
  const { data: activities, isLoading: activitiesLoading } = useActivitiesByWhat(account.Id)

  const tabs = [
    { id: 'details', label: '詳細', count: null },
    { id: 'contacts', label: '取引先責任者', count: contacts.length },
    { id: 'opportunities', label: '商談', count: opportunities.length },
    { 
      id: 'activities', 
      label: '活動', 
      count: activities ? (activities.tasks.records.length + activities.events.records.length) : null 
    },
  ] as const

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-salesforce-blue mx-auto mb-4"></div>
            <p className="text-gray-500">取引先情報を読み込み中...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{account.Name}</h1>
              {account.Type && (
                <p className="text-sm text-gray-600 mt-1">種別: {account.Type}</p>
              )}
            </div>
            <div className="flex space-x-2">
              {onEdit && (
                <Button onClick={onEdit} variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  編集
                </Button>
              )}
              {onDelete && (
                <Button onClick={onDelete} variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  削除
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* タブナビゲーション */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-salesforce-blue text-salesforce-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`ml-2 ${
                      activeTab === tab.id ? 'bg-salesforce-blue text-white' : 'bg-gray-100 text-gray-900'
                    } py-0.5 px-2 rounded-full text-xs`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* タブコンテンツ */}
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 基本情報 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
                  <dl className="space-y-3">
                    {account.Industry && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">業界</dt>
                        <dd className="text-sm text-gray-900">{account.Industry}</dd>
                      </div>
                    )}
                    {account.Phone && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                        <dd className="text-sm text-gray-900">{account.Phone}</dd>
                      </div>
                    )}
                    {account.Website && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">ウェブサイト</dt>
                        <dd className="text-sm text-gray-900">
                          <a href={account.Website} target="_blank" rel="noopener noreferrer" 
                             className="text-salesforce-blue hover:text-salesforce-darkblue">
                            {account.Website}
                          </a>
                        </dd>
                      </div>
                    )}
                    {account.NumberOfEmployees && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">従業員数</dt>
                        <dd className="text-sm text-gray-900">{account.NumberOfEmployees}名</dd>
                      </div>
                    )}
                    {account.AnnualRevenue && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">年間売上</dt>
                        <dd className="text-sm text-gray-900">{formatCurrency(account.AnnualRevenue)}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* 住所情報 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">住所情報</h3>
                  {account.BillingAddress ? (
                    <div className="text-sm text-gray-900">
                      <p>{formatAddress(account.BillingAddress)}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">住所情報が登録されていません</p>
                  )}
                </div>

                {/* 説明 */}
                {account.Description && (
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">説明</h3>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{account.Description}</p>
                  </div>
                )}

                {/* システム情報 */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">システム情報</h3>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="font-medium text-gray-500">作成日</dt>
                      <dd className="text-gray-900">{formatDate(account.CreatedDate)}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500">最終更新日</dt>
                      <dd className="text-gray-900">{formatDate(account.LastModifiedDate)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">取引先責任者</h3>
                  <Button>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    新規作成
                  </Button>
                </div>

                {contacts.length > 0 ? (
                  <div className="space-y-3">
                    {contacts.map((contact) => (
                      <div key={contact.Id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{contact.Name}</h4>
                            {contact.Title && (
                              <p className="text-sm text-gray-600">{contact.Title}</p>
                            )}
                            {contact.Email && (
                              <p className="text-sm text-gray-600">{contact.Email}</p>
                            )}
                            {contact.Phone && (
                              <p className="text-sm text-gray-600">{contact.Phone}</p>
                            )}
                          </div>
                          <Button variant="outline" size="sm">
                            詳細
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <p className="text-gray-500">取引先責任者が登録されていません</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'opportunities' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">商談</h3>
                  <Button>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    新規作成
                  </Button>
                </div>

                {opportunities.length > 0 ? (
                  <div className="space-y-3">
                    {opportunities.map((opportunity) => (
                      <div key={opportunity.Id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{opportunity.Name}</h4>
                            <div className="mt-1 text-sm text-gray-600">
                              <span className="font-medium">ステージ:</span> {opportunity.StageName}
                            </div>
                            {opportunity.Amount && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">金額:</span> {formatCurrency(opportunity.Amount)}
                              </div>
                            )}
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">完了予定日:</span> {formatDate(opportunity.CloseDate)}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            詳細
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-500">商談が登録されていません</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activities' && (
              <ActivityTimeline
                tasks={activities?.tasks.records || []}
                events={activities?.events.records || []}
                loading={activitiesLoading}
                onRefresh={() => {
                  // Optional: Add refresh functionality
                  window.location.reload()
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}