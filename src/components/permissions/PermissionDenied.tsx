'use client'

import React from 'react'
import { Button } from '@/components/ui'
import { ObjectType, PermissionAction } from '@/lib/permissions/types'

interface PermissionDeniedProps {
  object?: ObjectType
  action?: PermissionAction
  message?: string
  contactSupport?: boolean
  onContactSupport?: () => void
  className?: string
}

const objectLabels: Record<ObjectType, string> = {
  accounts: '取引先',
  contacts: '取引先責任者',
  opportunities: '商談',
  activities: '活動'
}

const actionLabels: Record<PermissionAction, string> = {
  create: '作成',
  read: '閲覧',
  edit: '編集',
  delete: '削除'
}

export function PermissionDenied({
  object,
  action,
  message,
  contactSupport = true,
  onContactSupport,
  className = ''
}: PermissionDeniedProps) {
  const getDefaultMessage = () => {
    if (object && action) {
      return `${objectLabels[object]}の${actionLabels[action]}権限がありません。`
    }
    if (object) {
      return `${objectLabels[object]}へのアクセス権限がありません。`
    }
    return 'この操作を実行する権限がありません。'
  }

  const displayMessage = message || getDefaultMessage()

  const handleContactSupport = () => {
    if (onContactSupport) {
      onContactSupport()
    } else {
      // デフォルトのサポート連絡処理
      window.open('mailto:admin@company.com?subject=権限要求&body=' + 
        encodeURIComponent(`以下の権限が必要です:\n\nオブジェクト: ${object ? objectLabels[object] : '不明'}\n操作: ${action ? actionLabels[action] : '不明'}\n\n理由: `), 
        '_blank'
      )
    }
  }

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-3-9a9 9 0 1118 0 9 9 0 01-18 0z" 
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        アクセスが制限されています
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {displayMessage}
      </p>

      {contactSupport && (
        <div className="space-y-4">
          <Button 
            onClick={handleContactSupport}
            variant="outline"
            className="mx-auto"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            管理者に連絡
          </Button>
          
          <p className="text-sm text-gray-500">
            この操作が必要な場合は、管理者にお問い合わせください。
          </p>
        </div>
      )}
    </div>
  )
}

// 特定のシナリオ用のプリセットコンポーネント
export function CreatePermissionDenied({ object }: { object: ObjectType }) {
  return (
    <PermissionDenied 
      object={object} 
      action="create"
      message={`新しい${objectLabels[object]}を作成する権限がありません。`}
    />
  )
}

export function EditPermissionDenied({ object }: { object: ObjectType }) {
  return (
    <PermissionDenied 
      object={object} 
      action="edit"
      message={`${objectLabels[object]}を編集する権限がありません。読み取り専用モードで表示されています。`}
    />
  )
}

export function DeletePermissionDenied({ object }: { object: ObjectType }) {
  return (
    <PermissionDenied 
      object={object} 
      action="delete"
      message={`${objectLabels[object]}を削除する権限がありません。`}
    />
  )
}

export function ViewPermissionDenied({ object }: { object: ObjectType }) {
  return (
    <PermissionDenied 
      object={object} 
      action="read"
      message={`${objectLabels[object]}を閲覧する権限がありません。`}
    />
  )
}