import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

/**
 * APIミドルウェアでセッションをチェックし、無効な場合は401を返す
 */
export async function withAuth(
  handler: (req: Request, context?: any) => Promise<Response>
) {
  return async (req: Request, context?: any) => {
    try {
      const session = await getServerSession(authOptions)
      
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'セッションが無効です。再度ログインしてください。' },
          { status: 401 }
        )
      }
      
      // セッション情報をリクエストに追加
      const modifiedReq = req as any
      modifiedReq.session = session
      
      return handler(modifiedReq, context)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'サーバーエラーが発生しました。' },
        { status: 500 }
      )
    }
  }
}

/**
 * Salesforce APIエラーをチェックして、セッション切れの場合は401を返す
 */
export function handleSalesforceError(error: any): Response {
  if (error.statusCode === 401 || error.message?.includes('Session expired')) {
    return NextResponse.json(
      { 
        error: 'Session Expired', 
        message: 'Salesforceセッションが期限切れです。再度ログインしてください。',
        code: 'SESSION_EXPIRED'
      },
      { status: 401 }
    )
  }
  
  // その他のエラー
  return NextResponse.json(
    { 
      error: error.message || 'Unknown error',
      details: error.salesforceErrors || []
    },
    { status: error.statusCode || 500 }
  )
}