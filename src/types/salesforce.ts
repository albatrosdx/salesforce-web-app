// Salesforce共通型定義
export interface SalesforceRecord {
  Id: string
  CreatedDate: string
  LastModifiedDate: string
  CreatedById: string
  LastModifiedById: string
}

// 取引先（Account）
export interface Account extends SalesforceRecord {
  Name: string
  Type?: string
  Industry?: string
  Phone?: string
  Website?: string
  BillingAddress?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  Description?: string
  NumberOfEmployees?: number
  AnnualRevenue?: number
}

// 取引先責任者（Contact）
export interface Contact extends SalesforceRecord {
  FirstName?: string
  LastName: string
  Name: string
  AccountId?: string
  Account?: {
    Name: string
  }
  Email?: string
  Phone?: string
  Title?: string
  Department?: string
  MobilePhone?: string
  MailingStreet?: string
  MailingCity?: string
  MailingState?: string
  MailingPostalCode?: string
  MailingCountry?: string
}

// 商談（Opportunity）
export interface Opportunity extends SalesforceRecord {
  Name: string
  AccountId?: string
  Account?: {
    Name: string
  }
  StageName: string
  CloseDate: string
  Amount?: number
  Probability?: number
  Type?: string
  LeadSource?: string
  Description?: string
  OwnerId: string
  Owner?: {
    Name: string
  }
}

// 活動（Task）
export interface Task extends SalesforceRecord {
  Subject: string
  Status: string
  Priority?: string
  ActivityDate?: string
  WhatId?: string // Account、Opportunity等のID
  WhoId?: string // Contact、Lead等のID
  What?: {
    Name: string
    Type: string
  }
  Who?: {
    Name: string
    Type: string
  }
  Description?: string
  OwnerId: string
  Owner?: {
    Name: string
  }
}

// イベント（Event）
export interface Event extends SalesforceRecord {
  Subject: string
  StartDateTime: string
  EndDateTime: string
  WhatId?: string
  WhoId?: string
  What?: {
    Name: string
    Type: string
  }
  Who?: {
    Name: string
    Type: string
  }
  Description?: string
  Location?: string
  OwnerId: string
  Owner?: {
    Name: string
  }
}

// API レスポンス型
export interface SalesforceQueryResponse<T> {
  totalSize: number
  done: boolean
  records: T[]
  nextRecordsUrl?: string
}

// 権限情報
export interface UserPermissions {
  accounts: {
    create: boolean
    read: boolean
    edit: boolean
    delete: boolean
  }
  contacts: {
    create: boolean
    read: boolean
    edit: boolean
    delete: boolean
  }
  opportunities: {
    create: boolean
    read: boolean
    edit: boolean
    delete: boolean
  }
  activities: {
    create: boolean
    read: boolean
    edit: boolean
    delete: boolean
  }
}

// 認証関連
export interface SalesforceAuthResponse {
  access_token: string
  refresh_token?: string
  instance_url: string
  id: string
  token_type: string
  issued_at: string
  signature: string
}

export interface UserInfo {
  id: string
  username: string
  email: string
  name: string
  profile: {
    name: string
  }
  organization: {
    name: string
    id: string
  }
}