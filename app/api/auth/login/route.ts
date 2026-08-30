import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { logIP } from '@/lib/auth';
import { createOTP } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }
    
    const result = await sql`SELECT * FROM users WHERE username = ${username}`;
    
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const ua = request.headers.get('user-agent') || 'unknown';
    
    if (result.length === 0) {
      await logIP(null, ip, 'LOGIN_FAILED_USER_NOT_FOUND', ua);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const user = result[0];
    
    // PLAIN TEXT COMPARISON - DEMO ONLY
    if (user.password !== password) {
      await logIP(user.id, ip, 'LOGIN_FAILED_WRONG_PASSWORD', ua);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const otp = await createOTP(user.id);
    await logIP(user.id, ip, 'LOGIN_STEP1_SUCCESS', ua);
    
    // DEMO: Return OTP in response. Production: Send via SMS/Email
    return NextResponse.json({ 
      success: true, 
      message: 'OTP generated. Check response for demo code.',
      userId: user.id,
      demoOtp: otp
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
