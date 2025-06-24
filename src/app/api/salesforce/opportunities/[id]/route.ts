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
    
    // Salesforce APIを呼び出して商談情報を取得
    const fields = [
      'Id', 'Name', 'AccountId', 'Account.Name', 'StageName', 'Amount',
      'Probability', 'CloseDate', 'Type', 'NextStep', 'LeadSource',
      'IsClosed', 'IsWon', 'ForecastCategory', 'ForecastCategoryName',
      'Description', 'HasOpportunityLineItem',
      'CreatedDate', 'LastModifiedDate', 'CreatedById', 'LastModifiedById'
    ].join(',')
    
    const url = `${session.instanceUrl}/services/data/v58.0/sobjects/Opportunity/${id}?fields=${fields}`
    
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
        { error: 'Failed to fetch opportunity' },
        { status: response.status }
      )
    }

    const opportunity = await response.json()
    
    return NextResponse.json(opportunity)
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
    
    const url = `${session.instanceUrl}/services/data/v58.0/sobjects/Opportunity/${id}`
    
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
        { error: 'Failed to update opportunity' },
        { status: response.status }
      )
    }

    // Fetch and return the updated opportunity
    const fields = [
      'Id', 'Name', 'AccountId', 'Account.Name', 'StageName', 'Amount',
      'Probability', 'CloseDate', 'Type', 'NextStep', 'LeadSource',
      'IsClosed', 'IsWon', 'ForecastCategory', 'ForecastCategoryName',
      'Description', 'HasOpportunityLineItem',
      'CreatedDate', 'LastModifiedDate', 'CreatedById', 'LastModifiedById'
    ].join(',')
    
    const getUrl = `${session.instanceUrl}/services/data/v58.0/sobjects/Opportunity/${id}?fields=${fields}`
    
    const getResponse = await fetch(getUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!getResponse.ok) {
      console.error('Failed to fetch updated opportunity')
      return NextResponse.json({ success: true })
    }

    const updatedOpportunity = await getResponse.json()
    return NextResponse.json(updatedOpportunity)
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
    
    const url = `${session.instanceUrl}/services/data/v58.0/sobjects/Opportunity/${id}`
    
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
        { error: 'Failed to delete opportunity' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}