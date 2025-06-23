import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { handleApiError } from '@/lib/api/errors'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken || !session?.instanceUrl) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '50'
    
    // タスクを取得
    const taskSoql = `
      SELECT Id, Subject, Status, Priority, ActivityDate, Description,
             WhatId, What.Name, What.Type, WhoId, Who.Name, Who.Type,
             OwnerId, Owner.Name, IsHighPriority, IsClosed,
             CreatedDate, LastModifiedDate
      FROM Task
      WHERE IsDeleted = false
      ORDER BY ActivityDate DESC, CreatedDate DESC
      LIMIT ${limit}
    `
    
    // イベントを取得
    const eventSoql = `
      SELECT Id, Subject, Location, Description, ActivityDate, ActivityDateTime,
             StartDateTime, EndDateTime, DurationInMinutes,
             WhatId, What.Name, What.Type, WhoId, Who.Name, Who.Type,
             OwnerId, Owner.Name, IsAllDayEvent,
             CreatedDate, LastModifiedDate
      FROM Event
      WHERE IsDeleted = false
      ORDER BY ActivityDateTime DESC, CreatedDate DESC
      LIMIT ${limit}
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
    
    // タスクとイベントを統合して返す
    const activities = [
      ...tasks.records.map((task: any) => ({ ...task, activityType: 'Task' })),
      ...events.records.map((event: any) => ({ ...event, activityType: 'Event' }))
    ].sort((a, b) => {
      const dateA = new Date(a.ActivityDate || a.ActivityDateTime || a.CreatedDate)
      const dateB = new Date(b.ActivityDate || b.ActivityDateTime || b.CreatedDate)
      return dateB.getTime() - dateA.getTime()
    })
    
    return NextResponse.json({
      records: activities,
      totalSize: tasks.totalSize + events.totalSize,
      done: tasks.done && events.done
    })
  } catch (error) {
    return handleApiError(error)
  }
}