import { 
  Account, 
  Contact, 
  Opportunity, 
  Task, 
  Event, 
  SalesforceQueryResponse,
  UserPermissions
} from '@/types'
import { SalesforceApiError } from './errors'

export class SalesforceClient {
  private instanceUrl: string
  private accessToken: string

  constructor(instanceUrl: string, accessToken: string) {
    this.instanceUrl = instanceUrl
    this.accessToken = accessToken
  }

  // 基本的なAPI呼び出しメソッド
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.instanceUrl}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let errorBody: any
      try {
        errorBody = await response.json()
      } catch {
        errorBody = await response.text()
      }
      throw SalesforceApiError.fromResponse(response.status, errorBody)
    }

    return response.json()
  }

  // SOQL クエリの実行
  async query<T>(soql: string): Promise<SalesforceQueryResponse<T>> {
    const endpoint = `/services/data/v58.0/query/?q=${encodeURIComponent(soql)}`
    return this.makeRequest<SalesforceQueryResponse<T>>(endpoint)
  }

  // 次のレコードセットの取得
  async queryMore<T>(nextRecordsUrl: string): Promise<SalesforceQueryResponse<T>> {
    return this.makeRequest<SalesforceQueryResponse<T>>(nextRecordsUrl)
  }

  // レコード取得
  async getRecord<T>(sobjectType: string, id: string, fields?: string[]): Promise<T> {
    let endpoint = `/services/data/v58.0/sobjects/${sobjectType}/${id}`
    if (fields && fields.length > 0) {
      endpoint += `?fields=${fields.join(',')}`
    }
    return this.makeRequest<T>(endpoint)
  }

  // レコード作成
  async createRecord(sobjectType: string, data: Record<string, any>): Promise<{ id: string; success: boolean }> {
    const endpoint = `/services/data/v58.0/sobjects/${sobjectType}/`
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // レコード更新
  async updateRecord(sobjectType: string, id: string, data: Record<string, any>): Promise<void> {
    const endpoint = `/services/data/v58.0/sobjects/${sobjectType}/${id}`
    await this.makeRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // レコード削除
  async deleteRecord(sobjectType: string, id: string): Promise<void> {
    const endpoint = `/services/data/v58.0/sobjects/${sobjectType}/${id}`
    await this.makeRequest(endpoint, {
      method: 'DELETE',
    })
  }

  // Account関連メソッド
  async getAccounts(limit = 50, offset = 0): Promise<SalesforceQueryResponse<Account>> {
    const soql = `
      SELECT Id, Name, Type, Industry, Phone, Website, 
             BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry,
             Description, NumberOfEmployees, AnnualRevenue,
             CreatedDate, LastModifiedDate, CreatedById, LastModifiedById
      FROM Account 
      ORDER BY Name ASC 
      LIMIT ${limit} OFFSET ${offset}
    `
    return this.query<Account>(soql)
  }

  async getAccount(id: string): Promise<Account> {
    const fields = [
      'Id', 'Name', 'Type', 'Industry', 'Phone', 'Website',
      'BillingStreet', 'BillingCity', 'BillingState', 'BillingPostalCode', 'BillingCountry',
      'Description', 'NumberOfEmployees', 'AnnualRevenue',
      'CreatedDate', 'LastModifiedDate', 'CreatedById', 'LastModifiedById',
      'AgentSessionData__c' // Add the custom field here
    ]
    return this.getRecord<Account>('Account', id, fields)
  }

  async updateAccountAgentSession(accountId: string, sessionData: string): Promise<void> {
    const data = {
      AgentSessionData__c: sessionData,
    }
    await this.updateRecord('Account', accountId, data)
  }

  async searchAccounts(searchTerm: string, limit = 20, offset = 0): Promise<SalesforceQueryResponse<Account>> {
    const soql = `
      SELECT Id, Name, Type, Industry, Phone, Website
      FROM Account 
      WHERE Name LIKE '%${searchTerm}%' 
      ORDER BY Name ASC 
      LIMIT ${limit} OFFSET ${offset}
    `
    return this.query<Account>(soql)
  }

  async createAccount(data: Partial<Account>): Promise<{ id: string; success: boolean }> {
    return this.createRecord('Account', data)
  }

  // Contact関連メソッド
  async getContacts(limit = 50, offset = 0): Promise<SalesforceQueryResponse<Contact>> {
    const soql = `
      SELECT Id, FirstName, LastName, Name, AccountId, Account.Name, 
             Email, Phone, Title, Department, MobilePhone,
             MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry,
             CreatedDate, LastModifiedDate, CreatedById, LastModifiedById
      FROM Contact 
      ORDER BY LastName ASC, FirstName ASC 
      LIMIT ${limit} OFFSET ${offset}
    `
    return this.query<Contact>(soql)
  }

  async getContact(id: string): Promise<Contact> {
    const soql = `
      SELECT Id, FirstName, LastName, Name, AccountId, Account.Name, 
             Email, Phone, Title, Department, MobilePhone,
             MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry,
             CreatedDate, LastModifiedDate, CreatedById, LastModifiedById
      FROM Contact 
      WHERE Id = '${id}'
    `
    const result = await this.query<Contact>(soql)
    if (result.records.length === 0) {
      throw new Error(`Contact with ID ${id} not found`)
    }
    return result.records[0]
  }

  async getContactsByAccount(accountId: string): Promise<SalesforceQueryResponse<Contact>> {
    const soql = `
      SELECT Id, FirstName, LastName, Name, Email, Phone, Title, Department
      FROM Contact 
      WHERE AccountId = '${accountId}' 
      ORDER BY LastName ASC, FirstName ASC
    `
    return this.query<Contact>(soql)
  }

  async searchContacts(searchTerm: string, limit = 20, offset = 0): Promise<SalesforceQueryResponse<Contact>> {
    const soql = `
      SELECT Id, FirstName, LastName, Name, AccountId, Account.Name, 
             Email, Phone, Title, Department
      FROM Contact 
      WHERE Name LIKE '%${searchTerm}%' OR Email LIKE '%${searchTerm}%'
      ORDER BY LastName ASC, FirstName ASC 
      LIMIT ${limit} OFFSET ${offset}
    `
    return this.query<Contact>(soql)
  }

  async createContact(data: Partial<Contact>): Promise<{ id: string; success: boolean }> {
    return this.createRecord('Contact', data)
  }

  // Opportunity関連メソッド
  async getOpportunities(limit = 50, offset = 0): Promise<SalesforceQueryResponse<Opportunity>> {
    const soql = `
      SELECT Id, Name, AccountId, Account.Name, StageName, CloseDate, Amount, Probability,
             Type, LeadSource, Description, OwnerId, Owner.Name,
             CreatedDate, LastModifiedDate, CreatedById, LastModifiedById
      FROM Opportunity 
      ORDER BY CloseDate DESC 
      LIMIT ${limit} OFFSET ${offset}
    `
    return this.query<Opportunity>(soql)
  }

  async getOpportunity(id: string): Promise<Opportunity> {
    const soql = `
      SELECT Id, Name, AccountId, Account.Name, StageName, CloseDate, Amount, Probability,
             Type, LeadSource, Description, OwnerId, Owner.Name,
             CreatedDate, LastModifiedDate, CreatedById, LastModifiedById
      FROM Opportunity 
      WHERE Id = '${id}'
    `
    const result = await this.query<Opportunity>(soql)
    if (result.records.length === 0) {
      throw new Error(`Opportunity with ID ${id} not found`)
    }
    return result.records[0]
  }

  async getOpportunitiesByAccount(accountId: string): Promise<SalesforceQueryResponse<Opportunity>> {
    const soql = `
      SELECT Id, Name, StageName, CloseDate, Amount, Probability, OwnerId, Owner.Name
      FROM Opportunity 
      WHERE AccountId = '${accountId}' 
      ORDER BY CloseDate DESC
    `
    return this.query<Opportunity>(soql)
  }

  async searchOpportunities(searchTerm: string, limit = 20, offset = 0): Promise<SalesforceQueryResponse<Opportunity>> {
    const soql = `
      SELECT Id, Name, AccountId, Account.Name, StageName, CloseDate, Amount, Probability,
             OwnerId, Owner.Name
      FROM Opportunity 
      WHERE Name LIKE '%${searchTerm}%'
      ORDER BY CloseDate DESC 
      LIMIT ${limit} OFFSET ${offset}
    `
    return this.query<Opportunity>(soql)
  }

  async createOpportunity(data: Partial<Opportunity>): Promise<{ id: string; success: boolean }> {
    return this.createRecord('Opportunity', data)
  }

  // Activity関連メソッド（Task & Event）
  async getActivitiesByWhat(whatId: string): Promise<{
    tasks: SalesforceQueryResponse<Task>
    events: SalesforceQueryResponse<Event>
  }> {
    const taskSoql = `
      SELECT Id, Subject, Status, Priority, ActivityDate, WhatId, WhoId, 
             What.Name, What.Type, Who.Name, Who.Type, Description, OwnerId, Owner.Name,
             CreatedDate, LastModifiedDate
      FROM Task 
      WHERE WhatId = '${whatId}' 
      ORDER BY CreatedDate DESC
    `
    
    const eventSoql = `
      SELECT Id, Subject, StartDateTime, EndDateTime, WhatId, WhoId,
             What.Name, What.Type, Who.Name, Who.Type, Description, Location, OwnerId, Owner.Name,
             CreatedDate, LastModifiedDate
      FROM Event 
      WHERE WhatId = '${whatId}' 
      ORDER BY StartDateTime DESC
    `

    const [tasks, events] = await Promise.all([
      this.query<Task>(taskSoql),
      this.query<Event>(eventSoql)
    ])

    return { tasks, events }
  }

  async getActivitiesByWho(whoId: string): Promise<{
    tasks: SalesforceQueryResponse<Task>
    events: SalesforceQueryResponse<Event>
  }> {
    const taskSoql = `
      SELECT Id, Subject, Status, Priority, ActivityDate, WhatId, WhoId, 
             What.Name, What.Type, Who.Name, Who.Type, Description, OwnerId, Owner.Name,
             CreatedDate, LastModifiedDate
      FROM Task 
      WHERE WhoId = '${whoId}' 
      ORDER BY CreatedDate DESC
    `
    
    const eventSoql = `
      SELECT Id, Subject, StartDateTime, EndDateTime, WhatId, WhoId,
             What.Name, What.Type, Who.Name, Who.Type, Description, Location, OwnerId, Owner.Name,
             CreatedDate, LastModifiedDate
      FROM Event 
      WHERE WhoId = '${whoId}' 
      ORDER BY StartDateTime DESC
    `

    const [tasks, events] = await Promise.all([
      this.query<Task>(taskSoql),
      this.query<Event>(eventSoql)
    ])

    return { tasks, events }
  }

  // ユーザー権限の取得
  async getUserPermissions(): Promise<UserPermissions> {
    try {
      // 簡単なアプローチ: デフォルトで全権限を許可
      // 実際の権限管理が必要な場合は、Profile や PermissionSet を確認
      const permissions: UserPermissions = {
        accounts: { create: true, read: true, edit: true, delete: true },
        contacts: { create: true, read: true, edit: true, delete: true },
        opportunities: { create: true, read: true, edit: true, delete: true },
        activities: { create: true, read: true, edit: true, delete: true }
      }

      return permissions
    } catch (error) {
      console.warn('Failed to get user permissions, defaulting to read-only:', error)
      
      // エラーの場合は読み取り専用権限を返す
      return {
        accounts: { create: false, read: true, edit: false, delete: false },
        contacts: { create: false, read: true, edit: false, delete: false },
        opportunities: { create: false, read: true, edit: false, delete: false },
        activities: { create: false, read: true, edit: false, delete: false }
      }
    }
  }

  // picklist値の取得
  async getPicklistValues(sobjectType: string, fieldName: string): Promise<{label: string, value: string}[]> {
    const endpoint = `/services/data/v58.0/sobjects/${sobjectType}/describe`
    const describe = await this.makeRequest<any>(endpoint)
    
    const field = describe.fields.find((f: any) => f.name === fieldName)
    if (!field || !field.picklistValues) {
      return []
    }
    
    return field.picklistValues
      .filter((value: any) => value.active)
      .map((value: any) => ({
        label: value.label,
        value: value.value
      }))
  }

  // Activity作成メソッド
  async createTask(taskData: {
    Subject: string
    Description?: string
    ActivityDate: string
    Priority?: 'High' | 'Normal' | 'Low'
    Status?: 'Not Started' | 'In Progress' | 'Completed'
    WhatId?: string
    WhoId?: string
    OwnerId?: string
  }): Promise<{ id: string; success: boolean }> {
    const data = {
      Subject: taskData.Subject,
      Description: taskData.Description || '',
      ActivityDate: taskData.ActivityDate,
      Priority: taskData.Priority || 'Normal',
      Status: taskData.Status || 'Not Started',
      ...(taskData.WhatId && { WhatId: taskData.WhatId }),
      ...(taskData.WhoId && { WhoId: taskData.WhoId }),
      ...(taskData.OwnerId && { OwnerId: taskData.OwnerId })
    }
    
    return this.createRecord('Task', data)
  }

  async createEvent(eventData: {
    Subject: string
    Description?: string
    StartDateTime: string
    EndDateTime: string
    Location?: string
    WhatId?: string
    WhoId?: string
    OwnerId?: string
  }): Promise<{ id: string; success: boolean }> {
    const data = {
      Subject: eventData.Subject,
      Description: eventData.Description || '',
      StartDateTime: eventData.StartDateTime,
      EndDateTime: eventData.EndDateTime,
      Location: eventData.Location || '',
      ...(eventData.WhatId && { WhatId: eventData.WhatId }),
      ...(eventData.WhoId && { WhoId: eventData.WhoId }),
      ...(eventData.OwnerId && { OwnerId: eventData.OwnerId })
    }
    
    return this.createRecord('Event', data)
  }

  async createActivity(activityType: 'Task' | 'Event', activityData: any): Promise<{ id: string; success: boolean }> {
    if (activityType === 'Task') {
      return this.createTask(activityData)
    } else {
      return this.createEvent(activityData)
    }
  }

  // 簡易メソッドエイリアス
  async create(sobjectType: string, data: Record<string, any>): Promise<{ id: string; success: boolean }> {
    return this.createRecord(sobjectType, data)
  }

  async update(sobjectType: string, id: string, data: Record<string, any>): Promise<void> {
    return this.updateRecord(sobjectType, id, data)
  }

  async delete(sobjectType: string, id: string): Promise<void> {
    return this.deleteRecord(sobjectType, id)
  }
}

// セッションから Salesforce クライアントを作成する関数
export function salesforceClient(session: any): SalesforceClient {
  if (!session?.instanceUrl || !session?.accessToken) {
    throw new Error('Invalid session: Missing instanceUrl or accessToken')
  }
  return new SalesforceClient(session.instanceUrl, session.accessToken)
}