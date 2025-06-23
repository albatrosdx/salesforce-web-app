export * from './salesforce'

// 共通UI型定義
export interface TabItem {
  id: string
  label: string
  href: string
  icon?: string
}

export interface ListViewColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
}

export interface FilterOption {
  label: string
  value: string
}

export interface SearchParams {
  query?: string
  filters?: Record<string, string>
  sort?: {
    field: string
    direction: 'asc' | 'desc'
  }
  page?: number
  limit?: number
}

// エラー型
export interface ApiError {
  message: string
  errorCode?: string
  fields?: string[]
}

// ローディング状態
export interface LoadingState {
  isLoading: boolean
  error?: string | null
}