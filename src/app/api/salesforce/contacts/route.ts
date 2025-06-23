import { NextRequest } from 'next/server'
import { createSalesforceClient, createApiResponse, createApiError } from '@/lib/api/salesforce'

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

    const contacts = await client.getContacts({
      search,
      page,
      limit
    })
    
    return createApiResponse(contacts)
  } catch (error) {
    console.error('Contacts API error:', error)
    return createApiError('Failed to fetch contacts', 500)
  }
}