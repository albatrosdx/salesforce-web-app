'use client'

import React, { useState } from 'react'
import { usePermissionCheck } from '@/lib/permissions/hooks'
import { UserPermissions, ObjectType } from '@/lib/permissions/types'

interface PermissionBadgeProps {
  compact?: boolean
  showDetails?: boolean
}

export function PermissionBadge({ compact = false, showDetails = false }: PermissionBadgeProps) {
  const { getPermissionLevel, permissions, loading } = usePermissionCheck()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  if (loading || !permissions) {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
        読み込み中...
      </div>
    )
  }

  const permissionLevel = getPermissionLevel()
  
  const levelConfig = {
    admin: {
      label: '管理者',
      color: 'bg-red-100 text-red-800',
      icon: '👑',
      description: '全オブジェクトへの完全アクセス'
    },
    manager: {
      label: 'マネージャー',
      color: 'bg-blue-100 text-blue-800',
      icon: '👨‍💼',
      description: '営業関連オブジェクトへの完全アクセス'
    },
    user: {
      label: 'ユーザー',
      color: 'bg-green-100 text-green-800',
      icon: '👤',
      description: '編集権限付きアクセス'
    },
    readonly: {
      label: '読み取り専用',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '👁️',
      description: '読み取り専用アクセス'
    },
    none: {
      label: 'アクセス不可',
      color: 'bg-gray-100 text-gray-800',
      icon: '🚫',
      description: 'アクセス権限なし'
    }
  }

  const config = levelConfig[permissionLevel]

  if (compact) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => showDetails && setIsDetailsOpen(!isDetailsOpen)}
        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${config.color} ${
          showDetails ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'
        }`}
      >
        <span className="mr-2 text-base">{config.icon}</span>
        <div className="text-left">
          <div className="font-medium">{config.label}</div>
          <div className="text-xs opacity-75">{config.description}</div>
        </div>
        {showDetails && (
          <svg 
            className={`ml-2 w-4 h-4 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {showDetails && isDetailsOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">詳細権限</h4>
            <PermissionDetailGrid permissions={permissions} />
          </div>
        </div>
      )}
    </div>
  )
}

interface PermissionDetailGridProps {
  permissions: UserPermissions
}

function PermissionDetailGrid({ permissions }: PermissionDetailGridProps) {
  const objects: { key: ObjectType; label: string }[] = [
    { key: 'accounts', label: '取引先' },
    { key: 'contacts', label: '取引先責任者' },
    { key: 'opportunities', label: '商談' },
    { key: 'activities', label: '活動' }
  ]

  const actions = [
    { key: 'create' as const, label: '作成', icon: '➕' },
    { key: 'read' as const, label: '読み取り', icon: '👁️' },
    { key: 'edit' as const, label: '編集', icon: '✏️' },
    { key: 'delete' as const, label: '削除', icon: '🗑️' }
  ]

  return (
    <div className="space-y-3">
      {objects.map(({ key, label }) => (
        <div key={key} className="border-b border-gray-100 pb-2 last:border-b-0">
          <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
          <div className="grid grid-cols-4 gap-2">
            {actions.map(({ key: actionKey, label: actionLabel, icon }) => (
              <div
                key={actionKey}
                className={`text-xs px-2 py-1 rounded text-center ${
                  permissions[key][actionKey]
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <div>{icon}</div>
                <div className="mt-1">{actionLabel}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// シンプルな権限インジケーター
export function PermissionIndicator({ 
  object, 
  action, 
  size = 'sm' 
}: { 
  object: ObjectType
  action: 'create' | 'read' | 'edit' | 'delete'
  size?: 'sm' | 'md' | 'lg' 
}) {
  const { hasPermission } = usePermissionCheck()
  const hasAccess = hasPermission(object, action)

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <div 
      className={`inline-block rounded-full ${sizeClasses[size]} ${
        hasAccess ? 'bg-green-500' : 'bg-gray-300'
      }`}
      title={`${action} permission: ${hasAccess ? 'allowed' : 'denied'}`}
    />
  )
}