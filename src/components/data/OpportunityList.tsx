'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Opportunity } from '@/types'
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table'
import { SearchInput } from '../ui/SearchInput'
import { Pagination } from '../ui/Pagination'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Button } from '../ui/Button'
import { Plus } from 'lucide-react'
import { usePermissions } from '@/lib/permissions'

interface OpportunityListProps {
  className?: string
}

interface OpportunitiesResponse {
  records: Opportunity[]
  totalSize: number
  done: boolean
}

export function OpportunityList({ className = '' }: OpportunityListProps) {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 20

  const fetchOpportunities = async (search: string = '', page: number = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        limit: itemsPerPage.toString()
      })
      
      const response = await fetch(`/api/salesforce/opportunities?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch opportunities')
      }
      
      const data: OpportunitiesResponse = await response.json()
      setOpportunities(data.records)
      setTotalItems(data.totalSize)
      setTotalPages(Math.ceil(data.totalSize / itemsPerPage))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOpportunities(searchTerm, currentPage)
  }, [searchTerm, currentPage])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleRowClick = (opportunity: Opportunity) => {
    router.push(`/dashboard/opportunities/${opportunity.Id}`)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const formatPercentage = (value: number) => {
    return `${value}%`
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">エラーが発生しました</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <Button onClick={() => fetchOpportunities(searchTerm, currentPage)}>
          再試行
        </Button>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">商談</h1>
        {hasPermission('opportunities', 'create') && (
          <Button onClick={() => router.push('/dashboard/opportunities/new')}>
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
          placeholder="商談を検索..."
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
                <TableCell header>商談名</TableCell>
                <TableCell header>取引先</TableCell>
                <TableCell header>ステージ</TableCell>
                <TableCell header>金額</TableCell>
                <TableCell header>確度</TableCell>
                <TableCell header>完了予定日</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opportunity) => (
                <TableRow 
                  key={opportunity.Id}
                  onClick={() => handleRowClick(opportunity)}
                >
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {opportunity.Name}
                    </div>
                    {opportunity.Type && (
                      <div className="text-sm text-gray-500">
                        {opportunity.Type}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {opportunity.Account?.Name || '-'}
                  </TableCell>
                  <TableCell>
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(opportunity.StageName)}`}
                    >
                      {opportunity.StageName}
                    </span>
                  </TableCell>
                  <TableCell>
                    {opportunity.Amount 
                      ? formatCurrency(opportunity.Amount)
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {opportunity.Probability !== null && opportunity.Probability !== undefined
                      ? formatPercentage(opportunity.Probability)
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {opportunity.CloseDate 
                      ? formatDate(opportunity.CloseDate)
                      : '-'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {opportunities.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm ? '検索条件に一致する商談が見つかりません' : '商談がありません'}
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