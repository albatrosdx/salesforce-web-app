'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, Button } from '@/components'
import { salesforceClient } from '@/lib/salesforce/client'

export default function NewActivityPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    Subject: '',
    Type: 'Call',
    Status: 'Not Started',
    Priority: 'Normal',
    ActivityDate: new Date().toISOString().split('T')[0],
    Description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    try {
      setLoading(true)
      setError(null)
      const client = salesforceClient(session)
      await client.create('Task', formData)
      router.push('/dashboard/activities')
    } catch (err) {
      console.error('Error creating activity:', err)
      setError('活動の作成中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">新規活動</h1>
      
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="Subject" className="block text-sm font-medium text-gray-700">
                件名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="Subject"
                name="Subject"
                value={formData.Subject}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="Type" className="block text-sm font-medium text-gray-700">
                種類
              </label>
              <select
                id="Type"
                name="Type"
                value={formData.Type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Call">電話</option>
                <option value="Email">メール</option>
                <option value="Meeting">会議</option>
                <option value="Other">その他</option>
              </select>
            </div>

            <div>
              <label htmlFor="Status" className="block text-sm font-medium text-gray-700">
                ステータス
              </label>
              <select
                id="Status"
                name="Status"
                value={formData.Status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Not Started">未開始</option>
                <option value="In Progress">進行中</option>
                <option value="Completed">完了</option>
                <option value="Waiting on someone else">他者待ち</option>
                <option value="Deferred">延期</option>
              </select>
            </div>

            <div>
              <label htmlFor="Priority" className="block text-sm font-medium text-gray-700">
                優先度
              </label>
              <select
                id="Priority"
                name="Priority"
                value={formData.Priority}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Low">低</option>
                <option value="Normal">中</option>
                <option value="High">高</option>
              </select>
            </div>

            <div>
              <label htmlFor="ActivityDate" className="block text-sm font-medium text-gray-700">
                期日
              </label>
              <input
                type="date"
                id="ActivityDate"
                name="ActivityDate"
                value={formData.ActivityDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="Description" className="block text-sm font-medium text-gray-700">
                説明
              </label>
              <textarea
                id="Description"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
              >
                キャンセル
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? '作成中...' : '作成'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}