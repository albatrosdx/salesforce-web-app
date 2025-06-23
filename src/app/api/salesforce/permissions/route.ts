import { createSalesforceClient, createApiResponse, createApiError } from '@/lib/api/salesforce'

export async function GET() {
  try {
    const client = await createSalesforceClient()
    
    if (!client) {
      return createApiError('Unauthorized', 401)
    }

    const permissions = await client.getUserPermissions()
    
    return createApiResponse(permissions)
  } catch (error) {
    console.error('Permissions API error:', error)
    
    // フォールバック権限を返す
    const fallbackPermissions = {
      accounts: { create: false, read: true, edit: false, delete: false },
      contacts: { create: false, read: true, edit: false, delete: false },
      opportunities: { create: false, read: true, edit: false, delete: false },
      activities: { create: false, read: true, edit: false, delete: false }
    }
    
    return createApiResponse(fallbackPermissions)
  }
}