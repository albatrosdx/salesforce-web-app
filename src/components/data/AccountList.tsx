'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Account } from '@/types'
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table'
import { SearchInput } from '../ui/SearchInput'
import { Pagination } from '../ui/Pagination'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Button } from '../ui/Button'
import { Plus } from 'lucide-react'
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
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">取引先</h1>
        {hasPermission('accounts', 'create') && (
          <Button onClick={() => router.push('/dashboard/accounts/new')}>
            <Plus className="h-4 w-4 mr-2" />
            新規作成
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          onClear={() => handleSearch('')}
          placeholder="取引先を検索..."
        />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>取引先名</TableCell>
                <TableCell header>業界</TableCell>
                <TableCell header>電話番号</TableCell>
                <TableCell header>年間売上</TableCell>
                <TableCell header>従業員数</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow 
                  key={account.Id}
                  onClick={() => handleRowClick(account)}
                >
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {account.Name}
                    </div>
                    {account.Type && (
                      <div className="text-sm text-gray-500">
                        {account.Type}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {account.Industry || '-'}
                  </TableCell>
                  <TableCell>
                    {account.Phone || '-'}
                  </TableCell>
                  <TableCell>
                    {account.AnnualRevenue 
                      ? `¥${account.AnnualRevenue.toLocaleString()}`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {account.NumberOfEmployees 
                      ? `${account.NumberOfEmployees}名`
                      : '-'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {accounts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm ? '検索条件に一致する取引先が見つかりません' : '取引先がありません'}
              </div>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}