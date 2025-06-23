'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showInfo?: boolean
  totalItems?: number
  itemsPerPage?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  totalItems,
  itemsPerPage = 20
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      {showInfo && totalItems && (
        <div className="flex flex-1 justify-between sm:hidden">
          <span className="text-sm text-gray-700">
            {startItem} - {endItem} / {totalItems}件
          </span>
        </div>
      )}
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {showInfo && totalItems && (
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{startItem}</span> から{' '}
              <span className="font-medium">{endItem}</span> を表示（全{' '}
              <span className="font-medium">{totalItems}</span> 件中）
            </p>
          </div>
        )}
        
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="rounded-l-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {getVisiblePages().map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? 'primary' : 'outline'}
                size="sm"
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={page === '...'}
                className="rounded-none"
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded-r-md"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}