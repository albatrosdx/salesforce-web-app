'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, TextArea, Card, CardContent } from '@/components/ui'

interface ContactCreateFormProps {
  accountId?: string
}

export function ContactCreateForm({ accountId }: ContactCreateFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Title: '',
    Department: '',
    Email: '',
    Phone: '',
    MobilePhone: '',
    AccountId: accountId || '',
    MailingStreet: '',
    MailingCity: '',
    MailingState: '',
    MailingPostalCode: '',
    MailingCountry: '',
    Description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/salesforce/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create contact')
      }

      const data = await response.json()
      router.push(`/dashboard/contacts/${data.id}`)
    } catch (error) {
      console.error('Error creating contact:', error)
      alert('取引先責任者の作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700 mb-1">
                  名 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="FirstName"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="LastName" className="block text-sm font-medium text-gray-700 mb-1">
                  姓 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="LastName"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="Title" className="block text-sm font-medium text-gray-700 mb-1">
                  役職
                </label>
                <Input
                  id="Title"
                  name="Title"
                  value={formData.Title}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="Department" className="block text-sm font-medium text-gray-700 mb-1">
                  部署
                </label>
                <Input
                  id="Department"
                  name="Department"
                  value={formData.Department}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* 連絡先情報 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">連絡先情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
                  メール
                </label>
                <Input
                  id="Email"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="Phone" className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号
                </label>
                <Input
                  id="Phone"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="MobilePhone" className="block text-sm font-medium text-gray-700 mb-1">
                  携帯電話
                </label>
                <Input
                  id="MobilePhone"
                  name="MobilePhone"
                  value={formData.MobilePhone}
                  onChange={handleChange}
                />
              </div>
              {accountId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    取引先
                  </label>
                  <Input
                    value={accountId}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 住所情報 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">住所情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="MailingStreet" className="block text-sm font-medium text-gray-700 mb-1">
                  番地
                </label>
                <TextArea
                  id="MailingStreet"
                  name="MailingStreet"
                  value={formData.MailingStreet}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div>
                <label htmlFor="MailingCity" className="block text-sm font-medium text-gray-700 mb-1">
                  市区町村
                </label>
                <Input
                  id="MailingCity"
                  name="MailingCity"
                  value={formData.MailingCity}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="MailingState" className="block text-sm font-medium text-gray-700 mb-1">
                  都道府県
                </label>
                <Input
                  id="MailingState"
                  name="MailingState"
                  value={formData.MailingState}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="MailingPostalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  郵便番号
                </label>
                <Input
                  id="MailingPostalCode"
                  name="MailingPostalCode"
                  value={formData.MailingPostalCode}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="MailingCountry" className="block text-sm font-medium text-gray-700 mb-1">
                  国
                </label>
                <Input
                  id="MailingCountry"
                  name="MailingCountry"
                  value={formData.MailingCountry}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* 説明 */}
          <div>
            <label htmlFor="Description" className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <TextArea
              id="Description"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* ボタン */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-salesforce-blue hover:bg-salesforce-darkblue">
              {isSubmitting ? '作成中...' : '作成'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}