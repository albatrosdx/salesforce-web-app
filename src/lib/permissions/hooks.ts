'use client'

import { usePermissions } from './PermissionProvider'
import { ObjectType } from './types'

export function usePermissionCheck() {
  const { hasPermission, canAccessObject, permissions, loading, error } = usePermissions()

  const canCreate = (object: ObjectType) => hasPermission(object, 'create')
  const canRead = (object: ObjectType) => hasPermission(object, 'read')
  const canEdit = (object: ObjectType) => hasPermission(object, 'edit')
  const canDelete = (object: ObjectType) => hasPermission(object, 'delete')

  const canManage = (object: ObjectType) => {
    return canCreate(object) && canEdit(object) && canDelete(object)
  }

  const isReadOnly = (object: ObjectType) => {
    return canRead(object) && !canEdit(object) && !canCreate(object) && !canDelete(object)
  }

  const hasAnyPermission = (object: ObjectType) => {
    return canRead(object) || canEdit(object) || canCreate(object) || canDelete(object)
  }

  const hasFullAccess = () => {
    if (!permissions) return false
    
    const objects: ObjectType[] = ['accounts', 'contacts', 'opportunities', 'activities']
    return objects.every(obj => 
      canCreate(obj) && canRead(obj) && canEdit(obj) && canDelete(obj)
    )
  }

  const getPermissionLevel = () => {
    if (!permissions) return 'none'
    
    if (hasFullAccess()) return 'admin'
    
    const hasCreatePerms = canCreate('accounts') || canCreate('contacts') || 
                          canCreate('opportunities') || canCreate('activities')
    const hasEditPerms = canEdit('accounts') || canEdit('contacts') || 
                         canEdit('opportunities') || canEdit('activities')
    
    if (hasCreatePerms && hasEditPerms) return 'manager'
    if (hasEditPerms) return 'user'
    
    return 'readonly'
  }

  const getObjectPermissionSummary = (object: ObjectType) => {
    if (!permissions) return null
    
    return {
      object,
      canCreate: canCreate(object),
      canRead: canRead(object),
      canEdit: canEdit(object),
      canDelete: canDelete(object),
      isReadOnly: isReadOnly(object),
      canManage: canManage(object),
      hasAccess: hasAnyPermission(object)
    }
  }

  return {
    // 基本権限チェック
    hasPermission,
    canAccessObject,
    canCreate,
    canRead,
    canEdit,
    canDelete,
    
    // 複合権限チェック
    canManage,
    isReadOnly,
    hasAnyPermission,
    hasFullAccess,
    
    // 権限レベル
    getPermissionLevel,
    getObjectPermissionSummary,
    
    // 状態
    permissions,
    loading,
    error
  }
}

// 特定のオブジェクト用のカスタムフック
export function useAccountPermissions() {
  const permissionCheck = usePermissionCheck()
  
  return {
    canCreateAccount: permissionCheck.canCreate('accounts'),
    canEditAccount: permissionCheck.canEdit('accounts'),
    canDeleteAccount: permissionCheck.canDelete('accounts'),
    canViewAccount: permissionCheck.canRead('accounts'),
    accountPermissions: permissionCheck.getObjectPermissionSummary('accounts')
  }
}

export function useContactPermissions() {
  const permissionCheck = usePermissionCheck()
  
  return {
    canCreateContact: permissionCheck.canCreate('contacts'),
    canEditContact: permissionCheck.canEdit('contacts'),
    canDeleteContact: permissionCheck.canDelete('contacts'),
    canViewContact: permissionCheck.canRead('contacts'),
    contactPermissions: permissionCheck.getObjectPermissionSummary('contacts')
  }
}

export function useOpportunityPermissions() {
  const permissionCheck = usePermissionCheck()
  
  return {
    canCreateOpportunity: permissionCheck.canCreate('opportunities'),
    canEditOpportunity: permissionCheck.canEdit('opportunities'),
    canDeleteOpportunity: permissionCheck.canDelete('opportunities'),
    canViewOpportunity: permissionCheck.canRead('opportunities'),
    opportunityPermissions: permissionCheck.getObjectPermissionSummary('opportunities')
  }
}

export function useActivityPermissions() {
  const permissionCheck = usePermissionCheck()
  
  return {
    canCreateActivity: permissionCheck.canCreate('activities'),
    canEditActivity: permissionCheck.canEdit('activities'),
    canDeleteActivity: permissionCheck.canDelete('activities'),
    canViewActivity: permissionCheck.canRead('activities'),
    activityPermissions: permissionCheck.getObjectPermissionSummary('activities')
  }
}