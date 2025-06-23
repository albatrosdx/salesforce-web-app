'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface EntityActionsProps {
  entityType: 'Account' | 'Contact' | 'Opportunity' | 'Activity'
  entityId: string
  entityName?: string
  onEdit?: () => void
  onDelete?: () => void
  redirectAfterDelete?: string
}

export function EntityActions({
  entityType,
  entityId,
  entityName = 'このレコード',
  onEdit,
  onDelete,
  redirectAfterDelete = '/dashboard'
}: EntityActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    } else {
      // デフォルトの編集ページへ遷移
      const basePath = entityType.toLowerCase()
      router.push(`/dashboard/${basePath}s/${entityId}/edit`)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // APIエンドポイントの決定
      let apiPath = ''
      switch (entityType) {
        case 'Account':
          apiPath = `/api/salesforce/accounts/${entityId}`
          break
        case 'Contact':
          apiPath = `/api/salesforce/contacts/${entityId}`
          break
        case 'Opportunity':
          apiPath = `/api/salesforce/opportunities/${entityId}`
          break
        case 'Activity':
          apiPath = `/api/salesforce/activities/${entityId}`
          break
      }

      const response = await fetch(apiPath, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('削除に失敗しました')
      }

      if (onDelete) {
        onDelete()
      } else {
        router.push(redirectAfterDelete)
      }
    } catch (error) {
      console.error('Error deleting entity:', error)
      alert('削除中にエラーが発生しました')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={handleEdit}
          variant="outline"
          size="sm"
          className="inline-flex items-center"
        >
          <PencilIcon className="h-4 w-4 mr-1" />
          編集
        </Button>
        <Button
          onClick={() => setShowDeleteDialog(true)}
          variant="outline"
          size="sm"
          className="inline-flex items-center text-red-600 hover:text-red-700"
          disabled={isDeleting}
        >
          <TrashIcon className="h-4 w-4 mr-1" />
          削除
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>削除の確認</AlertDialogTitle>
            <AlertDialogDescription>
              {entityName}を削除してもよろしいですか？この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? '削除中...' : '削除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}