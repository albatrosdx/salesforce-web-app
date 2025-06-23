'use client'

import React from 'react'

interface FilterState {
  type: 'all' | 'task' | 'event'
  status: 'all' | 'completed' | 'in-progress' | 'not-started'
  dateRange: 'all' | 'today' | 'week' | 'month'
  search: string
}

interface ActivityFilterProps {
  filter: FilterState
  onFilterChange: (filter: FilterState) => void
  sortBy: 'date' | 'priority'
  onSortChange: (sortBy: 'date' | 'priority') => void
}

export function ActivityFilter({ 
  filter, 
  onFilterChange, 
  sortBy, 
  onSortChange 
}: ActivityFilterProps) {
  const updateFilter = (updates: Partial<FilterState>) => {
    onFilterChange({ ...filter, ...updates })
  }

  const clearFilters = () => {
    onFilterChange({
      type: 'all',
      status: 'all',
      dateRange: 'all',
      search: ''
    })
  }

  const hasActiveFilters = 
    filter.type !== 'all' || 
    filter.status !== 'all' || 
    filter.dateRange !== 'all' || 
    filter.search.trim() !== ''

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* 左側: フィルタ */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* 検索 */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="活動を検索..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filter.search}
                onChange={(e) => updateFilter({ search: e.target.value })}
              />
            </div>
          </div>

          {/* 活動種別 */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filter.type}
              onChange={(e) => updateFilter({ type: e.target.value as FilterState['type'] })}
            >
              <option value="all">すべての種別</option>
              <option value="task">タスク</option>
              <option value="event">イベント</option>
            </select>
          </div>

          {/* ステータス */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filter.status}
              onChange={(e) => updateFilter({ status: e.target.value as FilterState['status'] })}
            >
              <option value="all">すべてのステータス</option>
              <option value="completed">完了</option>
              <option value="in-progress">進行中</option>
              <option value="not-started">未開始</option>
            </select>
          </div>

          {/* 日付範囲 */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filter.dateRange}
              onChange={(e) => updateFilter({ dateRange: e.target.value as FilterState['dateRange'] })}
            >
              <option value="all">すべての期間</option>
              <option value="today">今日</option>
              <option value="week">過去1週間</option>
              <option value="month">過去1ヶ月</option>
            </select>
          </div>
        </div>

        {/* 右側: ソートとアクション */}
        <div className="flex items-center space-x-4">
          {/* ソート */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">並び順:</label>
            <select
              className="block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'date' | 'priority')}
            >
              <option value="date">日付順</option>
              <option value="priority">優先度順</option>
            </select>
          </div>

          {/* フィルタクリア */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              クリア
            </button>
          )}
        </div>
      </div>

      {/* アクティブフィルタ表示 */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">フィルタ中:</span>
            
            {filter.type !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                種別: {filter.type === 'task' ? 'タスク' : 'イベント'}
                <button
                  onClick={() => updateFilter({ type: 'all' })}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {filter.status !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ステータス: {
                  filter.status === 'completed' ? '完了' :
                  filter.status === 'in-progress' ? '進行中' : '未開始'
                }
                <button
                  onClick={() => updateFilter({ status: 'all' })}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {filter.dateRange !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                期間: {
                  filter.dateRange === 'today' ? '今日' :
                  filter.dateRange === 'week' ? '過去1週間' : '過去1ヶ月'
                }
                <button
                  onClick={() => updateFilter({ dateRange: 'all' })}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-yellow-400 hover:bg-yellow-200 hover:text-yellow-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {filter.search.trim() && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                検索: {filter.search}
                <button
                  onClick={() => updateFilter({ search: '' })}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}