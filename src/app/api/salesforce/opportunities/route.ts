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
    
    let opportunities
    if (search) {
      // Use search functionality if search term provided
      opportunities = await client.searchOpportunities(search, limit, offset)
    } else {
      // Use regular getOpportunities method
      opportunities = await client.getOpportunities(limit, offset)
    }
    
    return createApiResponse(opportunities)
  } catch (error) {
    console.error('Opportunities API error:', error)
    return createApiError('Failed to fetch opportunities', 500)
  }
}