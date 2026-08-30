import { sql } from './db';

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOTP(userId: number): Promise<string> {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  await sql`
    INSERT INTO otps (user_id, otp_code, expires_at)
    VALUES (${userId}, ${otp}, ${expiresAt})
  `;
  
  return otp;
}

export async function verifyOTP(userId: number, code: string): Promise<boolean> {
  const result = await sql`
    SELECT * FROM otps 
    WHERE user_id = ${userId} 
    AND otp_code = ${code} 
    AND used = false 
    AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `;
  
  if (result.length === 0) return false;
  
  await sql`
    UPDATE otps 
    SET used = true 
    WHERE id = ${result[0].id}
  `;
  
  return true;
}
