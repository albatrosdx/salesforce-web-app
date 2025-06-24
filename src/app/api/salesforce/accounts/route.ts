import { NextRequest } from 'next/server'
import { createSalesforceClient, createApiResponse, createApiError } from '@/lib/api/salesforce'
import { handleSalesforceError } from '@/lib/api/middleware'

export async function GET(request: NextRequest) {
  try {
    const client = await createSalesforceClient()
    
    if (!client) {
      return createApiError('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Calculate offset from page
    const offset = (page - 1) * limit
    
    let accounts
    if (search) {
      // Use search functionality if search term provided
      accounts = await client.searchAccounts(search, limit, offset)
    } else {
      // Use regular getAccounts method
      accounts = await client.getAccounts(limit, offset)
    }
    
    return createApiResponse(accounts)
  } catch (error: any) {
    console.error('Accounts API error:', error)
    return handleSalesforceError(error)
  }
}