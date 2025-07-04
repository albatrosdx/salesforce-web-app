import { NextAuthOptions } from 'next-auth'

declare global {
  var __nextauth_config_logged: boolean | undefined
  var __nextauth_env_logged: boolean | undefined
}

// Environment variable validation with better error handling
const validateEnvVars = () => {
  try {
    const required = {
      SALESFORCE_INSTANCE_URL: process.env.SALESFORCE_INSTANCE_URL?.trim(),
      SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID?.trim(),
      SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET?.trim(),
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET?.trim(),
      NEXTAUTH_URL: process.env.NEXTAUTH_URL?.trim(),
    }

    const missing = Object.entries(required)
      .filter(([, value]) => !value)
      .map(([key]) => key)

    // Log environment state for debugging only once
    if (!global.__nextauth_env_logged) {
      console.log('=== Environment Variables Check ===')
      console.log('NODE_ENV:', process.env.NODE_ENV)
      console.log('Available environment variables:', Object.keys(process.env).filter(k => k.startsWith('SALESFORCE_') || k.startsWith('NEXTAUTH_')))
      global.__nextauth_env_logged = true
    }
    
    if (missing.length > 0) {
      const errorMsg = `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your environment variables and ensure all credentials are properly configured.\n' +
        `Current environment: ${process.env.NODE_ENV}\n` +
        `Available vars: ${Object.keys(process.env).filter(k => k.startsWith('SALESFORCE_') || k.startsWith('NEXTAUTH_')).join(', ')}`
      console.error(errorMsg)
      
      // In development, provide fallback values to prevent complete failure
      if (process.env.NODE_ENV === 'development') {
        console.warn('Development mode: Using fallback values for missing variables')
        return {
          SALESFORCE_INSTANCE_URL: required.SALESFORCE_INSTANCE_URL || 'https://fallback.salesforce.com',
          SALESFORCE_CLIENT_ID: required.SALESFORCE_CLIENT_ID || 'fallback_client_id',
          SALESFORCE_CLIENT_SECRET: required.SALESFORCE_CLIENT_SECRET || 'fallback_client_secret',
          NEXTAUTH_SECRET: required.NEXTAUTH_SECRET || 'fallback_secret_for_development_only',
          NEXTAUTH_URL: required.NEXTAUTH_URL || 'http://localhost:3000',
        }
      }
      
      throw new Error(errorMsg)
    }

    // Additional URL validation for SALESFORCE_INSTANCE_URL
    if (required.SALESFORCE_INSTANCE_URL && required.SALESFORCE_INSTANCE_URL !== 'https://fallback.salesforce.com') {
      try {
        new URL(required.SALESFORCE_INSTANCE_URL)
      } catch {
        console.error(`Invalid SALESFORCE_INSTANCE_URL: ${required.SALESFORCE_INSTANCE_URL}`)
        if (process.env.NODE_ENV !== 'development') {
          throw new Error(
            `Invalid SALESFORCE_INSTANCE_URL: ${required.SALESFORCE_INSTANCE_URL}\n` +
            'Please ensure the URL is properly formatted (e.g., https://your-domain.my.salesforce.com)'
          )
        }
      }
    }

    // Additional URL validation for NEXTAUTH_URL and remove trailing slash
    if (required.NEXTAUTH_URL && required.NEXTAUTH_URL !== 'http://localhost:3000') {
      try {
        // Remove trailing slash for consistency
        required.NEXTAUTH_URL = required.NEXTAUTH_URL.replace(/\/$/, '')
        new URL(required.NEXTAUTH_URL)
      } catch {
        console.error(`Invalid NEXTAUTH_URL: ${required.NEXTAUTH_URL}`)
        if (process.env.NODE_ENV !== 'development') {
          throw new Error(
            `Invalid NEXTAUTH_URL: ${required.NEXTAUTH_URL}\n` +
            'Please ensure the URL is properly formatted (e.g., https://your-app.vercel.app)'
          )
        }
      }
    }

    // Log configuration once for debugging
    if (process.env.NODE_ENV === 'production' && !global.__nextauth_config_logged) {
      console.log('NextAuth Configuration:')
      console.log('- SALESFORCE_INSTANCE_URL:', required.SALESFORCE_INSTANCE_URL?.substring(0, 30) + '...')
      console.log('- NEXTAUTH_URL:', required.NEXTAUTH_URL)
      console.log('- CLIENT_ID configured:', !!required.SALESFORCE_CLIENT_ID)
      console.log('- CLIENT_SECRET configured:', !!required.SALESFORCE_CLIENT_SECRET)
      console.log('- NEXTAUTH_SECRET configured:', !!required.NEXTAUTH_SECRET)
      global.__nextauth_config_logged = true
    }

    return required
  } catch (error) {
    console.error('Environment validation failed:', error)
    throw error
  }
}

// Safe environment validation
let env: ReturnType<typeof validateEnvVars>
try {
  env = validateEnvVars()
  if (!global.__nextauth_config_logged) {
    console.log('✅ Environment variables validated successfully')
  }
} catch (error) {
  console.error('❌ Environment validation failed:', error)
  throw error
}

// Helper function to construct Salesforce URLs safely
const getSalesforceUrl = (path: string): string => {
  try {
    const baseUrl = env.SALESFORCE_INSTANCE_URL!.replace(/\/+$/, '') // Remove trailing slashes
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${cleanPath}`
  } catch (error) {
    console.error('Failed to construct Salesforce URL:', error)
    throw new Error(`Failed to construct Salesforce URL for path: ${path}`)
  }
}

// Safe authOptions creation
export const authOptions: NextAuthOptions = (() => {
  try {
    if (!global.__nextauth_config_logged) {
      console.log('🔧 Creating NextAuth configuration...')
    }
    return {
  providers: [
    {
      id: 'salesforce',
      name: 'Salesforce',
      type: 'oauth',
      authorization: {
        url: getSalesforceUrl('/services/oauth2/authorize'),
        params: {
          scope: 'api refresh_token offline_access',
          response_type: 'code',
        },
      },
      token: getSalesforceUrl('/services/oauth2/token'),
      userinfo: getSalesforceUrl('/services/oauth2/userinfo'),
      checks: ['state'],
      clientId: env.SALESFORCE_CLIENT_ID!,
      clientSecret: env.SALESFORCE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.user_id,
          name: profile.name,
          email: profile.email,
          image: profile.photos?.picture || null,
          organizationId: profile.organization_id,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      try {
        // 初回ログイン時
        if (account && profile) {
          token.accessToken = account.access_token || ''
          token.refreshToken = account.refresh_token || ''
          token.instanceUrl = (account.instance_url as string) || ''
          token.userId = (profile as Record<string, unknown>).user_id as string || ''
          token.organizationId = (profile as Record<string, unknown>).organization_id as string || ''
          token.expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + 60 * 60 * 1000
          
          // Debug logging in development
          if (process.env.NODE_ENV === 'development') {
            console.log('JWT callback - account:', { ...account, access_token: '[REDACTED]' })
            console.log('JWT callback - profile:', profile)
          }
        }
        
        // トークンの有効期限をチェック
        if (Date.now() < (token.expiresAt as number)) {
          return token
        }
        
        // リフレッシュトークンを使用してアクセストークンを更新
        if (!token.refreshToken) {
          throw new Error('No refresh token available')
        }
        
        const response = await fetch(getSalesforceUrl('/services/oauth2/token'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken as string,
            client_id: env.SALESFORCE_CLIENT_ID!,
            client_secret: env.SALESFORCE_CLIENT_SECRET!,
          }),
        })
        
        if (!response.ok) {
          const error = await response.text()
          console.error('Failed to refresh token:', error)
          throw new Error('Token refresh failed')
        }
        
        const refreshedTokens = await response.json()
        
        return {
          ...token,
          accessToken: refreshedTokens.access_token,
          expiresAt: Date.now() + 60 * 60 * 1000, // 1時間後
        }
      } catch (error) {
        console.error('JWT callback error:', error)
        // リフレッシュに失敗した場合はトークンをクリア
        return {
          ...token,
          error: 'RefreshAccessTokenError',
        }
      }
    },
    async session({ session, token }) {
      try {
        // トークンエラーがある場合はnullを返してサインアウト
        if (token.error === 'RefreshAccessTokenError') {
          return null as any
        }
        
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.instanceUrl = token.instanceUrl as string
        session.userId = token.userId as string
        session.organizationId = token.organizationId as string
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        return session
      }
    },
    async signIn({ user, account, profile }) {
      try {
        // Debug logging
        if (process.env.NODE_ENV === 'development') {
          console.log('Sign in callback - user:', user)
          console.log('Sign in callback - account:', { ...account, access_token: '[REDACTED]' })
          console.log('Sign in callback - profile:', profile)
        }
        return true
      } catch (error) {
        console.error('Sign in callback error:', error)
        return false
      }
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development' || process.env.NEXTAUTH_DEBUG === 'true',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata)
    },
    warn(code) {
      console.warn('NextAuth Warning:', code)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development' || process.env.NEXTAUTH_DEBUG === 'true') {
        console.log('NextAuth Debug:', code, metadata)
      }
    },
  },
}
  } catch (error) {
    console.error('❌ Failed to create NextAuth configuration:', error)
    throw new Error(`NextAuth configuration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
})()

// セッション型の拡張
declare module 'next-auth' {
  interface Session {
    accessToken: string
    refreshToken: string
    instanceUrl: string
    userId: string
    organizationId: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    refreshToken: string
    instanceUrl: string
    userId: string
    organizationId: string
    expiresAt?: number
    error?: string
  }
}