import { NextAuthOptions } from 'next-auth'
import { SalesforceAuth } from './salesforce'

const salesforceAuth = new SalesforceAuth()

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'salesforce',
      name: 'Salesforce',
      type: 'oauth',
      authorization: {
        url: `${process.env.SALESFORCE_INSTANCE_URL}/services/oauth2/authorize`,
        params: {
          scope: 'api refresh_token offline_access',
          response_type: 'code',
        },
      },
      token: `${process.env.SALESFORCE_INSTANCE_URL}/services/oauth2/token`,
      userinfo: `${process.env.SALESFORCE_INSTANCE_URL}/services/oauth2/userinfo`,
      clientId: process.env.SALESFORCE_CLIENT_ID,
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
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