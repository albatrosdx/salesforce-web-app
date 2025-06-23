import { ApiError } from '@/types'

export class SalesforceApiError extends Error {
  public statusCode: number
  public salesforceErrors: ApiError[]

  constructor(message: string, statusCode: number, salesforceErrors: ApiError[] = []) {
    super(message)
    this.name = 'SalesforceApiError'
    this.statusCode = statusCode
    this.salesforceErrors = salesforceErrors
  }

  static fromResponse(status: number, responseBody: unknown): SalesforceApiError {
    let message = `Salesforce API Error: ${status}`
    let errors: ApiError[] = []

    try {
      if (Array.isArray(responseBody)) {
        errors = responseBody.map((error: any) => ({
          message: error.message || 'Unknown error',
          errorCode: error.errorCode,
          fields: error.fields || []
        }))
        message = errors.map(e => e.message).join(', ')
      } else if (responseBody && typeof responseBody === 'object' && 'message' in responseBody) {
        message = String(responseBody.message)
        errors = [{ message: String(responseBody.message) }]
      } else if (typeof responseBody === 'string') {
        message = responseBody
        errors = [{ message: responseBody }]
      }
    } catch {
      message = `Failed to parse error response: ${status}`
      errors = [{ message }]
    }

    return new SalesforceApiError(message, status, errors)
  }
}

export function handleSalesforceError(error: unknown): string {
  if (error instanceof SalesforceApiError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unknown error occurred'
}

export function isSalesforceApiError(error: unknown): error is SalesforceApiError {
  return error instanceof SalesforceApiError
}

// 再試行可能なエラーかどうかを判定
export function isRetryableError(error: unknown): boolean {
  if (error instanceof SalesforceApiError) {
    // 500系エラーや一時的なネットワークエラーは再試行可能
    return error.statusCode >= 500 || error.statusCode === 429
  }
  
  return false
}

// 認証エラーかどうかを判定
export function isAuthenticationError(error: unknown): boolean {
  if (error instanceof SalesforceApiError) {
    return error.statusCode === 401
  }
  
  return false
}

// アクセス権限エラーかどうかを判定
export function isPermissionError(error: unknown): boolean {
  if (error instanceof SalesforceApiError) {
    return error.statusCode === 403
  }
  
  return false
}