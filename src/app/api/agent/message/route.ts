import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/api/agent/auth';

export async function POST(request: NextRequest) {
  try {
    const environment = process.env.SALESFORCE_ENVIRONMENT || 'production';
    
    // Extract session ID from request body
    
    // Get session ID from request body or headers
    const body = await request.json();
    const sessionId = body.sessionId;
    
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
    
    const endpoint = `${baseUrl}/einstein/ai-agent/v1/sessions/${sessionId}/messages`;
    
    const requestBody = {
      message: {
        sequenceId: body.sequenceId || 1,
        type: body.message?.type || 'Text',
        text: body.message?.text || body.text
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Failed to send message', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}