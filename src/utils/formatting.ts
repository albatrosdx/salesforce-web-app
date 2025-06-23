// 日付フォーマット関数
export const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// 通貨フォーマット
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return ''
  
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount)
}

// 数値フォーマット
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return ''
  
  return new Intl.NumberFormat('ja-JP').format(num)
}

// パーセンテージフォーマット
export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return ''
  
  return `${value}%`
}

// 住所フォーマット
export const formatAddress = (address: {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
} | null | undefined): string => {
  if (!address) return ''
  
  const parts = [
    address.country,
    address.postalCode,
    address.state,
    address.city,
    address.street
  ].filter(Boolean)
  
  return parts.join(' ')
}

// 文字列切り詰め
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text
  
  return text.substring(0, maxLength) + '...'
}

// 相対時間表示
export const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes}分前`
    }
    return `${diffInHours}時間前`
  }
  
  if (diffInDays === 1) return '昨日'
  if (diffInDays < 7) return `${diffInDays}日前`
  
  return formatDate(dateString)
}