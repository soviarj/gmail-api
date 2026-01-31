import { test, expect, APIRequestContext } from '@playwright/test';
import { emailRecipient } from './constants';

test('Send Email to Recipient', async ({ request }) => {
  
  async function getAccessToken(request: APIRequestContext): Promise<string> {
    const response = await request.post(
      'https://oauth2.googleapis.com/token',
      {
        form: {
          client_id: process.env.GMAIL_CLIENT_ID!,
            client_secret: process.env.GMAIL_CLIENT_SECRET!,
            refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
            grant_type: 'refresh_token'
        }
      }
    );

    const data = await response.json();
    console.log(data)
    return data.access_token;
}

function encodeEmail(email: string): string {
  return Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const accessToken = await getAccessToken(request);
console.log('token:', accessToken)
const email = 
  'From: "Playwright Tester" <me@gmail.com>\r\n' +
  `To: ${emailRecipient}\r\n` +
  'Subject: Playwright test email\r\n' +
  'Content-Type: text/plain; charset=UTF-8\r\n' +
  '\r\n' +
  'Ahoj,\r\n' +
  '\r\n' +
  'toto je testovací email odoslaný z Playwright testu.\r\n' +
  '\r\n' +
  'Prajem pekný deň!';

const encodedEmail = encodeEmail(email);

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

});

