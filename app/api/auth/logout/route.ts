import { NextRequest, NextResponse } from 'next/server';
import { destroySession, logIP } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const ua = request.headers.get('user-agent') || 'unknown';
  await logIP(null, ip, 'LOGOUT', ua);
  
  await destroySession();
  return NextResponse.json({ success: true });
}
