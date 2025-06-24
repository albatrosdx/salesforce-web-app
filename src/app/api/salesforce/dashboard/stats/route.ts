import { createSalesforceClient, createApiResponse, createApiError } from '@/lib/api/salesforce'
import { handleSalesforceError } from '@/lib/api/middleware'

export async function GET() {
  try {
    const client = await createSalesforceClient()
    
    if (!client) {
      return createApiError('Unauthorized', 401)
    }

    // 各エンティティの総数を取得
    const accountsQuery = 'SELECT COUNT() FROM Account'
    const contactsQuery = 'SELECT COUNT() FROM Contact'
    const opportunitiesQuery = 'SELECT COUNT() FROM Opportunity'
    const activitiesQuery = 'SELECT COUNT() FROM Task'
    
    // 商談の売上合計
    const revenueQuery = 'SELECT SUM(Amount) revenue FROM Opportunity WHERE StageName = \'Closed Won\' AND Amount != NULL'
    
    // 受注商談数
    const closedWonQuery = 'SELECT COUNT() FROM Opportunity WHERE StageName = \'Closed Won\''
    
    // 今月の新規取引先数
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const thisMonthStr = thisMonth.toISOString().split('T')[0]
    const newAccountsQuery = `SELECT COUNT() FROM Account WHERE CreatedDate >= ${thisMonthStr}T00:00:00Z`
    
    // 今後の活動数（未完了）
    const upcomingActivitiesQuery = 'SELECT COUNT() FROM Task WHERE IsClosed = false'

    // 並行してクエリを実行
    const [
      accountsResult,
      contactsResult,
      opportunitiesResult,
      activitiesResult,
      revenueResult,
      closedWonResult,
      newAccountsResult,
      upcomingActivitiesResult
    ] = await Promise.all([
      client.query(accountsQuery),
      client.query(contactsQuery),
      client.query(opportunitiesQuery),
      client.query(activitiesQuery),
      client.query(revenueQuery),
      client.query(closedWonQuery),
      client.query(newAccountsQuery),
      client.query(upcomingActivitiesQuery)
    ])

    const stats = {
      accounts: (accountsResult.records[0] as any)?.expr0 || 0,
      contacts: (contactsResult.records[0] as any)?.expr0 || 0,
      opportunities: (opportunitiesResult.records[0] as any)?.expr0 || 0,
      activities: (activitiesResult.records[0] as any)?.expr0 || 0,
      totalRevenue: (revenueResult.records[0] as any)?.revenue || 0,
      closedWonOpportunities: (closedWonResult.records[0] as any)?.expr0 || 0,
      newAccountsThisMonth: (newAccountsResult.records[0] as any)?.expr0 || 0,
      upcomingActivities: (upcomingActivitiesResult.records[0] as any)?.expr0 || 0
    }
    
    return createApiResponse(stats)
  } catch (error: any) {
    console.error('Dashboard stats API error:', error)
    return handleSalesforceError(error)
  }
}