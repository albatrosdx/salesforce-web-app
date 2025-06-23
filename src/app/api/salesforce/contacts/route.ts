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

    // Calculate offset from page
    const offset = (page - 1) * limit
    
    let contacts
    if (search) {
      // Use search functionality if search term provided
      contacts = await client.searchContacts(search, limit, offset)
    } else {
      // Use regular getContacts method
      contacts = await client.getContacts(limit, offset)
    }
    
    return createApiResponse(contacts)
  } catch (error) {
    console.error('Contacts API error:', error)
    return createApiError('Failed to fetch contacts', 500)
  }
}