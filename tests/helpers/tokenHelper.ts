import fs from 'fs';
import path from 'path';

const TOKEN_PATH = path.resolve('.auth/token.json');

export function getRefreshToken(): string {
  const data = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

  if (!data.refresh_token) {
    throw new Error('refresh_token not found in token.json');
  }

  return data.refresh_token;
}
