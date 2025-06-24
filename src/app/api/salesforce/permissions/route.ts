import { createSalesforceClient, createApiResponse, createApiError } from '@/lib/api/salesforce'
import { handleSalesforceError } from '@/lib/api/middleware'

export async function GET() {
  try {
    const client = await createSalesforceClient()
    
    if (!client) {
      return createApiError('Unauthorized', 401)
    }

    const permissions = await client.getUserPermissions()
    
    return createApiResponse(permissions)
  } catch (error: any) {
    console.error('Permissions API error:', error)
    return handleSalesforceError(error)
  }
}