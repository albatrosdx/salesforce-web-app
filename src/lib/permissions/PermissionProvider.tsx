'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { UserPermissions, PermissionContextType, ObjectType, PermissionAction } from './types'

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

interface PermissionProviderProps {
  children: React.ReactNode
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { data: session, status } = useSession()
  
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPermissions = useCallback(async () => {
    if (status !== 'authenticated') {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // サーバーサイドAPIエンドポイントを使用してCORSエラーを回避
      const response = await fetch('/api/salesforce/permissions')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const userPermissions = await response.json()
      setPermissions(userPermissions)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch permissions'
      setError(errorMessage)
      console.error('Permission fetch error:', err)
      
      // フォールバック権限（読み取り専用）
      setPermissions({
        accounts: { create: false, read: true, edit: false, delete: false },
        contacts: { create: false, read: true, edit: false, delete: false },
        opportunities: { create: false, read: true, edit: false, delete: false },
        activities: { create: false, read: true, edit: false, delete: false }
      })
    } finally {
      setLoading(false)
    }
  }, [status])

  const hasPermission = useCallback((object: ObjectType, action: PermissionAction): boolean => {
    if (!permissions) return false
    
    const objectPermissions = permissions[object]
    if (!objectPermissions) return false
    
    return objectPermissions[action] || false
  }, [permissions])

  const canAccessObject = useCallback((object: ObjectType): boolean => {
    if (!permissions) return false
    
    const objectPermissions = permissions[object]
    if (!objectPermissions) return false
    
    // 読み取り権限があれば、オブジェクトにアクセス可能
    return objectPermissions.read
  }, [permissions])

  const refreshPermissions = useCallback(async () => {
    await fetchPermissions()
  }, [fetchPermissions])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  // セッション変更時に権限を再取得
  useEffect(() => {
    if (status === 'authenticated') {
      fetchPermissions()
    } else if (status === 'unauthenticated') {
      setPermissions(null)
      setLoading(false)
      setError(null)
    }
  }, [status, fetchPermissions])

  const contextValue: PermissionContextType = {
    permissions,
    loading,
    error,
    hasPermission,
    canAccessObject,
    refreshPermissions
  }

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions(): PermissionContextType {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider')
  }
  return context
}