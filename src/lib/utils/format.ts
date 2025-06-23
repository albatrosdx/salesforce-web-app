/**
 * 日付フォーマット関数
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return dateString
  }
}

/**
 * 通貨フォーマット関数（日本円）
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '-'
  
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount)
}

/**
 * 電話番号フォーマット関数
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return ''
  
  // 日本の電話番号の基本的なフォーマット
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    // 03-XXXX-XXXX (固定電話)
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    // 090-XXXX-XXXX (携帯電話) or 03-XXXX-XXXX (固定電話)
    if (cleaned.startsWith('09')) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    } else {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    }
  }
  
  // フォーマットできない場合はそのまま返す
  return phone
}

/**
 * 住所フォーマット関数
 */
export function formatAddress(
  street?: string | null,
  city?: string | null,
  state?: string | null,
  postalCode?: string | null,
  country?: string | null
): string {
  const parts = [street, city, state, postalCode, country].filter(Boolean)
  return parts.join(' ')
}

/**
 * 文字切り詰め関数
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return ''
  
  if (text.length <= maxLength) return text
  
  return text.substring(0, maxLength) + '...'
}

/**
 * 数値フォーマット関数（従業員数など）
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '-'
  
  return new Intl.NumberFormat('ja-JP').format(num)
}

/**
 * パーセンテージフォーマット関数（確度など）
 */
export function formatPercentage(percentage: number | null | undefined): string {
  if (percentage === null || percentage === undefined) return '-'
  
  return new Intl.NumberFormat('ja-JP', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(percentage / 100)
}

/**
 * 日時フォーマット関数（詳細表示用）
 */
export function formatDateTime(dateString: string): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  } catch {
    return dateString
  }
}

/**
 * 期間フォーマット関数（イベント用）
 */
export function formatDuration(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return ''
  
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const startTime = new Intl.DateTimeFormat('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(start)
    
    const endTime = new Intl.DateTimeFormat('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(end)
    
    return `${startTime} - ${endTime}`
  } catch {
    return ''
  }
}

/**
 * 相対時間フォーマット関数
 */
export function formatRelativeTime(dateString: string): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    if (diffDays > 0) {
      return `${diffDays}日前`
    } else if (diffHours > 0) {
      return `${diffHours}時間前`
    } else if (diffMinutes > 0) {
      return `${diffMinutes}分前`
    } else {
      return 'たった今'
    }
  } catch {
    return dateString
  }
}