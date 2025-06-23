'use client'

import { useState, useEffect } from 'react'
import { Input, Button, Card, CardContent } from '@/components/ui'
import { useAccountSearch } from '@/lib/salesforce'
import { AccountList } from './AccountList'
import { debounce } from '@/utils'

export function AccountSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // 検索のデバウンス処理
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    handler()
  }, [searchTerm])

  const { data, isLoading, error } = useAccountSearch(debouncedSearchTerm, 20)

  const handleClear = () => {
    setSearchTerm('')
    setDebouncedSearchTerm('')
  }

  return (
    <div className="space-y-6">
      {/* 検索フォーム */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="取引先名を入力してください..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleClear}
              variant="outline"
              disabled={!searchTerm}
            >
              クリア
            </Button>
          </div>

          {/* 検索のヒント */}
          <div className="mt-4 text-sm text-gray-600">
            <p className="mb-2">検索のヒント:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>取引先名の一部を入力すると、部分一致で検索されます</li>
              <li>検索は自動的に実行されます（500ms後）</li>
              <li>最大20件まで表示されます</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* エラー表示 */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">検索エラー</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => setDebouncedSearchTerm(searchTerm)} variant="outline">
                再試行
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 検索状態メッセージ */}
      {!debouncedSearchTerm && !isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">取引先を検索</h3>
              <p className="text-gray-600">検索したい取引先名を入力してください</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 検索結果 */}
      {debouncedSearchTerm && (
        <>
          {/* 検索結果ヘッダー */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              検索結果: "{debouncedSearchTerm}"
            </h2>
            {data && !isLoading && (
              <span className="text-sm text-gray-600">
                {data.totalSize}件見つかりました
              </span>
            )}
          </div>

          {/* 検索結果リスト */}
          <AccountList
            accounts={data?.records || []}
            loading={isLoading}
            onRefresh={() => setDebouncedSearchTerm(searchTerm)}
          />
        </>
      )}
    </div>
  )
}