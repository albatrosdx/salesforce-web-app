import { NextAuthOptions } from 'next-auth'

// Environment variable validation
const validateEnvVars = () => {
  const required = {
    SALESFORCE_INSTANCE_URL: process.env.SALESFORCE_INSTANCE_URL?.trim(),
    SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID?.trim(),
    SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET?.trim(),
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET?.trim(),
  }

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all Salesforce credentials are properly configured.'
    )
  }

  // Additional URL validation for SALESFORCE_INSTANCE_URL
  if (required.SALESFORCE_INSTANCE_URL) {
    try {
      new URL(required.SALESFORCE_INSTANCE_URL)
    } catch {
      throw new Error(
        `Invalid SALESFORCE_INSTANCE_URL: ${required.SALESFORCE_INSTANCE_URL}\n` +
        'Please ensure the URL is properly formatted (e.g., https://your-domain.my.salesforce.com)'
      )
    }
  }

  return required
}

const env = validateEnvVars()

// Helper function to construct Salesforce URLs safely
const getSalesforceUrl = (path: string): string => {
  const baseUrl = env.SALESFORCE_INSTANCE_URL!.replace(/\/+$/, '') // Remove trailing slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

export const authOptions: NextAuthOptions = {
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
      if (account && profile) {
        token.accessToken = account.access_token || ''
        token.refreshToken = account.refresh_token || ''
        token.instanceUrl = (account.instance_url as string) || ''
        token.userId = (profile as any).user_id || ''
        token.organizationId = (profile as any).organization_id || ''
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.instanceUrl = token.instanceUrl as string
      session.userId = token.userId as string
      session.organizationId = token.organizationId as string
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
}

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
  }
}