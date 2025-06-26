'use server'

import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { SalesforceClient } from '@/lib/salesforce/client'
import { handleSalesforceError } from '@/lib/api/middleware'
import { Account } from '@/types'

// Salesforceからアクセストークンを取得する関数 (既存のものを再利用)
async function getSalesforceAccessToken() {
  const { SALESFORCE_INSTANCE_URL, SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET } = process.env

  if (!SALESFORCE_INSTANCE_URL || !SALESFORCE_CLIENT_ID || !SALESFORCE_CLIENT_SECRET) {
    throw new Error('Salesforce API credentials are not configured in environment variables.')
  }

  const tokenUrl = `${SALESFORCE_INSTANCE_URL}/services/oauth2/token`
  const params = new URLSearchParams()
  params.append('grant_type', 'client_credentials')
  params.append('client_id', SALESFORCE_CLIENT_ID)
  params.append('client_secret', SALESFORCE_CLIENT_SECRET)

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${data.error_description || 'Unknown error'}`)
  }

  return data.access_token
}

export async function POST(request: Request) {
  try {
    const { accountId, prompt } = await request.json()

    if (!accountId || !prompt) {
      return NextResponse.json({ error: 'accountId and prompt are required' }, { status: 400 })
    }

    const { SALESFORCE_AGENT_ID, SALESFORCE_INSTANCE_URL } = process.env
    if (!SALESFORCE_AGENT_ID || !SALESFORCE_INSTANCE_URL) {
      return NextResponse.json({ error: 'Agent ID or Instance URL is not configured' }, { status: 500 })
    }

    const accessToken = await getSalesforceAccessToken()

    const client = new SalesforceClient(SALESFORCE_INSTANCE_URL, accessToken)

    let sessionData: { externalSessionKey: string; endpoints: { messages: string; end: string } } | null = null
    let account: Account | null = null

    try {
      account = await client.getAccount(accountId)
      if (account.AgentSessionData__c) {
        sessionData = JSON.parse(account.AgentSessionData__c)
        // TODO: Validate if sessionData is still valid/active
      }
    } catch (err) {
      console.warn(`Could not retrieve or parse AgentSessionData for account ${accountId}:`, err)
      // Continue without session data if there's an error
    }

    // セッションが存在しない、または無効な場合は新規作成
    if (!sessionData || !sessionData.endpoints || !sessionData.endpoints.messages || !sessionData.endpoints.end) {
      const externalSessionKey = randomUUID()
      const sessionResponse = await fetch(`https://api.salesforce.com/einstein/ai-agent/v1/agents/${SALESFORCE_AGENT_ID}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          externalSessionKey,
          instanceConfig: {
            endpoint: SALESFORCE_INSTANCE_URL,
          },
          streamingCapabilities: {
            chunkTypes: ['Text'],
          },
          bypassUser: true,
        }),
      })

      const newSessionData = await sessionResponse.json()
      if (!sessionResponse.ok) {
        console.error('Salesforce session creation failed:', newSessionData)
        return NextResponse.json({ error: 'Failed to create agent session', details: newSessionData }, { status: 500 })
      }
      sessionData = newSessionData

      // 新しいセッションデータを取引先に保存
      if (account) {
        await client.updateAccountAgentSession(accountId, JSON.stringify(sessionData))
      }
    }

    // sessionDataがnullでないことを保証
    if (!sessionData || !sessionData.endpoints) {
      console.error('Session data is unexpectedly null or invalid after creation attempt.')
      return NextResponse.json({ error: 'Internal Server Error: Session data missing.' }, { status: 500 })
    }

    const { messages: messagesUrl, end: endSessionUrl } = sessionData.endpoints

    // プロンプトをメッセージとして送信
    const messageResponse = await fetch(messagesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: { 
          text: prompt 
        }
      }),
    })

    if (!messageResponse.ok || !messageResponse.body) {
      const errorBody = await messageResponse.text()
      console.error('Failed to send message to agent:', errorBody)
      return NextResponse.json({ error: 'Failed to send message to agent', details: errorBody }, { status: 500 })
    }

    // 3. ストリーミングレスポンスを処理
    const reader = messageResponse.body.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(line => line.startsWith('data:'))
      for (const line of lines) {
        try {
          const jsonStr = line.substring(5).trim()
          const data = JSON.parse(jsonStr)
          if (data.chunk.type === 'Text') {
            fullResponse += data.chunk.text
          }
        } catch (err) {
          console.warn('Could not parse streaming chunk:', line, err)
        }
      }
    }

    // 4. セッションを終了 (今回はリクエストごとに終了させる)
    await fetch(endSessionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    return NextResponse.json({ response: fullResponse })

  } catch (error: unknown) {
    console.error('Agent API error:', error)
    return handleSalesforceError(error)
  }
}