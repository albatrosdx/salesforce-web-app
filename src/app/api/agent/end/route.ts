import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/api/agent/auth';

export async function DELETE(request: NextRequest) {
  try {
    const environment = process.env.SALESFORCE_ENVIRONMENT || 'production';
    
    // Extract session ID from URL or body
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get access token
    const tokenData = await getAccessToken();
    
    // Determine base URL based on environment
    const baseUrl = environment === 'sandbox' 
      ? 'https://test.salesforce.com'
      : 'https://api.salesforce.com';
    
    const endpoint = `${baseUrl}/einstein/ai-agent/v1/sessions/${sessionId}`;
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'x-session-end-reason': 'UserRequest',
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: 'Failed to end session', details: errorData },
        { status: response.status }
      );
    }

    // DELETE request might return empty response
    if (response.status === 204) {
      return NextResponse.json({ success: true, message: 'Session ended successfully' });
    }
    
    const data = await response.json().catch(() => ({ success: true }));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('End session error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}