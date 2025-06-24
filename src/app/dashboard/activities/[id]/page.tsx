'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { ActivityEditForm } from '@/components/activities'
import { Task, Event } from '@/types/salesforce'

type Activity = (Task | Event) & { activityType: 'Task' | 'Event' }

export default function ActivityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const activityId = params.id as string
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch(`/api/salesforce/activities/${activityId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch activity')
        }
        const data = await response.json()
        setActivity(data)
      } catch {
        setError('活動が見つかりません')
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [activityId])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
    // Refresh the activity data
    window.location.reload()
  }

  const handleDelete = async () => {
    if (confirm('この活動を削除してもよろしいですか？')) {
      try {
        const response = await fetch(`/api/salesforce/activities/${activityId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`削除に失敗しました: ${errorText}`)
        }

        // 削除成功後、活動一覧に遷移
        router.push('/dashboard/activities')
      } catch (error) {
        console.error('Activity deletion error:', error)
        alert(error instanceof Error ? error.message : '削除中にエラーが発生しました')
      }
    }
  }

  if (loading) {
    return <div>読み込み中...</div>
  }

  if (error || !activity) {
    return <div>エラー: {error}</div>
  }


  return (
    <div className="space-y-6">
      {/* ナビゲーションヘッダー */}
      <div className="flex items-center space-x-4">
        <Button onClick={() => router.back()} variant="outline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          戻る
        </Button>
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/dashboard/activities" className="text-gray-500 hover:text-gray-700">
                活動
              </Link>
            </li>
            <li>
              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-500">
                {activity?.Subject || '詳細'}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* 活動詳細 */}
      {activity && (
        isEditing ? (
          <ActivityEditForm
            activity={activity}
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
          />
        ) : (
          <Card>
            <CardContent className="p-6">
              {/* アクションボタン */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {activity.Subject || '(件名なし)'}
                </h1>
                <div className="flex space-x-3">
                  <Button onClick={handleEdit} variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    編集
                  </Button>
                  <Button onClick={handleDelete} variant="outline" className="text-red-600 hover:text-red-800">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    削除
                  </Button>
                </div>
              </div>

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
        )
      )}
    </div>
  )
}