import { ReactNode } from 'react'
import { Button } from '@/components/ui'

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, description, children, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            {actions}
          </div>
        )}
      </div>
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
}

// よく使用されるアクションボタンのプリセット
interface CreateButtonProps {
  onClick: () => void
  children: ReactNode
  loading?: boolean
}

export function CreateButton({ onClick, children, loading }: CreateButtonProps) {
  return (
    <Button onClick={onClick} loading={loading}>
      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      {children}
    </Button>
  )
}

interface RefreshButtonProps {
  onClick: () => void
  loading?: boolean
}

export function RefreshButton({ onClick, loading }: RefreshButtonProps) {
  return (
    <Button variant="outline" onClick={onClick} loading={loading}>
      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      更新
    </Button>
  )
}