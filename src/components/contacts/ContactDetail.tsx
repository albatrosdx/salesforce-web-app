'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Contact } from '@/types'  
import { Button } from '@/components/ui'
import { formatDate, formatPhone } from '@/lib/utils/format'
import { ActivityTimeline } from '@/components/activities/ActivityTimeline'
import { useActivitiesByWho } from '@/lib/salesforce/hooks'

interface ContactDetailProps {
  contact: Contact
  loading?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function ContactDetail({ 
  contact, 
  loading = false, 
  onEdit, 
  onDelete 
}: ContactDetailProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'activities' | 'other'>('details')
  
  // Fetch activities for this contact
  const { data: activitiesData, isLoading: activitiesLoading, error: activitiesError } = useActivitiesByWho(contact.Id)

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
              {contact.Name}
            </h3>
            {contact.Title && (
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {contact.Title}
                {contact.Department && ` - ${contact.Department}`}
              </p>
            )}
            {contact.Account?.Name && (
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                所属: <Link 
                  href={`/dashboard/accounts/${contact.AccountId}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {contact.Account.Name}
                </Link>
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            {onEdit && (
              <Button onClick={onEdit} variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                編集
              </Button>
            )}
            {onDelete && (
              <Button onClick={onDelete} variant="outline" className="text-red-600 hover:text-red-800">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                削除
              </Button>
            )}
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
                  <dt className="text-sm font-medium text-gray-500">氏名</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contact.Name}</dd>
                </div>
                {contact.FirstName && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">名</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.FirstName}</dd>
                  </div>
                )}
                {contact.LastName && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">姓</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.LastName}</dd>
                  </div>
                )}
                {contact.Title && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">役職</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.Title}</dd>
                  </div>
                )}
                {contact.Department && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">部門</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.Department}</dd>
                  </div>
                )}
                {contact.Account?.Name && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">所属取引先</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <Link 
                        href={`/dashboard/accounts/${contact.AccountId}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {contact.Account.Name}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* 連絡先情報 */}
            {(contact.Email || contact.Phone || contact.MobilePhone) && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">連絡先情報</h4>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  {contact.Email && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a href={`mailto:${contact.Email}`} className="text-blue-600 hover:text-blue-800">
                          {contact.Email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {contact.Phone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a href={`tel:${contact.Phone}`} className="text-blue-600 hover:text-blue-800">
                          {formatPhone(contact.Phone)}
                        </a>
                      </dd>
                    </div>
                  )}
                  {contact.MobilePhone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">携帯電話</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a href={`tel:${contact.MobilePhone}`} className="text-blue-600 hover:text-blue-800">
                          {formatPhone(contact.MobilePhone)}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* 住所情報 */}
            {(contact.MailingStreet || contact.MailingCity) && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">郵送先住所</h4>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">住所</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {contact.MailingStreet && (
                        <div>{contact.MailingStreet}</div>
                      )}
                      {(contact.MailingCity || contact.MailingState || contact.MailingPostalCode) && (
                        <div>
                          {contact.MailingCity}
                          {contact.MailingState && ` ${contact.MailingState}`}
                          {contact.MailingPostalCode && ` ${contact.MailingPostalCode}`}
                        </div>
                      )}
                      {contact.MailingCountry && (
                        <div>{contact.MailingCountry}</div>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* システム情報 */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">システム情報</h4>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">作成日</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(contact.CreatedDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">最終更新日</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(contact.LastModifiedDate)}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div>
            {activitiesError ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-red-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">エラーが発生しました</h3>
                <p className="text-gray-600">
                  活動データの取得中にエラーが発生しました: {activitiesError}
                </p>
              </div>
            ) : (
              <ActivityTimeline
                tasks={activitiesData?.tasks.records || []}
                events={activitiesData?.events.records || []}
                loading={activitiesLoading}
              />
            )}
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
    </div>
  )
}