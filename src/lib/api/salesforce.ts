import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { SalesforceClient } from '@/lib/salesforce/client'

/**
 * サーバーサイドでSalesforceクライアントを作成するヘルパー関数
 */
export async function createSalesforceClient(): Promise<SalesforceClient | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken || !session?.instanceUrl) {
      console.error('Missing Salesforce session data:', {
        hasAccessToken: !!session?.accessToken,
        hasInstanceUrl: !!session?.instanceUrl
      })
      return null
    }

    return new SalesforceClient(
      session.instanceUrl,
      session.accessToken
    )
  } catch (error) {
    console.error('Failed to create Salesforce client:', error)
    return null
  }
}

/**
 * APIレスポンスのエラーハンドリング統一
 */
export function createApiResponse<T>(data: T, status: number = 200) {
  return Response.json(data, { status })
}

export function createApiError(message: string, status: number = 500) {
  return Response.json({ error: message }, { status })
}