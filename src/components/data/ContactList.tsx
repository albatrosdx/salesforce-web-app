'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Contact } from '@/types'
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table'
import { SearchInput } from '../ui/SearchInput'
import { Pagination } from '../ui/Pagination'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Button } from '../ui/Button'
import { Plus, Mail, Phone } from 'lucide-react'
import { usePermissions } from '@/lib/permissions'
import { DataTableFilters, FilterConfig, FilterValue } from '@/components/common/DataTableFilters'

interface ContactListProps {
  className?: string
}

interface ContactsResponse {
  records: Contact[]
  totalSize: number
  done: boolean
}

export function ContactList({ className = '' }: ContactListProps) {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [activeFilters, setActiveFilters] = useState<FilterValue[]>([])
  const itemsPerPage = 20

  const filterConfigs: FilterConfig[] = [
    { field: 'Name', label: '氏名', type: 'text' },
    { field: 'FirstName', label: '名', type: 'text' },
    { field: 'LastName', label: '姓', type: 'text' },
    { field: 'Email', label: 'メール', type: 'text' },
    { field: 'Phone', label: '電話番号', type: 'text' },
    { field: 'Title', label: '役職', type: 'text' },
    { field: 'Department', label: '部署', type: 'text' }
  ]

  const fetchContacts = async (search: string = '', page: number = 1, filters: FilterValue[] = []) => {
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
      
      const response = await fetch(`/api/salesforce/contacts?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch contacts')
      }
      
      const data: ContactsResponse = await response.json()
      setContacts(data.records)
      setTotalItems(data.totalSize)
      setTotalPages(Math.ceil(data.totalSize / itemsPerPage))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts(searchTerm, currentPage, activeFilters)
  }, [searchTerm, currentPage, activeFilters])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleFiltersChange = (filters: FilterValue[]) => {
    setActiveFilters(filters)
    setCurrentPage(1)
  }

  const handleRowClick = (contact: Contact) => {
    router.push(`/dashboard/contacts/${contact.Id}`)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">エラーが発生しました</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <Button onClick={() => fetchContacts(searchTerm, currentPage)}>
          再試行
        </Button>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">取引先責任者</h1>
        <div className="flex items-center gap-2">
          <DataTableFilters
            filters={filterConfigs}
            activeFilters={activeFilters}
            onFiltersChange={handleFiltersChange}
          />
          {hasPermission('contacts', 'create') && (
            <Button onClick={() => router.push('/dashboard/contacts/new')}>
              <Plus className="h-4 w-4 mr-2" />
              新規作成
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          onClear={() => handleSearch('')}
          placeholder="取引先責任者を検索..."
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
                <TableCell header>氏名</TableCell>
                <TableCell header>取引先</TableCell>
                <TableCell header>役職</TableCell>
                <TableCell header>連絡先</TableCell>
                <TableCell header>部門</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow 
                  key={contact.Id}
                  onClick={() => handleRowClick(contact)}
                >
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {contact.Name}
                    </div>
                    {contact.Title && (
                      <div className="text-sm text-gray-500">
                        {contact.Title}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.Account?.Name || '-'}
                  </TableCell>
                  <TableCell>
                    {contact.Title || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {contact.Email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {contact.Email}
                        </div>
                      )}
                      {contact.Phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {contact.Phone}
                        </div>
                      )}
                      {!contact.Email && !contact.Phone && '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.Department || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {contacts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm ? '検索条件に一致する取引先責任者が見つかりません' : '取引先責任者がありません'}
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