'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Contact } from '@/types'
import { Card, CardContent, CardHeader, Button, Input } from '@/components/ui'
import { Label } from '@/components/ui/label'

interface ContactEditFormProps {
  contact: Contact
  onCancel: () => void
  onSuccess?: (updatedContact: Contact) => void
}

export function ContactEditForm({ contact, onCancel, onSuccess }: ContactEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    FirstName: contact.FirstName || '',
    LastName: contact.LastName || '',
    Email: contact.Email || '',
    Phone: contact.Phone || '',
    MobilePhone: contact.MobilePhone || '',
    Title: contact.Title || '',
    Department: contact.Department || '',
    AccountId: contact.AccountId || '',
    MailingStreet: contact.MailingStreet || '',
    MailingCity: contact.MailingCity || '',
    MailingState: contact.MailingState || '',
    MailingPostalCode: contact.MailingPostalCode || '',
    MailingCountry: contact.MailingCountry || ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/salesforce/contacts/${contact.Id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          Email: formData.Email || null,
          Phone: formData.Phone || null,
          MobilePhone: formData.MobilePhone || null,
          Title: formData.Title || null,
          Department: formData.Department || null,
          AccountId: formData.AccountId || null,
          MailingStreet: formData.MailingStreet || null,
          MailingCity: formData.MailingCity || null,
          MailingState: formData.MailingState || null,
          MailingPostalCode: formData.MailingPostalCode || null,
          MailingCountry: formData.MailingCountry || null
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`更新に失敗しました: ${errorText}`)
      }

      const updatedContact = await response.json()
      
      if (onSuccess) {
        onSuccess(updatedContact)
      } else {
        router.refresh()
        onCancel()
      }
    } catch (error) {
      console.error('Contact update error:', error)
      alert(error instanceof Error ? error.message : '更新中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">取引先責任者の編集</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">名 *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.FirstName}
                  onChange={(e) => handleInputChange('FirstName', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="lastName">姓 *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.LastName}
                  onChange={(e) => handleInputChange('LastName', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.Email}
                  onChange={(e) => handleInputChange('Email', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="phone">電話番号</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.Phone}
                  onChange={(e) => handleInputChange('Phone', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="mobilePhone">携帯電話</Label>
                <Input
                  id="mobilePhone"
                  type="tel"
                  value={formData.MobilePhone}
                  onChange={(e) => handleInputChange('MobilePhone', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="title">役職</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.Title}
                  onChange={(e) => handleInputChange('Title', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="department">部門</Label>
                <Input
                  id="department"
                  type="text"
                  value={formData.Department}
                  onChange={(e) => handleInputChange('Department', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* 郵送先住所 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">郵送先住所</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="mailingStreet">住所</Label>
                <Input
                  id="mailingStreet"
                  type="text"
                  value={formData.MailingStreet}
                  onChange={(e) => handleInputChange('MailingStreet', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="mailingCity">市区町村</Label>
                <Input
                  id="mailingCity"
                  type="text"
                  value={formData.MailingCity}
                  onChange={(e) => handleInputChange('MailingCity', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="mailingState">都道府県</Label>
                <Input
                  id="mailingState"
                  type="text"
                  value={formData.MailingState}
                  onChange={(e) => handleInputChange('MailingState', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="mailingPostalCode">郵便番号</Label>
                <Input
                  id="mailingPostalCode"
                  type="text"
                  value={formData.MailingPostalCode}
                  onChange={(e) => handleInputChange('MailingPostalCode', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="mailingCountry">国</Label>
                <Input
                  id="mailingCountry"
                  type="text"
                  value={formData.MailingCountry}
                  onChange={(e) => handleInputChange('MailingCountry', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>


          {/* アクションボタン */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !formData.FirstName.trim() || !formData.LastName.trim()}
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