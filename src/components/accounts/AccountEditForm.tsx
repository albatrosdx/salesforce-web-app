'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Account } from '@/types'
import { Card, CardContent, CardHeader, Button } from '@/components/ui'
import { Label } from '@/components/ui/label'
import { Input, TextArea } from '@/components/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select'

interface AccountEditFormProps {
  account: Account
  onCancel: () => void
  onSuccess?: (updatedAccount: Account) => void
}

export function AccountEditForm({ account, onCancel, onSuccess }: AccountEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    Name: account.Name || '',
    Type: account.Type || '',
    Industry: account.Industry || '',
    Phone: account.Phone || '',
    Website: account.Website || '',
    NumberOfEmployees: account.NumberOfEmployees?.toString() || '',
    AnnualRevenue: account.AnnualRevenue?.toString() || '',
    BillingStreet: account.BillingAddress?.street || '',
    BillingCity: account.BillingAddress?.city || '',
    BillingState: account.BillingAddress?.state || '',
    BillingPostalCode: account.BillingAddress?.postalCode || '',
    BillingCountry: account.BillingAddress?.country || '',
    Description: account.Description || ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/salesforce/accounts/${account.Id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: formData.Name,
          Type: formData.Type || null,
          Industry: formData.Industry || null,
          Phone: formData.Phone || null,
          Website: formData.Website || null,
          NumberOfEmployees: formData.NumberOfEmployees ? parseInt(formData.NumberOfEmployees) : null,
          AnnualRevenue: formData.AnnualRevenue ? parseFloat(formData.AnnualRevenue) : null,
          BillingStreet: formData.BillingStreet || null,
          BillingCity: formData.BillingCity || null,
          BillingState: formData.BillingState || null,
          BillingPostalCode: formData.BillingPostalCode || null,
          BillingCountry: formData.BillingCountry || null,
          Description: formData.Description || null
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`更新に失敗しました: ${errorText}`)
      }

      const updatedAccount = await response.json()
      
      if (onSuccess) {
        onSuccess(updatedAccount)
      } else {
        router.refresh()
        onCancel()
      }
    } catch (error) {
      console.error('Account update error:', error)
      alert(error instanceof Error ? error.message : '更新中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">取引先の編集</h2>
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
                <Label htmlFor="name">取引先名 *</Label>
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
                <Label htmlFor="type">種別</Label>
                <Select value={formData.Type} onValueChange={(value) => handleInputChange('Type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="種別を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">未選択</SelectItem>
                    <SelectItem value="Prospect">見込み客</SelectItem>
                    <SelectItem value="Customer - Direct">直接顧客</SelectItem>
                    <SelectItem value="Customer - Channel">チャネル顧客</SelectItem>
                    <SelectItem value="Channel Partner / Reseller">チャネルパートナー/リセラー</SelectItem>
                    <SelectItem value="Installation Partner">実装パートナー</SelectItem>
                    <SelectItem value="Technology Partner">技術パートナー</SelectItem>
                    <SelectItem value="Other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="industry">業界</Label>
                <Select value={formData.Industry} onValueChange={(value) => handleInputChange('Industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="業界を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">未選択</SelectItem>
                    <SelectItem value="Agriculture">農業</SelectItem>
                    <SelectItem value="Apparel">アパレル</SelectItem>
                    <SelectItem value="Banking">銀行</SelectItem>
                    <SelectItem value="Biotechnology">バイオテクノロジー</SelectItem>
                    <SelectItem value="Chemicals">化学</SelectItem>
                    <SelectItem value="Communications">通信</SelectItem>
                    <SelectItem value="Construction">建設</SelectItem>
                    <SelectItem value="Consulting">コンサルティング</SelectItem>
                    <SelectItem value="Education">教育</SelectItem>
                    <SelectItem value="Electronics">電子機器</SelectItem>
                    <SelectItem value="Energy">エネルギー</SelectItem>
                    <SelectItem value="Engineering">エンジニアリング</SelectItem>
                    <SelectItem value="Entertainment">エンターテインメント</SelectItem>
                    <SelectItem value="Environmental">環境</SelectItem>
                    <SelectItem value="Finance">金融</SelectItem>
                    <SelectItem value="Food & Beverage">食品・飲料</SelectItem>
                    <SelectItem value="Government">政府</SelectItem>
                    <SelectItem value="Healthcare">ヘルスケア</SelectItem>
                    <SelectItem value="Hospitality">ホスピタリティ</SelectItem>
                    <SelectItem value="Insurance">保険</SelectItem>
                    <SelectItem value="Machinery">機械</SelectItem>
                    <SelectItem value="Manufacturing">製造業</SelectItem>
                    <SelectItem value="Media">メディア</SelectItem>
                    <SelectItem value="Not For Profit">非営利</SelectItem>
                    <SelectItem value="Recreation">レクリエーション</SelectItem>
                    <SelectItem value="Retail">小売</SelectItem>
                    <SelectItem value="Shipping">配送</SelectItem>
                    <SelectItem value="Technology">技術</SelectItem>
                    <SelectItem value="Telecommunications">電気通信</SelectItem>
                    <SelectItem value="Transportation">交通</SelectItem>
                    <SelectItem value="Utilities">公共事業</SelectItem>
                    <SelectItem value="Other">その他</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="website">ウェブサイト</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.Website}
                  onChange={(e) => handleInputChange('Website', e.target.value)}
                  disabled={isLoading}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="employees">従業員数</Label>
                <Input
                  id="employees"
                  type="number"
                  value={formData.NumberOfEmployees}
                  onChange={(e) => handleInputChange('NumberOfEmployees', e.target.value)}
                  disabled={isLoading}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="revenue">年間売上</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={formData.AnnualRevenue}
                  onChange={(e) => handleInputChange('AnnualRevenue', e.target.value)}
                  disabled={isLoading}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* 住所情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">請求先住所</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="billingStreet">住所</Label>
                <Input
                  id="billingStreet"
                  type="text"
                  value={formData.BillingStreet}
                  onChange={(e) => handleInputChange('BillingStreet', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="billingCity">市区町村</Label>
                <Input
                  id="billingCity"
                  type="text"
                  value={formData.BillingCity}
                  onChange={(e) => handleInputChange('BillingCity', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="billingState">都道府県</Label>
                <Input
                  id="billingState"
                  type="text"
                  value={formData.BillingState}
                  onChange={(e) => handleInputChange('BillingState', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="billingPostalCode">郵便番号</Label>
                <Input
                  id="billingPostalCode"
                  type="text"
                  value={formData.BillingPostalCode}
                  onChange={(e) => handleInputChange('BillingPostalCode', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="billingCountry">国</Label>
                <Input
                  id="billingCountry"
                  type="text"
                  value={formData.BillingCountry}
                  onChange={(e) => handleInputChange('BillingCountry', e.target.value)}
                  disabled={isLoading}
                />
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
              disabled={isLoading || !formData.Name.trim()}
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