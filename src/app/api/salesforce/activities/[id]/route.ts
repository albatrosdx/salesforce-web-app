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
    
    // まずTaskとして取得を試みる
    const taskFields = [
      'Id', 'Subject', 'Status', 'Priority', 'ActivityDate', 'Description',
      'WhatId', 'What.Name', 'What.Type', 'WhoId', 'Who.Name', 'Who.Type',
      'OwnerId', 'Owner.Name', 'IsHighPriority', 'IsClosed',
      'CreatedDate', 'LastModifiedDate'
    ].join(',')
    
    let response = await fetch(
      `${session.instanceUrl}/services/data/v58.0/sobjects/Task/${id}?fields=${taskFields}`,
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.ok) {
      const task = await response.json()
      return NextResponse.json({ ...task, activityType: 'Task' })
    }

    // TaskでなければEventとして取得を試みる
    const eventFields = [
      'Id', 'Subject', 'Location', 'Description', 'ActivityDate', 'ActivityDateTime',
      'StartDateTime', 'EndDateTime', 'DurationInMinutes',
      'WhatId', 'What.Name', 'What.Type', 'WhoId', 'Who.Name', 'Who.Type',
      'OwnerId', 'Owner.Name', 'IsAllDayEvent',
      'CreatedDate', 'LastModifiedDate'
    ].join(',')
    
    response = await fetch(
      `${session.instanceUrl}/services/data/v58.0/sobjects/Event/${id}?fields=${eventFields}`,
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    const event = await response.json()
    return NextResponse.json({ ...event, activityType: 'Event' })
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
    const { activityType, ...updateData } = body
    
    const sobjectType = activityType === 'Event' ? 'Event' : 'Task'
    const url = `${session.instanceUrl}/services/data/v58.0/sobjects/${sobjectType}/${id}`
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Salesforce API error:', error)
      return NextResponse.json(
        { error: 'Failed to update activity' },
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
    const { searchParams } = new URL(request.url)
    const activityType = searchParams.get('type') || 'Task'
    
    const sobjectType = activityType === 'Event' ? 'Event' : 'Task'
    const url = `${session.instanceUrl}/services/data/v58.0/sobjects/${sobjectType}/${id}`
    
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
        { error: 'Failed to delete activity' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}