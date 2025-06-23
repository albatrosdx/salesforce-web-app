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
    
    // Salesforce APIを呼び出して取引先情報を取得
    const fields = [
      'Id', 'Name', 'Type', 'Industry', 'Phone', 'Website',
      'BillingStreet', 'BillingCity', 'BillingState', 'BillingPostalCode', 'BillingCountry',
      'Description', 'NumberOfEmployees', 'AnnualRevenue',
      'CreatedDate', 'LastModifiedDate', 'CreatedById', 'LastModifiedById'
    ].join(',')
    
    const url = `${session.instanceUrl}/services/data/v58.0/sobjects/Account/${id}?fields=${fields}`
    
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
        { error: 'Failed to fetch account' },
        { status: response.status }
      )
    }

    const account = await response.json()
    
    return NextResponse.json(account)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(
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
    const body = await request.json()
    
    const url = `${session.instanceUrl}/services/data/v58.0/sobjects/Account/${id}`
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Salesforce API error:', error)
      return NextResponse.json(
        { error: 'Failed to update account' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
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
    
    const url = `${session.instanceUrl}/services/data/v58.0/sobjects/Account/${id}`
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Salesforce API error:', error)
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}