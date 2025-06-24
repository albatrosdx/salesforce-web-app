'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, TextArea, Select, Card, CardContent } from '@/components/ui'

interface OpportunityCreateFormProps {
  accountId?: string
}

export function OpportunityCreateForm({ accountId }: OpportunityCreateFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    Name: '',
    AccountId: accountId || '',
    StageName: 'Prospecting',
    CloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30日後
    Amount: '',
    Probability: '10',
    Type: 'New Business',
    LeadSource: '',
    Description: ''
  })

  const stageOptions = [
    { value: 'Prospecting', label: 'プロスペクティング' },
    { value: 'Qualification', label: '評価' },
    { value: 'Needs Analysis', label: 'ニーズ分析' },
    { value: 'Value Proposition', label: '価値提案' },
    { value: 'Id. Decision Makers', label: '意思決定者の特定' },
    { value: 'Perception Analysis', label: '認識分析' },
    { value: 'Proposal/Price Quote', label: '提案/見積もり' },
    { value: 'Negotiation/Review', label: '交渉/レビュー' },
    { value: 'Closed Won', label: '受注' },
    { value: 'Closed Lost', label: '失注' }
  ]

  const typeOptions = [
    { value: 'New Business', label: '新規ビジネス' },
    { value: 'Existing Business', label: '既存ビジネス' }
  ]

  const leadSourceOptions = [
    { value: 'Web', label: 'ウェブ' },
    { value: 'Phone Inquiry', label: '電話問い合わせ' },
    { value: 'Partner Referral', label: 'パートナー紹介' },
    { value: 'Purchased List', label: '購入リスト' },
    { value: 'Other', label: 'その他' }
  ]

  const stageProbabilityMap: Record<string, string> = {
    'Prospecting': '10',
    'Qualification': '10',
    'Needs Analysis': '20',
    'Value Proposition': '50',
    'Id. Decision Makers': '60',
    'Perception Analysis': '70',
    'Proposal/Price Quote': '75',
    'Negotiation/Review': '90',
    'Closed Won': '100',
    'Closed Lost': '0'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/salesforce/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create opportunity')
      }

      const data = await response.json()
      router.push(`/dashboard/opportunities/${data.id}`)
    } catch (error) {
      console.error('Error creating opportunity:', error)
      alert('商談の作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    
    // ステージが変更されたら確率も自動更新
    if (name === 'StageName') {
      setFormData({
        ...formData,
        [name]: value,
        Probability: stageProbabilityMap[value] || '0'
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-1">
                  商談名 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  required
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
              <div>
                <label htmlFor="Type" className="block text-sm font-medium text-gray-700 mb-1">
                  種別
                </label>
                <Select
                  id="Type"
                  name="Type"
                  value={formData.Type}
                  onChange={handleChange}
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* ステージ情報 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">ステージ情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="StageName" className="block text-sm font-medium text-gray-700 mb-1">
                  ステージ <span className="text-red-500">*</span>
                </label>
                <Select
                  id="StageName"
                  name="StageName"
                  value={formData.StageName}
                  onChange={handleChange}
                  required
                >
                  {stageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label htmlFor="Probability" className="block text-sm font-medium text-gray-700 mb-1">
                  確率 (%)
                </label>
                <Input
                  id="Probability"
                  name="Probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.Probability}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="CloseDate" className="block text-sm font-medium text-gray-700 mb-1">
                  完了予定日 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="CloseDate"
                  name="CloseDate"
                  type="date"
                  value={formData.CloseDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="Amount" className="block text-sm font-medium text-gray-700 mb-1">
                  金額
                </label>
                <Input
                  id="Amount"
                  name="Amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.Amount}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* その他情報 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">その他情報</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="LeadSource" className="block text-sm font-medium text-gray-700 mb-1">
                  リードソース
                </label>
                <Select
                  id="LeadSource"
                  name="LeadSource"
                  value={formData.LeadSource}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {leadSourceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
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
            </div>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '作成中...' : '作成'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}