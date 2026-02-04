import { test, expect, APIRequestContext } from '@playwright/test';
import { getAccessToken } from './helpers/getAccessToken';
import { getEncodedEmail } from './helpers/emailHelper';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const TOKEN_PATH = path.resolve('.auth/token.json');

test.describe('GMAIL API test', () => {
  test('Login - OAuth User', async ({ request }) => {
    const response = await request.post(
      'https://oauth2.googleapis.com/token',
      {
        form: {
          client_id: process.env.GMAIL_CLIENT_ID!,
          client_secret: process.env.GMAIL_CLIENT_SECRET!,
          code: process.env.GMAIL_AUTH_CODE!,
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost'
        }
      }
    );

    expect(response.ok()).toBeTruthy();

    const data = await response.json();

    expect(data.refresh_token).toBeTruthy();

    fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });

    fs.writeFileSync(
      TOKEN_PATH,
      JSON.stringify(
        {
          refresh_token: data.refresh_token,
          scope: data.scope,
          created_at: new Date().toISOString()
        },
        null,
        2
      )
    );

    console.log('Refresh token uložený do', TOKEN_PATH);
  });

  test('Send Email to Recipient', async ({ request }) => {
    const accessToken = await getAccessToken(request);
    const encodedEmail = await getEncodedEmail()
    
    const response = await request.post(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          raw: encodedEmail
        }
      }
    );

    console.log('Status:', response.status());
    console.log(await response.json());

    expect(response.status()).toBe(200);
    const sentData = await response.json();
    const messageId = sentData.id

    const verifyResponse = await request.get(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(verifyResponse.status()).toBe(200);

    const verifyData = await verifyResponse.json();
    expect(verifyData.labelIds).toContain('SENT');

    console.log('Email verified in SENT');

  });

  test('OAuth logout - revoke access token', async ({ request }) => {
    const accessToken = await getAccessToken(request);
    const response = await request.post(
      `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    expect(response.status()).toBe(200);
    console.log('Status:', response.status());
    console.log(await response.json());
  });
});