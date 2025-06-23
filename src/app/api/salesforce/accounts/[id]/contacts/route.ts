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
    
    // 取引先に関連する取引先責任者を取得
    const soql = `
      SELECT Id, FirstName, LastName, Email, Phone, Title, AccountId, Account.Name,
             CreatedDate, LastModifiedDate
      FROM Contact
      WHERE AccountId = '${id}'
      ORDER BY LastName, FirstName
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
        { error: 'Failed to fetch contacts' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    return handleApiError(error)
  }
}