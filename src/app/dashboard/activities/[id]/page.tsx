'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, Button } from '@/components'
import { salesforceClient } from '@/lib/salesforce/client'
import { SalesforceActivity } from '@/types/salesforce'

export default function ActivityDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activity, setActivity] = useState<SalesforceActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setId(p.id))
  }, [params])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session && id) {
      fetchActivity()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, id, router])

  const fetchActivity = async () => {
    try {
      setLoading(true)
      const client = salesforceClient(session!)
      const result = await client.query<SalesforceActivity>(
        `SELECT Id, Subject, Status, Type, Priority, ActivityDate, Description, 
         Who.Name, What.Name, Owner.Name, CreatedDate, LastModifiedDate,
         CreatedBy.Name, LastModifiedBy.Name
         FROM Task 
         WHERE Id = '${id}'`
      )
      
      if (result.records.length > 0) {
        setActivity(result.records[0])
      } else {
        setError('活動が見つかりません')
      }
    } catch (err) {
      console.error('Error fetching activity:', err)
      setError('活動の取得中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (error || !activity) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-600">{error || '活動が見つかりません'}</p>
          <Button onClick={() => router.back()} className="mt-4">
            戻る
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {activity.Subject || '(件名なし)'}
        </h1>
        <Button onClick={() => router.back()} variant="outline">
          戻る
        </Button>
      </div>

      <Card>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">種類</dt>
              <dd className="mt-1 text-sm text-gray-900">{activity.Type || 'その他'}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1 text-sm text-gray-900">{activity.Status}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">優先度</dt>
              <dd className="mt-1 text-sm text-gray-900">{activity.Priority || '中'}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">期日</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {activity.ActivityDate ? new Date(activity.ActivityDate).toLocaleDateString('ja-JP') : '-'}
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
              <dt className="text-sm font-medium text-gray-500">作成者</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {activity.CreatedBy?.Name || '-'}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">最終更新日時</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {activity.LastModifiedDate ? new Date(activity.LastModifiedDate).toLocaleString('ja-JP') : '-'}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">最終更新者</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {activity.LastModifiedBy?.Name || '-'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}