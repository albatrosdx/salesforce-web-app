'use client'

import React from 'react'
import Link from 'next/link'
import { Task, Event } from '@/types'
import { formatDate, formatDuration, formatRelativeTime } from '@/lib/utils/format'

interface ActivityCardProps {
  activity: Task | Event
  type: 'task' | 'event'
  onEdit?: () => void
  onDelete?: () => void
  onComplete?: () => void
}

export function ActivityCard({ 
  activity, 
  type, 
  onEdit, 
  onDelete, 
  onComplete 
}: ActivityCardProps) {
  const getActivityIcon = () => {
    if (type === 'task') {
      const task = activity as Task
      const isCompleted = task.Status === 'Completed'
      return (
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isCompleted ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          <svg 
            className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}
            fill={isCompleted ? 'currentColor' : 'none'}
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isCompleted 
                ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                : "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              }
            />
          </svg>
        </div>
      )
    } else {
      return (
        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
      case '高':
        return 'text-red-600 bg-red-100'
      case 'Medium':
      case '中':
        return 'text-yellow-600 bg-yellow-100'
      case 'Low':
      case '低':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case '完了':
        return 'text-green-600 bg-green-100'
      case 'In Progress':
      case '進行中':
        return 'text-blue-600 bg-blue-100'
      case 'Not Started':
      case '未開始':
        return 'text-gray-600 bg-gray-100'
      case 'Waiting on someone else':
      case '他者待ち':
        return 'text-yellow-600 bg-yellow-100'
      case 'Deferred':
      case '延期':
        return 'text-orange-600 bg-orange-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const isTask = type === 'task'
  const task = isTask ? activity as Task : null
  const event = !isTask ? activity as Event : null

  return (
    <div className="flex space-x-3">
      {getActivityIcon()}
      
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          {/* ヘッダー */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                {activity.Subject}
              </h4>
              <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  isTask ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {isTask ? 'タスク' : 'イベント'}
                </span>
                <span>{formatRelativeTime(activity.CreatedDate)}</span>
              </div>
            </div>
            
            {/* アクションボタン */}
            <div className="flex items-center space-x-1 ml-4">
              {isTask && task?.Status !== 'Completed' && onComplete && (
                <button
                  onClick={onComplete}
                  className="text-gray-400 hover:text-green-600 p-1"
                  title="完了にする"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="text-gray-400 hover:text-blue-600 p-1"
                  title="編集"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="text-gray-400 hover:text-red-600 p-1"
                  title="削除"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* 日時情報 */}
          <div className="mb-3">
            {isTask && task ? (
              <div className="space-y-1">
                {task.ActivityDate && (
                  <p className="text-sm text-gray-600">
                    期限: {formatDate(task.ActivityDate)}
                  </p>
                )}
                <div className="flex items-center space-x-4">
                  {task.Status && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.Status)}`}>
                      {task.Status}
                    </span>
                  )}
                  {task.Priority && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.Priority)}`}>
                      {task.Priority}
                    </span>
                  )}
                </div>
              </div>
            ) : event && (
              <div className="space-y-1">
                {event.StartDateTime && event.EndDateTime && (
                  <p className="text-sm text-gray-600">
                    {formatDate(event.StartDateTime)} {formatDuration(event.StartDateTime, event.EndDateTime)}
                  </p>
                )}
                {event.Location && (
                  <p className="text-sm text-gray-600">
                    場所: {event.Location}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 関連情報 */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {activity.What?.Name && (
                <div>
                  <span className="text-gray-500">関連: </span>
                  <Link 
                    href={`/dashboard/${activity.What.Type?.toLowerCase()}s/${activity.WhatId}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {activity.What.Name}
                  </Link>
                </div>
              )}
              {activity.Who?.Name && (
                <div>
                  <span className="text-gray-500">担当者: </span>
                  <Link 
                    href={`/dashboard/contacts/${activity.WhoId}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {activity.Who.Name}
                  </Link>
                </div>
              )}
            </div>
            
            {activity.Owner?.Name && (
              <div className="text-gray-500">
                所有者: {activity.Owner.Name}
              </div>
            )}
          </div>

          {/* 説明 */}
          {activity.Description && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-700 line-clamp-3">
                {activity.Description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}