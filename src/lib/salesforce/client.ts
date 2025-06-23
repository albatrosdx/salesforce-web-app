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
      'CreatedDate', 'LastModifiedDate', 'CreatedById', 'LastModifiedById'
    ]
    return this.getRecord<Account>('Account', id, fields)
  }

  async searchAccounts(searchTerm: string, limit = 20): Promise<SalesforceQueryResponse<Account>> {
    const soql = `
      SELECT Id, Name, Type, Industry, Phone, Website
      FROM Account 
      WHERE Name LIKE '%${searchTerm}%' 
      ORDER BY Name ASC 
      LIMIT ${limit}
    `
    return this.query<Account>(soql)
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

  async searchContacts(searchTerm: string, limit = 20): Promise<SalesforceQueryResponse<Contact>> {
    const soql = `
      SELECT Id, FirstName, LastName, Name, AccountId, Account.Name, 
             Email, Phone, Title, Department
      FROM Contact 
      WHERE Name LIKE '%${searchTerm}%' OR Email LIKE '%${searchTerm}%'
      ORDER BY LastName ASC, FirstName ASC 
      LIMIT ${limit}
    `
    return this.query<Contact>(soql)
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

  async searchOpportunities(searchTerm: string, limit = 20): Promise<SalesforceQueryResponse<Opportunity>> {
    const soql = `
      SELECT Id, Name, AccountId, Account.Name, StageName, CloseDate, Amount, Probability,
             OwnerId, Owner.Name
      FROM Opportunity 
      WHERE Name LIKE '%${searchTerm}%'
      ORDER BY CloseDate DESC 
      LIMIT ${limit}
    `
    return this.query<Opportunity>(soql)
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
    // オブジェクト権限を確認するSOQLクエリ
    const permissionSoql = `
      SELECT SobjectType, PermissionsCreate, PermissionsRead, PermissionsEdit, PermissionsDelete
      FROM ObjectPermissions 
      WHERE ParentId IN (
        SELECT PermissionSetId FROM PermissionSetAssignment WHERE AssigneeId = UserInfo.getUserId()
      )
      AND SobjectType IN ('Account', 'Contact', 'Opportunity', 'Task', 'Event')
    `

    try {
      const result = await this.query<{
        SobjectType: string
        PermissionsCreate: boolean
        PermissionsRead: boolean
        PermissionsEdit: boolean
        PermissionsDelete: boolean
      }>(permissionSoql)

      const permissions: UserPermissions = {
        accounts: { create: false, read: false, edit: false, delete: false },
        contacts: { create: false, read: false, edit: false, delete: false },
        opportunities: { create: false, read: false, edit: false, delete: false },
        activities: { create: false, read: false, edit: false, delete: false }
      }

      // 権限情報を集約
      result.records.forEach(perm => {
        switch (perm.SobjectType) {
          case 'Account':
            permissions.accounts.create = permissions.accounts.create || perm.PermissionsCreate
            permissions.accounts.read = permissions.accounts.read || perm.PermissionsRead
            permissions.accounts.edit = permissions.accounts.edit || perm.PermissionsEdit
            permissions.accounts.delete = permissions.accounts.delete || perm.PermissionsDelete
            break
          case 'Contact':
            permissions.contacts.create = permissions.contacts.create || perm.PermissionsCreate
            permissions.contacts.read = permissions.contacts.read || perm.PermissionsRead
            permissions.contacts.edit = permissions.contacts.edit || perm.PermissionsEdit
            permissions.contacts.delete = permissions.contacts.delete || perm.PermissionsDelete
            break
          case 'Opportunity':
            permissions.opportunities.create = permissions.opportunities.create || perm.PermissionsCreate
            permissions.opportunities.read = permissions.opportunities.read || perm.PermissionsRead
            permissions.opportunities.edit = permissions.opportunities.edit || perm.PermissionsEdit
            permissions.opportunities.delete = permissions.opportunities.delete || perm.PermissionsDelete
            break
          case 'Task':
          case 'Event':
            permissions.activities.create = permissions.activities.create || perm.PermissionsCreate
            permissions.activities.read = permissions.activities.read || perm.PermissionsRead
            permissions.activities.edit = permissions.activities.edit || perm.PermissionsEdit
            permissions.activities.delete = permissions.activities.delete || perm.PermissionsDelete
            break
        }
      })

      return permissions
    } catch (error) {
      console.warn('Failed to get user permissions:', error)
      // デフォルトで読み取り権限のみを返す
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
}