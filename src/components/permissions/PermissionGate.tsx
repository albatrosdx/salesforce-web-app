'use client'

import React from 'react'
import { usePermissions } from '@/lib/permissions/PermissionProvider'
import { ObjectType, PermissionAction } from '@/lib/permissions/types'

interface PermissionGateProps {
  object: ObjectType
  action: PermissionAction
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAll?: boolean
}

interface MultiPermissionGateProps {
  permissions: Array<{ object: ObjectType; action: PermissionAction }>
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAll?: boolean
}

export function PermissionGate({ 
  object, 
  action, 
  children, 
  fallback = null 
}: PermissionGateProps) {
  const { hasPermission, loading } = usePermissions()

  // ローディング中は何も表示しない
  if (loading) {
    return null
  }

  // 権限がある場合のみ子要素を表示
  if (hasPermission(object, action)) {
    return <>{children}</>
  }

  // 権限がない場合はフォールバックを表示
  return <>{fallback}</>
}

// 複数の権限をチェックするゲート
export function MultiPermissionGate({ 
  permissions, 
  children, 
  fallback = null, 
  requireAll = false 
}: MultiPermissionGateProps) {
  const { hasPermission, loading } = usePermissions()

  // ローディング中は何も表示しない
  if (loading) {
    return null
  }

  const permissionResults = permissions.map(({ object, action }) => 
    hasPermission(object, action)
  )

  const hasRequiredPermissions = requireAll 
    ? permissionResults.every(result => result)
    : permissionResults.some(result => result)

  if (hasRequiredPermissions) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

// よく使われる組み合わせ用のコンポーネント
export function CreatePermissionGate({ 
  object, 
  children, 
  fallback 
}: { 
  object: ObjectType
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGate object={object} action="create" fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

export function EditPermissionGate({ 
  object, 
  children, 
  fallback 
}: { 
  object: ObjectType
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGate object={object} action="edit" fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

export function DeletePermissionGate({ 
  object, 
  children, 
  fallback 
}: { 
  object: ObjectType
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGate object={object} action="delete" fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

export function ReadPermissionGate({ 
  object, 
  children, 
  fallback 
}: { 
  object: ObjectType
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGate object={object} action="read" fallback={fallback}>
      {children}
    </PermissionGate>
  )
}