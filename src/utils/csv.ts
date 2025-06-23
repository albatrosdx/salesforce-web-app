export interface CSVExportConfig {
  filename: string
  headers: { key: string; label: string }[]
  data: any[]
}

export function exportToCSV({ filename, headers, data }: CSVExportConfig) {
  // ヘッダー行を作成
  const headerRow = headers.map(h => `"${h.label}"`).join(',')
  
  // データ行を作成
  const dataRows = data.map(row => {
    return headers.map(h => {
      const value = getNestedValue(row, h.key)
      // 値をエスケープしてCSV形式に変換
      if (value === null || value === undefined) {
        return '""'
      }
      const stringValue = String(value)
      // ダブルクォートをエスケープ
      const escaped = stringValue.replace(/"/g, '""')
      // カンマ、改行、ダブルクォートが含まれる場合はダブルクォートで囲む
      if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
        return `"${escaped}"`
      }
      return escaped
    }).join(',')
  })

  // BOMを追加（Excelで日本語が文字化けしないように）
  const bom = '\uFEFF'
  const csvContent = bom + [headerRow, ...dataRows].join('\n')

  // Blobを作成してダウンロード
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}_${formatDateTime(new Date())}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ネストされたオブジェクトから値を取得
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// 日時をフォーマット（ファイル名用）
function formatDateTime(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}${month}${day}_${hours}${minutes}`
}