'use client'

import { useSession } from 'next-auth/react'
import { useMemo, useState, useEffect } from 'react'
import { SalesforceClient } from './client'
import { 
  Account, 
  Contact, 
  Opportunity, 
  Task, 
  Event, 
  SalesforceQueryResponse,
  UserPermissions,
  LoadingState 
} from '@/types'

// Salesforce クライアントのフック
export function useSalesforceClient(): SalesforceClient | null {
  const { data: session } = useSession()
  
  return useMemo(() => {
    if (!session?.instanceUrl || !session?.accessToken) {
      return null
    }
    return new SalesforceClient(session.instanceUrl, session.accessToken)
  }, [session?.instanceUrl, session?.accessToken])
}

// データ取得用の汎用フック
function useAsyncData<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
): LoadingState & { data: T | null } {
  const [state, setState] = useState<LoadingState & { data: T | null }>({
    isLoading: true,
    error: null,
    data: null
  })

  useEffect(() => {
    let isCancelled = false
    
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      try {
        const result = await asyncFunction()
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
  }, dependencies)

  return state
}

// Account関連フック
export function useAccounts(limit = 50, offset = 0) {
  const client = useSalesforceClient()
  
  return useAsyncData(
    () => {
      if (!client) throw new Error('Salesforce client not available')
      return client.getAccounts(limit, offset)
    },
    [client, limit, offset]
  )
}

export function useAccount(id: string | null) {
  const client = useSalesforceClient()
  
  return useAsyncData(
    () => {
      if (!client || !id) throw new Error('Salesforce client or ID not available')
      return client.getAccount(id)
    },
    [client, id]
  )
}

export function useAccountSearch(searchTerm: string, limit = 20) {
  const client = useSalesforceClient()
  
  return useAsyncData(
    async () => {
      if (!client || !searchTerm.trim()) return { totalSize: 0, done: true, records: [] }
      return client.searchAccounts(searchTerm, limit)
    },
    [client, searchTerm, limit]
  )
}

// Contact関連フック
export function useContacts(limit = 50, offset = 0) {
  const client = useSalesforceClient()
  
  return useAsyncData(
    () => {
      if (!client) throw new Error('Salesforce client not available')
      return client.getContacts(limit, offset)
    },
    [client, limit, offset]
  )
}

export function useContact(id: string | null) {
  const client = useSalesforceClient()
  
  return useAsyncData(
    () => {
      if (!client || !id) throw new Error('Salesforce client or ID not available')
      return client.getContact(id)
    },
    [client, id]
  )
}

export function useContactsByAccount(accountId: string | null) {
  const client = useSalesforceClient()
  
  return useAsyncData(
    async () => {
      if (!client || !accountId) return { totalSize: 0, done: true, records: [] }
      return client.getContactsByAccount(accountId)
    },
    [client, accountId]
  )
}

// Opportunity関連フック
export function useOpportunities(limit = 50, offset = 0) {
  const client = useSalesforceClient()
  
  return useAsyncData(
    () => {
      if (!client) throw new Error('Salesforce client not available')
      return client.getOpportunities(limit, offset)
    },
    [client, limit, offset]
  )
}

export function useOpportunity(id: string | null) {
  const client = useSalesforceClient()
  
  return useAsyncData(
    () => {
      if (!client || !id) throw new Error('Salesforce client or ID not available')
      return client.getOpportunity(id)
    },
    [client, id]
  )
}

export function useOpportunitiesByAccount(accountId: string | null) {
  const client = useSalesforceClient()
  
  return useAsyncData(
    async () => {
      if (!client || !accountId) return { totalSize: 0, done: true, records: [] }
      return client.getOpportunitiesByAccount(accountId)
    },
    [client, accountId]
  )
}

// Activity関連フック
export function useActivitiesByWhat(whatId: string | null) {
  const client = useSalesforceClient()
  
  return useAsyncData(
    async () => {
      if (!client || !whatId) {
        return { 
          tasks: { totalSize: 0, done: true, records: [] },
          events: { totalSize: 0, done: true, records: [] }
        }
      }
      return client.getActivitiesByWhat(whatId)
    },
    [client, whatId]
  )
}

export function useActivitiesByWho(whoId: string | null) {
  const client = useSalesforceClient()
  
  return useAsyncData(
    async () => {
      if (!client || !whoId) {
        return { 
          tasks: { totalSize: 0, done: true, records: [] },
          events: { totalSize: 0, done: true, records: [] }
        }
      }
      return client.getActivitiesByWho(whoId)
    },
    [client, whoId]
  )
}

// 権限管理フック
export function useUserPermissions() {
  const client = useSalesforceClient()
  
  return useAsyncData(
    () => {
      if (!client) throw new Error('Salesforce client not available')
      return client.getUserPermissions()
    },
    [client]
  )
}

// CRUD操作用フック
export function useSalesforceActions() {
  const client = useSalesforceClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeAction = async <T>(action: () => Promise<T>): Promise<T | null> => {
    if (!client) {
      setError('Salesforce client not available')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const result = await action()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createRecord = (sobjectType: string, data: Record<string, any>) =>
    executeAction(() => client!.createRecord(sobjectType, data))

  const updateRecord = (sobjectType: string, id: string, data: Record<string, any>) =>
    executeAction(() => client!.updateRecord(sobjectType, id, data))

  const deleteRecord = (sobjectType: string, id: string) =>
    executeAction(() => client!.deleteRecord(sobjectType, id))

  return {
    loading,
    error,
    createRecord,
    updateRecord,
    deleteRecord,
    clearError: () => setError(null)
  }
}

// Picklist値取得フック
export function usePicklistValues(sobjectType: string, fieldName: string) {
  const client = useSalesforceClient()
  
  return useAsyncData(
    () => {
      if (!client) throw new Error('Salesforce client not available')
      return client.getPicklistValues(sobjectType, fieldName)
    },
    [client, sobjectType, fieldName]
  )
}