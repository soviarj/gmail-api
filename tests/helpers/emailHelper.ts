import { readFile } from 'fs/promises';
import path from 'path';

const emailRecipient = 'juro86@gmail.com';

function encodeEmail(email: string): string {
  return Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function buildEmail(): Promise<string> {
  const bodyPath = path.resolve(__dirname, 'emailBody.txt');
  const emailBody = await readFile(bodyPath, 'utf-8');

  return (
    'From: "Playwright Tester" <me@gmail.com>\r\n' +
    `To: ${emailRecipient}\r\n` +
    'Subject: Playwright test email\r\n' +
    'Content-Type: text/plain; charset=UTF-8\r\n' +
    '\r\n' +
    emailBody
  );
}

export async function getEncodedEmail(): Promise<string> {
  const email = await buildEmail();
  return encodeEmail(email);
}