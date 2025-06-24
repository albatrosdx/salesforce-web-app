'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Account } from '@/types'
import { SearchInput } from '../ui/SearchInput'
import { Pagination } from '../ui/Pagination'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Button } from '../ui/Button'
import { Plus, Download, ChevronDown, Building2, MoreVertical } from 'lucide-react'
import { usePermissions } from '@/lib/permissions'
import { DataTableFilters, FilterConfig, FilterValue } from '@/components/common/DataTableFilters'

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
  const [activeFilters, setActiveFilters] = useState<FilterValue[]>([])
  const itemsPerPage = 20

  const filterConfigs: FilterConfig[] = [
    { field: 'Name', label: '取引先名', type: 'text' },
    { field: 'Type', label: '種別', type: 'select', options: [
      { value: 'Prospect', label: '見込み客' },
      { value: 'Customer - Direct', label: '顧客 - 直接' },
      { value: 'Customer - Channel', label: '顧客 - チャネル' },
      { value: 'Channel Partner / Reseller', label: 'チャネルパートナー・販売代理店' },
      { value: 'Installation Partner', label: '設置パートナー' },
      { value: 'Technology Partner', label: '技術パートナー' },
      { value: 'Other', label: 'その他' }
    ]},
    { field: 'Industry', label: '業界', type: 'select', options: [
      { value: 'Agriculture', label: '農業' },
      { value: 'Apparel', label: 'アパレル' },
      { value: 'Banking', label: '銀行業' },
      { value: 'Biotechnology', label: 'バイオテクノロジー' },
      { value: 'Chemicals', label: '化学' },
      { value: 'Communications', label: '通信' },
      { value: 'Construction', label: '建設' },
      { value: 'Consulting', label: 'コンサルティング' },
      { value: 'Education', label: '教育' },
      { value: 'Electronics', label: '電子機器' },
      { value: 'Energy', label: 'エネルギー' },
      { value: 'Engineering', label: 'エンジニアリング' },
      { value: 'Entertainment', label: 'エンターテイメント' },
      { value: 'Environmental', label: '環境' },
      { value: 'Finance', label: '金融' },
      { value: 'Food & Beverage', label: '飲食料品' },
      { value: 'Government', label: '政府機関' },
      { value: 'Healthcare', label: 'ヘルスケア' },
      { value: 'Hospitality', label: '接客業' },
      { value: 'Insurance', label: '保険' },
      { value: 'Machinery', label: '機械' },
      { value: 'Manufacturing', label: '製造業' },
      { value: 'Media', label: 'メディア' },
      { value: 'Not For Profit', label: '非営利団体' },
      { value: 'Recreation', label: 'レクリエーション' },
      { value: 'Retail', label: '小売' },
      { value: 'Shipping', label: '運送' },
      { value: 'Technology', label: 'テクノロジー' },
      { value: 'Telecommunications', label: '電気通信' },
      { value: 'Transportation', label: '輸送' },
      { value: 'Utilities', label: '公益事業' },
      { value: 'Other', label: 'その他' }
    ]},
    { field: 'Phone', label: '電話番号', type: 'text' }
  ]

  const fetchAccounts = async (search: string = '', page: number = 1, filters: FilterValue[] = []) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        limit: itemsPerPage.toString()
      })

      // Add filter parameters
      filters.forEach((filter, index) => {
        params.append(`filter_${index}_field`, filter.field)
        params.append(`filter_${index}_value`, filter.value)
        params.append(`filter_${index}_operator`, filter.operator || 'equals')
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
    fetchAccounts(searchTerm, currentPage, activeFilters)
  }, [searchTerm, currentPage, activeFilters])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleFiltersChange = (filters: FilterValue[]) => {
    setActiveFilters(filters)
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
            <DataTableFilters
              filters={filterConfigs}
              activeFilters={activeFilters}
              onFiltersChange={handleFiltersChange}
            />
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              エクスポート
            </Button>
            {hasPermission('accounts', 'create') && (
              <Button onClick={() => router.push('/dashboard/accounts/new')}>
                <Plus className="h-4 w-4 mr-2" />
                新規作成
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