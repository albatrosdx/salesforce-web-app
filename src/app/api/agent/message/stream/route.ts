import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/api/agent/auth';

export async function POST(request: NextRequest) {
  try {
    const environment = process.env.SALESFORCE_ENVIRONMENT || 'production';
    
    // Get request body
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
    
    const endpoint = `${baseUrl}/einstein/ai-agent/v1/sessions/${sessionId}/messages/stream`;
    
    const requestBody = {
      message: {
        sequenceId: body.sequenceId || 1,
        type: body.message?.type || 'Text',
        text: body.message?.text || body.text
      }
    };

    // Create a new TransformStream for SSE
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Make the streaming request
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'text/event-stream',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`
      },
      body: JSON.stringify(requestBody)
    })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'Failed to send streaming message', details: errorData })}\n\n`));
        await writer.close();
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'No response body' })}\n\n`));
        await writer.close();
        return;
      }

      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Forward the SSE data
        await writer.write(value);
      }
      
      await writer.close();
    })
    .catch(async (error) => {
      console.error('Streaming error:', error);
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'Streaming error', message: error.message })}\n\n`));
      await writer.close();
    });

    // Return the streaming response
    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Send streaming message error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}