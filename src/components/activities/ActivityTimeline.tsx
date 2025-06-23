'use client'

import React, { useState, useMemo } from 'react'
import { Task, Event } from '@/types'
import { ActivityCard } from './ActivityCard'
import { ActivityFilter } from './ActivityFilter'
import { formatDate } from '@/lib/utils/format'

interface ActivityTimelineProps {
  tasks: Task[]
  events: Event[]
  loading?: boolean
  onRefresh?: () => void
}

interface Activity {
  id: string
  type: 'task' | 'event'
  data: Task | Event
  date: Date
  sortKey: string
}

interface FilterState {
  type: 'all' | 'task' | 'event'
  status: 'all' | 'completed' | 'in-progress' | 'not-started'
  dateRange: 'all' | 'today' | 'week' | 'month'
  search: string
}

export function ActivityTimeline({ 
  tasks, 
  events, 
  loading = false,
  onRefresh 
}: ActivityTimelineProps) {
  const [filter, setFilter] = useState<FilterState>({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    search: ''
  })

  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date')

  // タスクとイベントを統合してActivityオブジェクトに変換
  const activities = useMemo(() => {
    const allActivities: Activity[] = []

    // タスクを追加
    tasks.forEach(task => {
      const date = task.ActivityDate ? new Date(task.ActivityDate) : new Date(task.CreatedDate)
      allActivities.push({
        id: task.Id,
        type: 'task',
        data: task,
        date,
        sortKey: task.ActivityDate || task.CreatedDate
      })
    })

    // イベントを追加
    events.forEach(event => {
      const date = event.StartDateTime ? new Date(event.StartDateTime) : new Date(event.CreatedDate)
      allActivities.push({
        id: event.Id,
        type: 'event',
        data: event,
        date,
        sortKey: event.StartDateTime || event.CreatedDate
      })
    })

    return allActivities
  }, [tasks, events])

  // フィルタリングとソート
  const filteredActivities = useMemo(() => {
    let filtered = activities

    // タイプフィルタ
    if (filter.type !== 'all') {
      filtered = filtered.filter(activity => activity.type === filter.type)
    }

    // ステータスフィルタ
    if (filter.status !== 'all') {
      filtered = filtered.filter(activity => {
        if (activity.type === 'task') {
          const task = activity.data as Task
          switch (filter.status) {
            case 'completed':
              return task.Status === 'Completed'
            case 'in-progress':
              return task.Status === 'In Progress'
            case 'not-started':
              return task.Status === 'Not Started'
            default:
              return true
          }
        }
        return filter.status === 'all' // イベントは常に表示
      })
    }

    // 日付範囲フィルタ
    if (filter.dateRange !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(activity => {
        const activityDate = activity.date
        
        switch (filter.dateRange) {
          case 'today':
            return activityDate >= today
          case 'week':
            const weekAgo = new Date(today)
            weekAgo.setDate(today.getDate() - 7)
            return activityDate >= weekAgo
          case 'month':
            const monthAgo = new Date(today)
            monthAgo.setMonth(today.getMonth() - 1)
            return activityDate >= monthAgo
          default:
            return true
        }
      })
    }

    // 検索フィルタ
    if (filter.search.trim()) {
      const searchTerm = filter.search.toLowerCase()
      filtered = filtered.filter(activity => 
        activity.data.Subject?.toLowerCase().includes(searchTerm) ||
        activity.data.Description?.toLowerCase().includes(searchTerm)
      )
    }

    // ソート
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.sortKey).getTime() - new Date(a.sortKey).getTime()
      } else if (sortBy === 'priority' && a.type === 'task' && b.type === 'task') {
        const taskA = a.data as Task
        const taskB = b.data as Task
        const priorityOrder = { 'High': 3, '高': 3, 'Medium': 2, '中': 2, 'Low': 1, '低': 1 }
        return (priorityOrder[taskB.Priority as keyof typeof priorityOrder] || 0) - 
               (priorityOrder[taskA.Priority as keyof typeof priorityOrder] || 0)
      }
      return 0
    })

    return filtered
  }, [activities, filter, sortBy])

  // 日付別グループ化
  const groupedActivities = useMemo(() => {
    const groups: { [key: string]: Activity[] } = {}
    
    filteredActivities.forEach(activity => {
      const dateKey = formatDate(activity.sortKey).split(' ')[0] // 日付部分のみ
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(activity)
    })
    
    return groups
  }, [filteredActivities])

  const handleEdit = (activity: Activity) => {
    // TODO: 活動編集機能の実装
    console.log('Edit activity:', activity.id)
  }

  const handleDelete = (activity: Activity) => {
    // TODO: 活動削除機能の実装
    if (confirm('この活動を削除してもよろしいですか？')) {
      console.log('Delete activity:', activity.id)
    }
  }

  const handleComplete = (activity: Activity) => {
    // TODO: タスク完了機能の実装
    if (activity.type === 'task') {
      console.log('Complete task:', activity.id)
    }
  }

  if (loading && activities.length === 0) {
    return (
      <div className="space-y-6">
        <ActivityFilter
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <div className="bg-white rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="space-y-6">
        <ActivityFilter
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <div className="bg-white rounded-lg p-12">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">活動が見つかりません</h3>
            <p className="text-gray-600 mb-4">
              活動が登録されていないか、フィルター条件に一致する活動がありません。
            </p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                再読み込み
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* フィルタ */}
      <ActivityFilter
        filter={filter}
        onFilterChange={setFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* 統計情報 */}
      <div className="bg-white rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <dt className="text-sm font-medium text-gray-500">総活動数</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{filteredActivities.length}</dd>
          </div>
          <div className="text-center">
            <dt className="text-sm font-medium text-gray-500">タスク</dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600">
              {filteredActivities.filter(a => a.type === 'task').length}
            </dd>
          </div>
          <div className="text-center">
            <dt className="text-sm font-medium text-gray-500">イベント</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">
              {filteredActivities.filter(a => a.type === 'event').length}
            </dd>
          </div>
        </div>
      </div>

      {/* タイムライン */}
      <div className="bg-white rounded-lg p-6">
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([dateKey, dayActivities]) => (
            <div key={dateKey}>
              {/* 日付ヘッダー */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm font-medium text-gray-900">
                    {dateKey}
                  </span>
                </div>
              </div>

              {/* その日の活動 */}
              <div className="mt-6 space-y-6">
                {dayActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity.data}
                    type={activity.type}
                    onEdit={() => handleEdit(activity)}
                    onDelete={() => handleDelete(activity)}
                    onComplete={() => handleComplete(activity)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}