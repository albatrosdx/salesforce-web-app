'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Task, Event } from '@/types'
import { Card, CardContent, CardHeader, Button, Input, TextArea } from '@/components/ui'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select'

type Activity = (Task | Event) & { activityType: 'Task' | 'Event' }

interface ActivityEditFormProps {
  activity: Activity
  onCancel: () => void
  onSuccess?: (updatedActivity: Activity) => void
}

export function ActivityEditForm({ activity, onCancel, onSuccess }: ActivityEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    Subject: activity.Subject || '',
    Status: activity.activityType === 'Task' ? (activity as Task).Status || '' : '',
    Priority: activity.activityType === 'Task' ? (activity as Task).Priority || '' : '',
    ActivityDate: activity.activityType === 'Task' 
      ? ((activity as Task).ActivityDate || '') 
      : '',
    StartDateTime: activity.activityType === 'Event' 
      ? ((activity as Event).StartDateTime || '') 
      : '',
    EndDateTime: activity.activityType === 'Event' 
      ? ((activity as Event).EndDateTime || '') 
      : '',
    Location: activity.activityType === 'Event' 
      ? ((activity as Event).Location || '') 
      : '',
    Description: activity.Description || ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const endpoint = activity.activityType === 'Task' 
        ? `/api/salesforce/activities/${activity.Id}`
        : `/api/salesforce/activities/${activity.Id}`

      const requestBody = activity.activityType === 'Task' 
        ? {
            Subject: formData.Subject,
            Status: formData.Status === '__NONE__' ? null : formData.Status || null,
            Priority: formData.Priority === '__NONE__' ? null : formData.Priority || null,
            ActivityDate: formData.ActivityDate || null,
            Description: formData.Description || null
          }
        : {
            Subject: formData.Subject,
            StartDateTime: formData.StartDateTime || null,
            EndDateTime: formData.EndDateTime || null,
            Location: formData.Location || null,
            Description: formData.Description || null
          }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`更新に失敗しました: ${errorText}`)
      }

      const updatedActivity = await response.json()
      
      if (onSuccess) {
        onSuccess(updatedActivity)
      } else {
        router.refresh()
        onCancel()
      }
    } catch (error) {
      console.error('Activity update error:', error)
      alert(error instanceof Error ? error.message : '更新中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {activity.activityType === 'Task' ? 'ToDoの編集' : 'イベントの編集'}
          </h2>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            キャンセル
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">基本情報</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="subject">件名 *</Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.Subject}
                  onChange={(e) => handleInputChange('Subject', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {activity.activityType === 'Task' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">ステータス</Label>
                      <Select value={formData.Status} onValueChange={(value) => handleInputChange('Status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__NONE__">未選択</SelectItem>
                          <SelectItem value="Not Started">未着手</SelectItem>
                          <SelectItem value="In Progress">進行中</SelectItem>
                          <SelectItem value="Completed">完了</SelectItem>
                          <SelectItem value="Waiting on someone else">他者待ち</SelectItem>
                          <SelectItem value="Deferred">延期</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">優先度</Label>
                      <Select value={formData.Priority} onValueChange={(value) => handleInputChange('Priority', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="優先度を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__NONE__">未選択</SelectItem>
                          <SelectItem value="High">高</SelectItem>
                          <SelectItem value="Normal">標準</SelectItem>
                          <SelectItem value="Low">低</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="activityDate">期日</Label>
                    <Input
                      id="activityDate"
                      type="date"
                      value={formData.ActivityDate}
                      onChange={(e) => handleInputChange('ActivityDate', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}

              {activity.activityType === 'Event' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDateTime">開始日時</Label>
                      <Input
                        id="startDateTime"
                        type="datetime-local"
                        value={formData.StartDateTime ? formData.StartDateTime.slice(0, 16) : ''}
                        onChange={(e) => handleInputChange('StartDateTime', e.target.value ? new Date(e.target.value).toISOString() : '')}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDateTime">終了日時</Label>
                      <Input
                        id="endDateTime"
                        type="datetime-local"
                        value={formData.EndDateTime ? formData.EndDateTime.slice(0, 16) : ''}
                        onChange={(e) => handleInputChange('EndDateTime', e.target.value ? new Date(e.target.value).toISOString() : '')}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">場所</Label>
                    <Input
                      id="location"
                      type="text"
                      value={formData.Location}
                      onChange={(e) => handleInputChange('Location', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 説明 */}
          <div>
            <Label htmlFor="description">説明</Label>
            <TextArea
              id="description"
              value={formData.Description}
              onChange={(e) => handleInputChange('Description', e.target.value)}
              disabled={isLoading}
              rows={4}
            />
          </div>

          {/* アクションボタン */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !formData.Subject.trim()}
              className="bg-salesforce-blue hover:bg-salesforce-darkblue"
            >
              {isLoading ? '更新中...' : '更新'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}