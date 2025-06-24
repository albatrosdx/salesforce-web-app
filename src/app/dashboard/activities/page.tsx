import Link from 'next/link'
import { Card, CardContent, Button } from '@/components'
import { Task, Event } from '@/types/salesforce'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

type Activity = (Task | Event) & { activityType: 'Task' | 'Event' }

interface ActivitiesResponse {
  records: Activity[]
  totalSize: number
  done: boolean
}

async function getActivities(): Promise<ActivitiesResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken || !session?.instanceUrl) {
      return { records: [], totalSize: 0, done: true }
    }

    const limit = '50'
    
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
      return { records: [], totalSize: 0, done: true }
    }

    const tasks = await tasksResponse.json()
    const events = await eventsResponse.json()
    
    // タスクとイベントを統合して返す
    const activities = [
      ...tasks.records.map((task: any) => ({ ...task, activityType: 'Task' as const })),
      ...events.records.map((event: any) => ({ ...event, activityType: 'Event' as const }))
    ].sort((a, b) => {
      const dateA = new Date(a.ActivityDate || a.ActivityDateTime || a.CreatedDate)
      const dateB = new Date(b.ActivityDate || b.ActivityDateTime || b.CreatedDate)
      return dateB.getTime() - dateA.getTime()
    })
    
    return {
      records: activities,
      totalSize: tasks.totalSize + events.totalSize,
      done: tasks.done && events.done
    }
  } catch (error) {
    console.error('Error fetching activities:', error)
    return { records: [], totalSize: 0, done: true }
  }
}

export default async function ActivitiesPage() {
  const data = await getActivities()


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">活動</h1>
        <Button asChild>
          <Link href="/dashboard/activities/new">新規活動</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    件名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    種類
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    期日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    関連先
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    所有者
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.records.map((activity) => (
                  <tr key={activity.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/dashboard/activities/${activity.Id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {activity.Subject || '(件名なし)'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.activityType === 'Task' ? 'ToDo' : 'イベント'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.activityType === 'Task' ? (activity as Task).Status : '予定'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.activityType === 'Task' ? 
                        ((activity as Task).ActivityDate ? new Date((activity as Task).ActivityDate!).toLocaleDateString('ja-JP') : '-') :
                        ((activity as Event).StartDateTime ? new Date((activity as Event).StartDateTime!).toLocaleDateString('ja-JP') : '-')
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.What?.Name || activity.Who?.Name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.Owner?.Name || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.records.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                活動が見つかりません
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}