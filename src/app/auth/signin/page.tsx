'use client'

import { signIn, getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, Button } from '@/components'

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkSession()
  }, [router])

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('salesforce', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="text-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Salesforce Web App
            </h1>
            <p className="text-gray-600">
              Salesforceアカウントでログインしてください
            </p>
            
            {error === 'SessionExpired' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  セッションの有効期限が切れました。再度ログインしてください。
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={handleSignIn}
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              Salesforceでログイン
            </Button>
            
            <p className="text-xs text-gray-500">
              ログインすることで、利用規約とプライバシーポリシーに同意したものとします。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}