'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Account } from '@/types'
import { SearchInput } from '../ui/SearchInput'
import { Pagination } from '../ui/Pagination'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Button } from '../ui/Button'
import { Plus, Filter, Download, ChevronDown, Building2, MoreVertical } from 'lucide-react'
import { usePermissions } from '@/lib/permissions'

interface AccountListProps {
  className?: string
}

interface AccountsResponse {
  records: Account[]
  totalSize: number
  done: boolean
}

export function AccountList({ className = '' }: AccountListProps) {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 20

  const fetchAccounts = async (search: string = '', page: number = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        limit: itemsPerPage.toString()
      })
      
      const response = await fetch(`/api/salesforce/accounts?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch accounts')
      }
      
      const data: AccountsResponse = await response.json()
      setAccounts(data.records)
      setTotalItems(data.totalSize)
      setTotalPages(Math.ceil(data.totalSize / itemsPerPage))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts(searchTerm, currentPage)
  }, [searchTerm, currentPage])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleRowClick = (account: Account) => {
    router.push(`/dashboard/accounts/${account.Id}`)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">エラーが発生しました</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <Button onClick={() => fetchAccounts(searchTerm, currentPage)}>
          再試行
        </Button>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* List Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building2 className="h-6 w-6 text-gray-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">取引先</h1>
              <p className="text-sm text-gray-500 mt-1">全 {totalItems} 件</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              フィルター
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              エクスポート
            </Button>
            {hasPermission('accounts', 'create') && (
              <Button onClick={() => router.push('/dashboard/accounts/new')}>
                <Plus className="h-4 w-4 mr-2" />
                新規
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <SearchInput
              value={searchTerm}
              onChange={handleSearch}
              onClear={() => handleSearch('')}
              placeholder="取引先を検索..."
              className="max-w-md"
            />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">表示:</span>
              <button className="flex items-center space-x-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                <span>すべての取引先</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      取引先名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      業界
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      電話番号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      年間売上
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      従業員数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状態
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">アクション</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <tr 
                      key={account.Id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(account)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              {account.Name}
                            </div>
                            {account.Type && (
                              <div className="text-sm text-gray-500">
                                {account.Type}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.Industry || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.Phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.AnnualRevenue 
                          ? `¥${account.AnnualRevenue.toLocaleString('ja-JP')}`
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.NumberOfEmployees?.toLocaleString() || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          アクティブ
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {accounts.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchTerm ? '検索条件に一致する取引先が見つかりません' : '取引先がありません'}
                </div>
              </div>
            )}

            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}