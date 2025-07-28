import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/api/agent/auth';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const agentId = process.env.SALESFORCE_AGENT_ID;
    const myDomainUrl = process.env.SALESFORCE_MY_DOMAIN_URL;
    const environment = process.env.SALESFORCE_ENVIRONMENT || 'production';
    
    if (!agentId || !myDomainUrl) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
        { status: 500 }
      );
    }

    // Get access token
    const tokenData = await getAccessToken();
    
    // Determine base URL based on environment
    const baseUrl = environment === 'sandbox' 
      ? 'https://test.salesforce.com'
      : 'https://api.salesforce.com';
    
    const endpoint = `${baseUrl}/einstein/ai-agent/v1/agents/${agentId}/sessions`;
    
    // Parse request body if provided, otherwise use defaults
    const body = await request.json().catch(() => ({}));
    
    const requestBody = {
      externalSessionKey: body.externalSessionKey || randomUUID(),
      instanceConfig: {
        endpoint: `https://${myDomainUrl}`
      },
      streamingCapabilities: {
        chunkTypes: body.streamingCapabilities?.chunkTypes || ['Text']
      },
      bypassUser: body.bypassUser !== undefined ? body.bypassUser : true,
      variables: body.variables || [
        {
          name: '$Context.EndUserLanguage',
          type: 'Text',
          value: 'en_US'
        },
        {
          name: 'team_descriptor',
          type: 'Text',
          value: 'The Greatest Team'
        }
      ]
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
        { error: 'Failed to start session', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Start session error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}