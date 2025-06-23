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
    <div className={`list-container ${className}`}>
      {/* List Header */}
      <div className="list-header">
        <div className="list-header-content">
          <div className="list-title-section">
            <Building2 className="list-icon" />
            <div>
              <h1 className="list-title">取引先</h1>
              <p className="list-count">全 {totalItems} 件</p>
            </div>
          </div>
          <div className="list-actions">
            <button className="btn btn-outline">
              <Filter style={{ width: '16px', height: '16px' }} />
              フィルター
            </button>
            <button className="btn btn-outline">
              <Download style={{ width: '16px', height: '16px' }} />
              エクスポート
            </button>
            {hasPermission('accounts', 'create') && (
              <button className="btn btn-primary" onClick={() => router.push('/dashboard/accounts/new')}>
                <Plus style={{ width: '16px', height: '16px' }} />
                新規
              </button>
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
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input type="checkbox" style={{ borderRadius: '4px' }} />
                    </th>
                    <th>取引先名</th>
                    <th>業界</th>
                    <th>電話番号</th>
                    <th>年間売上</th>
                    <th>従業員数</th>
                    <th>状態</th>
                    <th style={{ width: '60px' }}>アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr 
                      key={account.Id}
                      onClick={() => handleRowClick(account)}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" style={{ borderRadius: '4px' }} />
                      </td>
                      <td>
                        <div className="table-cell-with-icon">
                          <div className="table-icon-wrapper">
                            <Building2 className="table-icon" />
                          </div>
                          <div>
                            <div className="table-cell-primary">
                              {account.Name}
                            </div>
                            {account.Type && (
                              <div className="table-cell-secondary">
                                {account.Type}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{account.Industry || '-'}</td>
                      <td>{account.Phone || '-'}</td>
                      <td>
                        {account.AnnualRevenue 
                          ? `¥${account.AnnualRevenue.toLocaleString('ja-JP')}`
                          : '-'
                        }
                      </td>
                      <td>{account.NumberOfEmployees?.toLocaleString() || '-'}</td>
                      <td>
                        <span className="status-badge active">
                          アクティブ
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                          <MoreVertical style={{ width: '16px', height: '16px' }} />
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