import { signOut } from 'next-auth/react'

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  private async handleResponse(response: Response) {
    if (response.status === 401) {
      // セッション切れの場合は自動的にサインアウト
      const data = await response.json().catch(() => ({}))
      if (data.code === 'SESSION_EXPIRED' || response.status === 401) {
        await signOut({ callbackUrl: '/auth/signin' })
        throw new Error('Session expired')
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async get(url: string) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return this.handleResponse(response)
  }

  async post(url: string, data: any) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async patch(url: string, data: any) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async delete(url: string) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return this.handleResponse(response)
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient()