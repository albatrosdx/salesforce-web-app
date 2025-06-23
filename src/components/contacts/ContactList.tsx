'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Contact } from '@/types'
import { Button } from '@/components/ui'
import { formatDate, formatPhone } from '@/lib/utils/format'

interface ContactListProps {
  contacts: Contact[]
  loading?: boolean
  onRefresh?: () => void
  onLoadMore?: () => void
  hasMore?: boolean
}

export function ContactList({ 
  contacts, 
  loading = false, 
  onRefresh, 
  onLoadMore, 
  hasMore = false 
}: ContactListProps) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(contacts.map(contact => contact.Id))
    } else {
      setSelectedContacts([])
    }
  }

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, contactId])
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId))
    }
  }

  if (loading && contacts.length === 0) {
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

  if (contacts.length === 0) {
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">取引先責任者が見つかりません</h3>
            <p className="text-gray-600 mb-4">
              取引先責任者が登録されていないか、検索条件に一致する取引先責任者がありません。
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
              checked={selectedContacts.length === contacts.length && contacts.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span className="ml-3 text-sm text-gray-700">
              {selectedContacts.length > 0 ? `${selectedContacts.length}件選択中` : '全選択'}
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
          {contacts.map((contact) => (
            <li key={contact.Id} className="px-4 py-4 hover:bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectedContacts.includes(contact.Id)}
                  onChange={(e) => handleSelectContact(contact.Id, e.target.checked)}
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link 
                              href={`/dashboard/contacts/${contact.Id}`}
                              className="hover:text-blue-600"
                            >
                              {contact.Name}
                            </Link>
                          </h3>
                          {contact.Title && (
                            <p className="text-sm text-gray-600">{contact.Title}</p>
                          )}
                          {contact.Department && (
                            <p className="text-sm text-gray-500">{contact.Department}</p>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          {contact.Account?.Name && (
                            <p className="text-sm font-medium text-gray-900">
                              <Link 
                                href={`/dashboard/accounts/${contact.AccountId}`}
                                className="hover:text-blue-600"
                              >
                                {contact.Account.Name}
                              </Link>
                            </p>
                          )}
                          {contact.Email && (
                            <p className="text-sm text-gray-600">
                              <a href={`mailto:${contact.Email}`} className="hover:text-blue-600">
                                {contact.Email}
                              </a>
                            </p>
                          )}
                          {contact.Phone && (
                            <p className="text-sm text-gray-600">
                              <a href={`tel:${contact.Phone}`} className="hover:text-blue-600">
                                {formatPhone(contact.Phone)}
                              </a>
                            </p>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          {contact.MailingStreet && (
                            <div className="text-sm text-gray-600">
                              <p>{contact.MailingStreet}</p>
                              {contact.MailingCity && (
                                <p>
                                  {contact.MailingCity}
                                  {contact.MailingState && ` ${contact.MailingState}`}
                                  {contact.MailingPostalCode && ` ${contact.MailingPostalCode}`}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {formatDate(contact.LastModifiedDate)}
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
              {contacts.length}件の取引先責任者を表示中
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