import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  const logs = await sql`
    SELECT ip_address, action, user_agent, created_at 
    FROM ip_logs 
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
    LIMIT 50
  `;
  
  return NextResponse.json({ logs });
}
