'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, TextArea, Card, CardContent } from '@/components/ui'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select'

export function AccountCreateForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    Name: '',
    Type: '',
    Industry: '',
    Phone: '',
    Website: '',
    BillingStreet: '',
    BillingCity: '',
    BillingState: '',
    BillingPostalCode: '',
    BillingCountry: '',
    Description: '',
    NumberOfEmployees: '',
    AnnualRevenue: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/salesforce/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: formData.Name,
          Type: formData.Type === '__NONE__' ? null : formData.Type || null,
          Industry: formData.Industry === '__NONE__' ? null : formData.Industry || null,
          Phone: formData.Phone || null,
          Website: formData.Website || null,
          BillingStreet: formData.BillingStreet || null,
          BillingCity: formData.BillingCity || null,
          BillingState: formData.BillingState || null,
          BillingPostalCode: formData.BillingPostalCode || null,
          BillingCountry: formData.BillingCountry || null,
          Description: formData.Description || null,
          NumberOfEmployees: formData.NumberOfEmployees ? parseInt(formData.NumberOfEmployees) : null,
          AnnualRevenue: formData.AnnualRevenue ? parseFloat(formData.AnnualRevenue) : null
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`作成に失敗しました: ${errorText}`)
      }

      const data = await response.json()
      router.push(`/dashboard/accounts/${data.id}`)
    } catch (error) {
      console.error('Error creating account:', error)
      alert(error instanceof Error ? error.message : '取引先の作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleInputChange(e.target.name, e.target.value)
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
                <Label htmlFor="Name">取引先名 <span className="text-red-500">*</span></Label>
                <Input
                  id="Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="Type">種別</Label>
                <Select value={formData.Type} onValueChange={(value) => handleInputChange('Type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="種別を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__NONE__">未選択</SelectItem>
                    <SelectItem value="Prospect">見込み客</SelectItem>
                    <SelectItem value="Customer - Direct">顧客 - 直接</SelectItem>
                    <SelectItem value="Customer - Channel">顧客 - チャネル</SelectItem>
                    <SelectItem value="Channel Partner / Reseller">チャネルパートナー・販売代理店</SelectItem>
                    <SelectItem value="Installation Partner">設置パートナー</SelectItem>
                    <SelectItem value="Technology Partner">技術パートナー</SelectItem>
                    <SelectItem value="Other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="Industry">業界</Label>
                <Select value={formData.Industry} onValueChange={(value) => handleInputChange('Industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="業界を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__NONE__">未選択</SelectItem>
                    <SelectItem value="Agriculture">農業</SelectItem>
                    <SelectItem value="Apparel">アパレル</SelectItem>
                    <SelectItem value="Banking">銀行業</SelectItem>
                    <SelectItem value="Biotechnology">バイオテクノロジー</SelectItem>
                    <SelectItem value="Chemicals">化学</SelectItem>
                    <SelectItem value="Communications">通信</SelectItem>
                    <SelectItem value="Construction">建設</SelectItem>
                    <SelectItem value="Consulting">コンサルティング</SelectItem>
                    <SelectItem value="Education">教育</SelectItem>
                    <SelectItem value="Electronics">電子機器</SelectItem>
                    <SelectItem value="Energy">エネルギー</SelectItem>
                    <SelectItem value="Engineering">エンジニアリング</SelectItem>
                    <SelectItem value="Entertainment">エンターテイメント</SelectItem>
                    <SelectItem value="Environmental">環境</SelectItem>
                    <SelectItem value="Finance">金融</SelectItem>
                    <SelectItem value="Food & Beverage">飲食料品</SelectItem>
                    <SelectItem value="Government">政府機関</SelectItem>
                    <SelectItem value="Healthcare">ヘルスケア</SelectItem>
                    <SelectItem value="Hospitality">接客業</SelectItem>
                    <SelectItem value="Insurance">保険</SelectItem>
                    <SelectItem value="Machinery">機械</SelectItem>
                    <SelectItem value="Manufacturing">製造業</SelectItem>
                    <SelectItem value="Media">メディア</SelectItem>
                    <SelectItem value="Not For Profit">非営利団体</SelectItem>
                    <SelectItem value="Recreation">レクリエーション</SelectItem>
                    <SelectItem value="Retail">小売</SelectItem>
                    <SelectItem value="Shipping">運送</SelectItem>
                    <SelectItem value="Technology">テクノロジー</SelectItem>
                    <SelectItem value="Telecommunications">電気通信</SelectItem>
                    <SelectItem value="Transportation">輸送</SelectItem>
                    <SelectItem value="Utilities">公益事業</SelectItem>
                    <SelectItem value="Other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="Phone">電話番号</Label>
                <Input
                  id="Phone"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="Website">Webサイト</Label>
                <Input
                  id="Website"
                  name="Website"
                  type="url"
                  value={formData.Website}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="NumberOfEmployees">従業員数</Label>
                <Input
                  id="NumberOfEmployees"
                  name="NumberOfEmployees"
                  type="number"
                  value={formData.NumberOfEmployees}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="AnnualRevenue">年間売上</Label>
                <Input
                  id="AnnualRevenue"
                  name="AnnualRevenue"
                  type="number"
                  value={formData.AnnualRevenue}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* 請求先住所 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">請求先住所</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="BillingStreet">番地</Label>
                <TextArea
                  id="BillingStreet"
                  name="BillingStreet"
                  value={formData.BillingStreet}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="BillingCity">市区町村</Label>
                <Input
                  id="BillingCity"
                  name="BillingCity"
                  value={formData.BillingCity}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="BillingState">都道府県</Label>
                <Input
                  id="BillingState"
                  name="BillingState"
                  value={formData.BillingState}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="BillingPostalCode">郵便番号</Label>
                <Input
                  id="BillingPostalCode"
                  name="BillingPostalCode"
                  value={formData.BillingPostalCode}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="BillingCountry">国</Label>
                <Input
                  id="BillingCountry"
                  name="BillingCountry"
                  value={formData.BillingCountry}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* 説明 */}
          <div>
            <Label htmlFor="Description">説明</Label>
            <TextArea
              id="Description"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              disabled={isSubmitting}
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
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.Name.trim()} 
              className="bg-salesforce-blue hover:bg-salesforce-darkblue"
            >
              {isSubmitting ? '作成中...' : '作成'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}