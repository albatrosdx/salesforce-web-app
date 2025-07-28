export interface TokenResponse {
  access_token: string;
  instance_url: string;
  id: string;
  token_type: string;
  issued_at: string;
  signature: string;
}

export async function getAccessToken(): Promise<TokenResponse> {
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
  const domain = process.env.SALESFORCE_DOMAIN;

  if (!clientId || !clientSecret || !domain) {
    throw new Error('Missing required environment variables');
  }

  const tokenUrl = `https://${domain}/services/oauth2/token`;
  
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to obtain access token: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  
  return {
    access_token: data.access_token,
    instance_url: data.instance_url,
    id: data.id,
    token_type: data.token_type,
    issued_at: data.issued_at,
    signature: data.signature
  };
}