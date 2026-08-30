import { sql } from './db';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function createSession(userId: number, ipAddress: string) {
  const sessionToken = uuidv4();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  await sql`
    INSERT INTO sessions (user_id, session_token, ip_address, expires_at)
    VALUES (${userId}, ${sessionToken}, ${ipAddress}, ${expiresAt})
  `;
  
  const cookieStore = cookies();
  cookieStore.set('session_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  
  return sessionToken;
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  
  if (!sessionToken) return null;
  
  const result = await sql`
    SELECT u.id, u.username, u.email, u.created_at 
    FROM users u
    JOIN sessions s ON u.id = s.user_id
    WHERE s.session_token = ${sessionToken}
    AND s.expires_at > NOW()
    LIMIT 1
  `;
  
  if (result.length === 0) return null;
  
  return result[0];
}

export async function destroySession() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  
  if (sessionToken) {
    await sql`DELETE FROM sessions WHERE session_token = ${sessionToken}`;
  }
  
  cookieStore.set('session_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

export async function logIP(userId: number | null, ipAddress: string, action: string, userAgent: string) {
  await sql`
    INSERT INTO ip_logs (user_id, ip_address, action, user_agent)
    VALUES (${userId}, ${ipAddress}, ${action}, ${userAgent})
  `;
}
