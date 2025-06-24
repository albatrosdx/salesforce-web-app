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
    
    // タスクを取得
    const taskSoql = `
      SELECT Id, Subject, Status, Priority, ActivityDate, Description,
             WhatId, What.Name, What.Type, WhoId, Who.Name, Who.Type,
             OwnerId, Owner.Name, IsHighPriority, IsClosed,
             CreatedDate, LastModifiedDate
      FROM Task
      WHERE WhoId = '${id}'
      ORDER BY ActivityDate DESC, CreatedDate DESC
      LIMIT 100
    `
    
    // イベントを取得
    const eventSoql = `
      SELECT Id, Subject, Location, Description, ActivityDate, ActivityDateTime,
             StartDateTime, EndDateTime, DurationInMinutes,
             WhatId, What.Name, What.Type, WhoId, Who.Name, Who.Type,
             OwnerId, Owner.Name, IsAllDayEvent,
             CreatedDate, LastModifiedDate
      FROM Event
      WHERE WhoId = '${id}'
      ORDER BY ActivityDateTime DESC, CreatedDate DESC
      LIMIT 100
    `
    
    const [tasksResponse, eventsResponse] = await Promise.all([
      fetch(`${session.instanceUrl}/services/data/v58.0/query/?q=${encodeURIComponent(taskSoql)}`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${session.instanceUrl}/services/data/v58.0/query/?q=${encodeURIComponent(eventSoql)}`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
    ])

    if (!tasksResponse.ok || !eventsResponse.ok) {
      console.error('Salesforce API error:', {
        tasks: !tasksResponse.ok ? await tasksResponse.text() : 'OK',
        events: !eventsResponse.ok ? await eventsResponse.text() : 'OK'
      })
      return NextResponse.json(
        { error: 'Failed to fetch activities' },
        { status: 400 }
      )
    }

    const tasks = await tasksResponse.json()
    const events = await eventsResponse.json()
    
    return NextResponse.json({
      tasks,
      events
    })
  } catch (error) {
    return handleApiError(error)
  }
}