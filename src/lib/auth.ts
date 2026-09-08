import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'planly_admin_session';
const SECRET = process.env.ADMIN_JWT_SECRET || 'super_secret_planly_admin_key_2026';

async function getHmac(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SECRET);
  const msgData = encoder.encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createAdminToken(username: string): Promise<string> {
  const data = `${username}:${Date.now()}`;
  const hmac = await getHmac(data);
  return btoa(`${data}:${hmac}`);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const decoded = atob(token);
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const [username, timestampStr, hmac] = parts;
    if (!username || !timestampStr || !hmac) return false;

    const expectedHmac = await getHmac(`${username}:${timestampStr}`);
    return hmac === expectedHmac;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export { ADMIN_COOKIE_NAME };

