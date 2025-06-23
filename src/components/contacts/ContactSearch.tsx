'use client'

import React, { useState, useEffect } from 'react'
import { ContactList } from './ContactList'
import { useContactSearch } from '@/lib/salesforce'

export function ContactSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  
  const { data, isLoading, error } = useContactSearch(debouncedSearchTerm)

  // デバウンス処理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleRefresh = () => {
    // 検索結果を再取得
    if (debouncedSearchTerm) {
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
      {/* 検索フォーム */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="max-w-lg">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              取引先責任者を検索
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                placeholder="氏名またはメールアドレスで検索..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              氏名またはメールアドレスの一部を入力してください
            </p>
          </div>
        </div>
      </div>

      {/* 検索結果 */}
      {debouncedSearchTerm ? (
        <>
          {/* 検索結果ヘッダー */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  検索結果
                </h3>
                <span className="text-sm text-gray-500">
                  「{debouncedSearchTerm}」の検索結果
                  {data && ` (${data.records.length}件)`}
                </span>
              </div>
            </div>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">検索エラー</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    再試行
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 検索結果リスト */}
          {!error && (
            <ContactList
              contacts={data?.records || []}
              loading={isLoading}
              onRefresh={handleRefresh}
            />
          )}
        </>
      ) : (
        /* 検索前の状態 */
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">取引先責任者を検索</h3>
              <p className="text-gray-600">
                上の検索フィールドに氏名またはメールアドレスを入力して検索してください。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}