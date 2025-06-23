'use client'

import React, { useState } from 'react'
import { Button, Input, TextArea } from '@/components/ui'
import { useCreateEvent, useAccountSearch, useContactSearch, useOpportunitySearch } from '@/lib/salesforce/hooks'

interface EventCreateFormProps {
  onSuccess?: (eventId: string) => void
  onCancel?: () => void
  defaultValues?: {
    WhatId?: string
    WhoId?: string
    Subject?: string
  }
}

export function EventCreateForm({ onSuccess, onCancel, defaultValues }: EventCreateFormProps) {
  const { createEvent, isLoading, error, clearError } = useCreateEvent()
  
  const [formData, setFormData] = useState({
    Subject: defaultValues?.Subject || '',
    Description: '',
    StartDateTime: new Date().toISOString().slice(0, 16),
    EndDateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16), // 1時間後
    Location: '',
    WhatId: defaultValues?.WhatId || '',
    WhoId: defaultValues?.WhoId || '',
    whatSearchTerm: '',
    whoSearchTerm: ''
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const { data: accountResults } = useAccountSearch(formData.whatSearchTerm)
  const { data: contactResults } = useContactSearch(formData.whoSearchTerm)
  const { data: opportunityResults } = useOpportunitySearch(formData.whatSearchTerm)

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.Subject.trim()) {
      errors.Subject = '件名は必須です'
    }
    
    if (!formData.StartDateTime) {
      errors.StartDateTime = '開始日時は必須です'
    }
    
    if (!formData.EndDateTime) {
      errors.EndDateTime = '終了日時は必須です'
    }
    
    if (formData.StartDateTime && formData.EndDateTime) {
      const startDate = new Date(formData.StartDateTime)
      const endDate = new Date(formData.EndDateTime)
      
      if (endDate <= startDate) {
        errors.EndDateTime = '終了日時は開始日時より後に設定してください'
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (!validateForm()) {
      return
    }

    const result = await createEvent({
      Subject: formData.Subject,
      Description: formData.Description || undefined,
      StartDateTime: formData.StartDateTime,
      EndDateTime: formData.EndDateTime,
      Location: formData.Location || undefined,
      WhatId: formData.WhatId || undefined,
      WhoId: formData.WhoId || undefined
    })

    if (result?.success) {
      onSuccess?.(result.id)
    }
  }

  const handleWhatSelect = (id: string, name: string) => {
    setFormData(prev => ({ ...prev, WhatId: id, whatSearchTerm: name }))
  }

  const handleWhoSelect = (id: string, name: string) => {
    setFormData(prev => ({ ...prev, WhoId: id, whoSearchTerm: name }))
  }

  const clearWhatSelection = () => {
    setFormData(prev => ({ ...prev, WhatId: '', whatSearchTerm: '' }))
  }

  const clearWhoSelection = () => {
    setFormData(prev => ({ ...prev, WhoId: '', whoSearchTerm: '' }))
  }

  const handleStartDateTimeChange = (value: string) => {
    setFormData(prev => {
      const newStartDate = new Date(value)
      const currentEndDate = new Date(prev.EndDateTime)
      
      // 終了時間が開始時間より前になる場合、終了時間を開始時間の1時間後に設定
      let newEndDateTime = prev.EndDateTime
      if (currentEndDate <= newStartDate) {
        newEndDateTime = new Date(newStartDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)
      }
      
      return {
        ...prev,
        StartDateTime: value,
        EndDateTime: newEndDateTime
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">エラーが発生しました</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 基本情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">基本情報</h3>
        
        {/* 件名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            件名 <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.Subject}
            onChange={(e) => setFormData(prev => ({ ...prev, Subject: e.target.value }))}
            placeholder="イベントの件名を入力してください"
            error={validationErrors.Subject}
            required
          />
        </div>

        {/* 説明 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            説明
          </label>
          <TextArea
            value={formData.Description}
            onChange={(e) => setFormData(prev => ({ ...prev, Description: e.target.value }))}
            placeholder="イベントの詳細説明（任意）"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 開始日時 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              開始日時 <span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              value={formData.StartDateTime}
              onChange={(e) => handleStartDateTimeChange(e.target.value)}
              error={validationErrors.StartDateTime}
              required
            />
          </div>

          {/* 終了日時 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              終了日時 <span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              value={formData.EndDateTime}
              onChange={(e) => setFormData(prev => ({ ...prev, EndDateTime: e.target.value }))}
              error={validationErrors.EndDateTime}
              required
            />
          </div>
        </div>

        {/* 場所 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            場所
          </label>
          <Input
            type="text"
            value={formData.Location}
            onChange={(e) => setFormData(prev => ({ ...prev, Location: e.target.value }))}
            placeholder="イベントの開催場所（任意）"
          />
        </div>
      </div>

      {/* 関連レコード */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">関連レコード</h3>
        
        {/* 関連先（What） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            関連先（取引先・商談）
          </label>
          {formData.WhatId ? (
            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                {formData.whatSearchTerm}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={clearWhatSelection}
              >
                クリア
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                type="text"
                value={formData.whatSearchTerm}
                onChange={(e) => setFormData(prev => ({ ...prev, whatSearchTerm: e.target.value }))}
                placeholder="取引先または商談を検索..."
              />
              {formData.whatSearchTerm && (accountResults?.records.length || opportunityResults?.records.length) ? (
                <div className="border border-gray-200 rounded-md max-h-40 overflow-y-auto">
                  {accountResults?.records.map(account => (
                    <button
                      key={account.Id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      onClick={() => handleWhatSelect(account.Id, account.Name)}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium">{account.Name}</div>
                          <div className="text-xs text-gray-500">取引先</div>
                        </div>
                      </div>
                    </button>
                  ))}
                  {opportunityResults?.records.map(opportunity => (
                    <button
                      key={opportunity.Id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      onClick={() => handleWhatSelect(opportunity.Id, opportunity.Name)}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium">{opportunity.Name}</div>
                          <div className="text-xs text-gray-500">商談 - {opportunity.Account?.Name}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* 取引先責任者（Who） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            取引先責任者
          </label>
          {formData.WhoId ? (
            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                {formData.whoSearchTerm}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={clearWhoSelection}
              >
                クリア
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                type="text"
                value={formData.whoSearchTerm}
                onChange={(e) => setFormData(prev => ({ ...prev, whoSearchTerm: e.target.value }))}
                placeholder="取引先責任者を検索..."
              />
              {formData.whoSearchTerm && contactResults?.records.length ? (
                <div className="border border-gray-200 rounded-md max-h-40 overflow-y-auto">
                  {contactResults.records.map(contact => (
                    <button
                      key={contact.Id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      onClick={() => handleWhoSelect(contact.Id, contact.Name)}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium">{contact.Name}</div>
                          <div className="text-xs text-gray-500">{contact.Account?.Name}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* ボタン */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              作成中...
            </div>
          ) : (
            'イベントを作成'
          )}
        </Button>
      </div>
    </form>
  )
}