import { NextAuthOptions } from 'next-auth'
import { SalesforceAuth } from './salesforce'

const salesforceAuth = new SalesforceAuth()

// Environment variable validation
const validateEnvVars = () => {
  const required = {
    SALESFORCE_INSTANCE_URL: process.env.SALESFORCE_INSTANCE_URL,
    SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID,
    SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all Salesforce credentials are properly configured.'
    )
  }

  return required
}

const env = validateEnvVars()

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'salesforce',
      name: 'Salesforce',
      type: 'oauth',
      authorization: {
        url: `${env.SALESFORCE_INSTANCE_URL}/services/oauth2/authorize`,
        params: {
          scope: 'api refresh_token offline_access',
          response_type: 'code',
        },
      },
      token: `${env.SALESFORCE_INSTANCE_URL}/services/oauth2/token`,
      userinfo: `${env.SALESFORCE_INSTANCE_URL}/services/oauth2/userinfo`,
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