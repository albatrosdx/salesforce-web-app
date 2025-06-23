import { Card, CardContent } from '@/components'
import { Task, Event } from '@/types/salesforce'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Activity = (Task | Event) & { activityType: 'Task' | 'Event' }

async function getActivity(id: string): Promise<Activity | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/salesforce/activities/${id}`,
      { cache: 'no-store' }
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch activity')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching activity:', error)
    return null
  }
}

export default async function ActivityDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const activity = await getActivity(id)
  
  if (!activity) {
    notFound()
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {activity.Subject || '(件名なし)'}
        </h1>
        <Link 
          href="/dashboard/activities" 
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          戻る
        </Link>
      </div>

      <Card>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">種類</dt>
              <dd className="mt-1 text-sm text-gray-900">{activity.activityType === 'Task' ? 'ToDo' : 'イベント'}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {activity.activityType === 'Task' ? (activity as Task).Status : '予定'}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">優先度</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {activity.activityType === 'Task' ? (activity as Task).Priority || '中' : '-'}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">日付</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {activity.activityType === 'Task' ? 
                  ((activity as Task).ActivityDate ? new Date((activity as Task).ActivityDate!).toLocaleDateString('ja-JP') : '-') :
                  ((activity as Event).StartDateTime ? new Date((activity as Event).StartDateTime!).toLocaleDateString('ja-JP') : '-')
                }
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">関連先</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {activity.What?.Name || activity.Who?.Name || '-'}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">所有者</dt>
              <dd className="mt-1 text-sm text-gray-900">{activity.Owner?.Name || '-'}</dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">説明</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {activity.Description || '(説明なし)'}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">作成日時</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(activity.CreatedDate).toLocaleString('ja-JP')}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">最終更新日時</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {activity.LastModifiedDate ? new Date(activity.LastModifiedDate).toLocaleString('ja-JP') : '-'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}