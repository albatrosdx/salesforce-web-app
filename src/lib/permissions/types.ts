// 権限管理関連の型定義

export interface ObjectPermission {
  create: boolean
  read: boolean
  edit: boolean
  delete: boolean
}

export interface UserPermissions {
  accounts: ObjectPermission
  contacts: ObjectPermission
  opportunities: ObjectPermission
  activities: ObjectPermission
}

export interface PermissionContextType {
  permissions: UserPermissions | null
  loading: boolean
  error: string | null
  hasPermission: (object: ObjectType, action: PermissionAction) => boolean
  canAccessObject: (object: ObjectType) => boolean
  refreshPermissions: () => Promise<void>
}

export type ObjectType = 'accounts' | 'contacts' | 'opportunities' | 'activities'
export type PermissionAction = 'create' | 'read' | 'edit' | 'delete'

export interface PermissionCheckOptions {
  object: ObjectType
  action: PermissionAction
  recordId?: string
  ownerId?: string
}

export interface PermissionGateProps {
  object: ObjectType
  action: PermissionAction
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAll?: boolean
}

export interface PermissionDeniedProps {
  object?: ObjectType
  action?: PermissionAction
  message?: string
  contactSupport?: boolean
}

export interface PermissionBadgeProps {
  permissions: UserPermissions
  compact?: boolean
  showDetails?: boolean
}