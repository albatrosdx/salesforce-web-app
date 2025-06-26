'use client'

import { useState } from 'react'
import { Button, TextArea, Card, CardContent } from '@/components/ui'

export function AgentInteraction({ accountId }: { accountId: string }) {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!prompt) return
    setIsLoading(true)
    setResponse('')
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId, prompt }),
      })

      if (!res.ok) {
        throw new Error('API request failed')
      }

      const data = await res.json()
      setResponse(data.response)
    } catch (e) {
      console.error(e)
      setResponse('An error occurred while processing your request.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="agent-prompt" className="block text-sm font-medium text-gray-700 mb-2">
          プロンプト
        </label>
        <TextArea
          id="agent-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例: この取引先の概要を3行で作成してください。"
          rows={4}
          className="w-full"
        />
      </div>
      <Button onClick={handleSubmit} disabled={isLoading || !prompt}>
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            処理中...
          </>
        ) : (
          '実行'
        )}
      </Button>
      {response && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{response}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}