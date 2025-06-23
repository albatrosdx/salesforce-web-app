'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, Button } from '@/components'

const errorMessages: Record<string, string> = {
  Configuration: 'Salesforceの設定に問題があります。管理者に連絡してください。',
  AccessDenied: 'アクセスが拒否されました。適切な権限があることを確認してください。',
  Verification: '認証に失敗しました。もう一度お試しください。',
  Default: '認証中にエラーが発生しました。',
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'
  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="text-center space-y-6">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              認証エラー
            </h1>
            <p className="text-gray-600">{errorMessage}</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/signin">再度ログインする</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">ホームに戻る</Link>
            </Button>
          </div>

          {error !== 'Default' && (
            <details className="text-sm text-gray-500">
              <summary className="cursor-pointer">技術的詳細</summary>
              <p className="mt-2">エラーコード: {error}</p>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center space-y-6">
            <div>Loading...</div>
          </CardContent>
        </Card>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}