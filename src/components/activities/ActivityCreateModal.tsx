'use client'

import React, { useState } from 'react'
import { TaskCreateForm } from './TaskCreateForm'
import { EventCreateForm } from './EventCreateForm'

interface ActivityCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (activityId: string, activityType: 'Task' | 'Event') => void
  defaultValues?: {
    WhatId?: string
    WhoId?: string
    Subject?: string
  }
  defaultTab?: 'task' | 'event'
}

export function ActivityCreateModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  defaultValues,
  defaultTab = 'task'
}: ActivityCreateModalProps) {
  const [activeTab, setActiveTab] = useState<'task' | 'event'>(defaultTab)

  if (!isOpen) return null

  const handleSuccess = (activityId: string) => {
    onSuccess?.(activityId, activeTab === 'task' ? 'Task' : 'Event')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      {/* モーダルコンテンツ */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {/* ヘッダー */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                新しい活動を作成
              </h3>
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={onClose}
              >
                <span className="sr-only">閉じる</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* タブナビゲーション */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'task'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('task')}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span>タスク</span>
                  </div>
                </button>
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'event'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('event')}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>イベント</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* フォームコンテンツ */}
            <div className="max-h-96 overflow-y-auto">
              {activeTab === 'task' ? (
                <TaskCreateForm
                  onSuccess={handleSuccess}
                  onCancel={onClose}
                  defaultValues={defaultValues}
                />
              ) : (
                <EventCreateForm
                  onSuccess={handleSuccess}
                  onCancel={onClose}
                  defaultValues={defaultValues}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}