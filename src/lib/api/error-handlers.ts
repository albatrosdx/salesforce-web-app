import { signOut } from 'next-auth/react'

export interface ApiError {
  error: string
  message: string
  code?: string
  details?: any[]
  statusCode?: number
}

/**
 * APIエラーをチェックして、認証エラーの場合は自動的にサインアウトする
 */
export async function handleApiError(error: ApiError): Promise<void> {
  // JWT認証エラーまたはセッション切れの場合
  if (
    error.code === 'INVALID_JWT_FORMAT' || 
    error.code === 'SESSION_EXPIRED' ||
    error.statusCode === 401
  ) {
    console.error('Authentication error detected:', error)
    
    // サインアウトしてログインページにリダイレクト
    await signOut({ 
      callbackUrl: '/auth/signin?error=SessionExpired',
      redirect: true 
    })
  }
}

/**
 * APIレスポンスをチェックして、エラーがある場合は処理する
 */
export async function checkApiResponse(response: Response): Promise<void> {
  if (!response.ok && response.status === 401) {
    const errorData = await response.json() as ApiError
    await handleApiError(errorData)
  }
}