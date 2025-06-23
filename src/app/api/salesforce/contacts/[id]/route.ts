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
    
    // Salesforce APIを呼び出して取引先責任者情報を取得
    const fields = [
      'Id', 'FirstName', 'LastName', 'Email', 'Phone', 'MobilePhone',
      'Title', 'Department', 'AccountId', 'Account.Name',
      'MailingStreet', 'MailingCity', 'MailingState', 'MailingPostalCode', 'MailingCountry',
      'Description', 'LeadSource',
      'CreatedDate', 'LastModifiedDate', 'CreatedById', 'LastModifiedById'
    ].join(',')
    
    const url = `${session.instanceUrl}/services/data/v58.0/sobjects/Contact/${id}?fields=${fields}`
    
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
        { error: 'Failed to fetch contact' },
        { status: response.status }
      )
    }

    const contact = await response.json()
    
    return NextResponse.json(contact)
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
    
    const url = `${session.instanceUrl}/services/data/v58.0/sobjects/Contact/${id}`
    
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
        { error: 'Failed to update contact' },
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
    
    const url = `${session.instanceUrl}/services/data/v58.0/sobjects/Contact/${id}`
    
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
        { error: 'Failed to delete contact' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}