import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

export async function GET(request: NextRequest) {
  try {
    console.log('=== NextAuth Debug Endpoint ===')
    
    // Check environment variables
    const envVars = {
      SALESFORCE_INSTANCE_URL: !!process.env.SALESFORCE_INSTANCE_URL,
      SALESFORCE_CLIENT_ID: !!process.env.SALESFORCE_CLIENT_ID,
      SALESFORCE_CLIENT_SECRET: !!process.env.SALESFORCE_CLIENT_SECRET,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_URL: process.env.VERCEL_URL,
    }
    
    console.log('Environment variables:', envVars)
    
    // Try to get session
    let session = null
    let sessionError = null
    
    try {
      session = await getServerSession(authOptions)
      console.log('Session retrieved successfully:', !!session)
    } catch (error) {
      sessionError = error instanceof Error ? error.message : 'Unknown session error'
      console.error('Session error:', error)
    }
    
    // Try to validate auth options
    let authConfigError = null
    try {
      // Test if authOptions can be accessed
      const hasProviders = Array.isArray(authOptions.providers) && authOptions.providers.length > 0
      console.log('Auth config has providers:', hasProviders)
    } catch (error) {
      authConfigError = error instanceof Error ? error.message : 'Unknown auth config error'
      console.error('Auth config error:', error)
    }
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: envVars,
      session: {
        exists: !!session,
        error: sessionError,
      },
      authConfig: {
        error: authConfigError,
      },
      requestHeaders: {
        'user-agent': request.headers.get('user-agent'),
        'host': request.headers.get('host'),
        'referer': request.headers.get('referer'),
      }
    }
    
    console.log('Debug info:', debugInfo)
    
    return NextResponse.json(debugInfo, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
    
  } catch (error) {
    console.error('Debug endpoint error:', error)
    
    return NextResponse.json({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  }
}