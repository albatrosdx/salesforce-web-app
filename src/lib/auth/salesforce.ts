import { SalesforceAuthResponse, UserInfo } from '@/types'

export class SalesforceAuth {
  private instanceUrl: string
  private clientId: string
  private clientSecret: string
  private redirectUri: string

  constructor() {
    this.instanceUrl = process.env.SALESFORCE_INSTANCE_URL || ''
    this.clientId = process.env.SALESFORCE_CLIENT_ID || ''
    this.clientSecret = process.env.SALESFORCE_CLIENT_SECRET || ''
    this.redirectUri = process.env.SALESFORCE_REDIRECT_URI || ''
  }

  // SP-initiated SAML認証URLの生成
  generateAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'api refresh_token offline_access',
      ...(state && { state })
    })

    return `${this.instanceUrl}/services/oauth2/authorize?${params.toString()}`
  }

  // 認証コードからアクセストークンを取得
  async exchangeCodeForToken(code: string): Promise<SalesforceAuthResponse> {
    const response = await fetch(`${this.instanceUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token exchange failed: ${error}`)
    }

    return response.json()
  }

  // リフレッシュトークンを使用してアクセストークンを更新
  async refreshToken(refreshToken: string): Promise<SalesforceAuthResponse> {
    const response = await fetch(`${this.instanceUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token refresh failed: ${error}`)
    }

    return response.json()
  }

  // ユーザー情報の取得
  async getUserInfo(accessToken: string, identityUrl: string): Promise<UserInfo> {
    const response = await fetch(identityUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get user info: ${error}`)
    }

    return response.json()
  }

  // トークンの有効性チェック
  async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.instanceUrl}/services/oauth2/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }

  // ログアウト
  async revokeToken(token: string): Promise<void> {
    await fetch(`${this.instanceUrl}/services/oauth2/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token,
      }),
    })
  }
}