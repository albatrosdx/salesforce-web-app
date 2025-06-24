'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { 
  Account, 
  Contact, 
  Opportunity, 
  Task, 
  Event,
  SalesforceQueryResponse,
  LoadingState 
} from '@/types'

// APIルート経由でデータを取得する汎用フック
function useApiData<T>(
  url: string | null,
  dependencies: any[] = []
): LoadingState & { data: T | null; refetch: () => void } {
  const [state, setState] = useState<LoadingState & { data: T | null }>({
    isLoading: true,
    error: null,
    data: null
  })
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    if (!url) {
      setState({ isLoading: false, error: null, data: null })
      return
    }

    let isCancelled = false
    
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      try {
        const response = await fetch(url)
        
        if (!response.ok) {
          // 401エラーの場合は自動的にサインアウト
          if (response.status === 401) {
            const errorData = await response.json().catch(() => ({}))
            if (errorData.code === 'SESSION_EXPIRED' || response.status === 401) {
              await signOut({ callbackUrl: '/auth/signin' })
              throw new Error('Session expired')
            }
          }
          
          const errorText = await response.text()
          throw new Error(errorText || `HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (!isCancelled) {
          setState({ isLoading: false, error: null, data: result })
        }
      } catch (error) {
        if (!isCancelled) {
          setState({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Unknown error',
            data: null 
          })
        }
      }
    }

    fetchData()

    return () => {
      isCancelled = true
    }
  }, [url, refetchTrigger, ...dependencies])

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1)
  }

  return { ...state, refetch }
}

// Account関連フック
export function useAccount(id: string | null) {
  return useApiData<Account>(
    id ? `/api/salesforce/accounts/${id}` : null,
    [id]
  )
}

export function useContactsByAccount(accountId: string | null) {
  return useApiData<SalesforceQueryResponse<Contact>>(
    accountId ? `/api/salesforce/accounts/${accountId}/contacts` : null,
    [accountId]
  )
}

export function useOpportunitiesByAccount(accountId: string | null) {
  return useApiData<SalesforceQueryResponse<Opportunity>>(
    accountId ? `/api/salesforce/accounts/${accountId}/opportunities` : null,
    [accountId]
  )
}

// Contact関連フック
export function useContact(id: string | null) {
  return useApiData<Contact>(
    id ? `/api/salesforce/contacts/${id}` : null,
    [id]
  )
}

export function useAccountByContact(contactId: string | null, accountId: string | null) {
  return useApiData<Account>(
    contactId && accountId ? `/api/salesforce/accounts/${accountId}` : null,
    [contactId, accountId]
  )
}

export function useOpportunitiesByContact(contactId: string | null) {
  return useApiData<SalesforceQueryResponse<Opportunity>>(
    contactId ? `/api/salesforce/contacts/${contactId}/opportunities` : null,
    [contactId]
  )
}

// Opportunity関連フック
export function useOpportunity(id: string | null) {
  return useApiData<Opportunity>(
    id ? `/api/salesforce/opportunities/${id}` : null,
    [id]
  )
}

// Activity関連フック
export function useActivitiesByWhat(whatId: string | null) {
  return useApiData<{
    tasks: SalesforceQueryResponse<Task>
    events: SalesforceQueryResponse<Event>
  }>(
    whatId ? `/api/salesforce/activities/by-what/${whatId}` : null,
    [whatId]
  )
}

export function useActivitiesByWho(whoId: string | null) {
  return useApiData<{
    tasks: SalesforceQueryResponse<Task>
    events: SalesforceQueryResponse<Event>
  }>(
    whoId ? `/api/salesforce/activities/by-who/${whoId}` : null,
    [whoId]
  )
}

// 活動作成用フック
export function useCreateActivity() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createActivity = async (activityType: 'Task' | 'Event', activityData: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/salesforce/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: activityType,
          data: activityData
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to create activity')
      }

      const result = await response.json()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createActivity,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}