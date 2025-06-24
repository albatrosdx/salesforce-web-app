'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Opportunity } from '@/types'
import { Card, CardContent, CardHeader, Button, Input, TextArea } from '@/components/ui'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select'

interface OpportunityEditFormProps {
  opportunity: Opportunity
  onCancel: () => void
  onSuccess?: (updatedOpportunity: Opportunity) => void
}

export function OpportunityEditForm({ opportunity, onCancel, onSuccess }: OpportunityEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    Name: opportunity.Name || '',
    StageName: opportunity.StageName || '',
    CloseDate: opportunity.CloseDate || '',
    Amount: opportunity.Amount?.toString() || '',
    Probability: opportunity.Probability?.toString() || '',
    Type: opportunity.Type || '__NONE__',
    LeadSource: opportunity.LeadSource || '__NONE__',
    Description: opportunity.Description || ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/salesforce/opportunities/${opportunity.Id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: formData.Name,
          StageName: formData.StageName,
          CloseDate: formData.CloseDate,
          Amount: formData.Amount ? (isNaN(parseFloat(formData.Amount)) ? null : parseFloat(formData.Amount)) : null,
          Probability: formData.Probability ? (isNaN(parseFloat(formData.Probability)) ? null : parseFloat(formData.Probability)) : null,
          Type: formData.Type === '__NONE__' ? null : formData.Type || null,
          LeadSource: formData.LeadSource === '__NONE__' ? null : formData.LeadSource || null,
          Description: formData.Description || null
        }),
      })

      if (!response.ok) {
        let errorMessage = '更新に失敗しました'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const updatedOpportunity = await response.json()
      
      if (onSuccess) {
        onSuccess(updatedOpportunity)
      } else {
        router.refresh()
        onCancel()
      }
    } catch (error) {
      console.error('Opportunity update error:', error)
      alert(error instanceof Error ? error.message : '更新中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">商談の編集</h2>
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
                <Label htmlFor="name">商談名 *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.Name}
                  onChange={(e) => handleInputChange('Name', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="stageName">ステージ *</Label>
                <Select value={formData.StageName} onValueChange={(value) => handleInputChange('StageName', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="ステージを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prospecting">見込み発掘</SelectItem>
                    <SelectItem value="Qualification">検討段階</SelectItem>
                    <SelectItem value="Needs Analysis">ニーズ分析</SelectItem>
                    <SelectItem value="Value Proposition">提案段階</SelectItem>
                    <SelectItem value="Id. Decision Makers">決裁者特定</SelectItem>
                    <SelectItem value="Proposal/Price Quote">見積提示</SelectItem>
                    <SelectItem value="Negotiation/Review">交渉段階</SelectItem>
                    <SelectItem value="Closed Won">受注</SelectItem>
                    <SelectItem value="Closed Lost">失注</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="closeDate">完了予定日 *</Label>
                <Input
                  id="closeDate"
                  type="date"
                  value={formData.CloseDate}
                  onChange={(e) => handleInputChange('CloseDate', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="amount">金額</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.Amount}
                  onChange={(e) => handleInputChange('Amount', e.target.value)}
                  disabled={isLoading}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="probability">確度 (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  value={formData.Probability}
                  onChange={(e) => handleInputChange('Probability', e.target.value)}
                  disabled={isLoading}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="type">種別</Label>
                <Select value={formData.Type} onValueChange={(value) => handleInputChange('Type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="種別を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__NONE__">未選択</SelectItem>
                    <SelectItem value="Existing Customer - Upgrade">既存顧客 - アップグレード</SelectItem>
                    <SelectItem value="Existing Customer - Replacement">既存顧客 - 置換</SelectItem>
                    <SelectItem value="Existing Customer - Downgrade">既存顧客 - ダウングレード</SelectItem>
                    <SelectItem value="New Customer">新規顧客</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="leadSource">リードソース</Label>
                <Select value={formData.LeadSource} onValueChange={(value) => handleInputChange('LeadSource', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="リードソースを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__NONE__">未選択</SelectItem>
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="Phone Inquiry">電話問い合わせ</SelectItem>
                    <SelectItem value="Partner Referral">パートナー紹介</SelectItem>
                    <SelectItem value="Purchased List">購入リスト</SelectItem>
                    <SelectItem value="Other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              disabled={isLoading || !formData.Name.trim() || !formData.StageName.trim() || !formData.CloseDate.trim()}
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