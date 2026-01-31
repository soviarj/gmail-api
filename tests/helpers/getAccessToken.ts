import { APIRequestContext } from '@playwright/test';
import { getRefreshToken } from './tokenHelper';

export async function getAccessToken(request: APIRequestContext): Promise<string> {
    const response = await request.post(
    'https://oauth2.googleapis.com/token',
    {
        form: {
        client_id: process.env.GMAIL_CLIENT_ID!,
            client_secret: process.env.GMAIL_CLIENT_SECRET!,
            refresh_token: getRefreshToken(),
            grant_type: 'refresh_token'
        }
    }
    );

    const data = await response.json();
    return data.access_token;
}