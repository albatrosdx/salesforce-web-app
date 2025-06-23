import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { handleApiError } from '@/lib/api/errors'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken || !session?.instanceUrl) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    
    // 取引先に関連する商談を取得
    const soql = `
      SELECT Id, Name, StageName, Amount, CloseDate, AccountId, Account.Name,
             Probability, Type, LeadSource, IsClosed, IsWon,
             CreatedDate, LastModifiedDate
      FROM Opportunity
      WHERE AccountId = '${id}'
      ORDER BY CloseDate DESC
      LIMIT 100
    `
    
    const url = `${session.instanceUrl}/services/data/v58.0/query/?q=${encodeURIComponent(soql)}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Salesforce API error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch opportunities' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    return handleApiError(error)
  }
}