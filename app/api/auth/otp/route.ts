import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';
import { createSession, logIP } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { userId, otp } = await request.json();
    
    if (!userId || !otp) {
      return NextResponse.json({ error: 'User ID and OTP required' }, { status: 400 });
    }
    
    const isValid = await verifyOTP(userId, otp);
    
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const ua = request.headers.get('user-agent') || 'unknown';
    
    if (!isValid) {
      await logIP(userId, ip, 'OTP_FAILED', ua);
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }
    
    await createSession(userId, ip);
    await logIP(userId, ip, 'LOGIN_COMPLETE', ua);
    
    return NextResponse.json({ success: true, message: 'Login successful' });
    
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
