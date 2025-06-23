import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/config'

const handler = NextAuth(authOptions)

// Add error handling wrapper
const wrappedHandler = async (req: Request, context: any) => {
  try {
    return await handler(req, context)
  } catch (error) {
    console.error('NextAuth API route error:', error)
    
    // Return a proper JSON error response
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

export { wrappedHandler as GET, wrappedHandler as POST }