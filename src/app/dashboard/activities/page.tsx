import Link from 'next/link'
import { Card, CardContent, Button } from '@/components'
import { Task, Event } from '@/types/salesforce'

type Activity = (Task | Event) & { activityType: 'Task' | 'Event' }

interface ActivitiesResponse {
  records: Activity[]
  totalSize: number
  done: boolean
}

async function getActivities(): Promise<ActivitiesResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/salesforce/activities/list?limit=50`,
      { cache: 'no-store' }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch activities')
    }
    
    return response.json()
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