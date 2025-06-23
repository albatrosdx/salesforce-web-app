'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui'

export function SignInButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Button disabled loading>
        読み込み中...
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          こんにちは、{session.user?.name}さん
        </span>
        <Button
          variant="secondary"
          onClick={() => signOut()}
        >
          ログアウト
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => signIn('salesforce')}
    >
      Salesforceでログイン
    </Button>
  )
}