import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { logIP } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password, email } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }
    
    const existing = await sql`SELECT id FROM users WHERE username = ${username}`;
    
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }
    
    // PLAIN TEXT STORAGE - DEMO ONLY
    const result = await sql`
      INSERT INTO users (username, password, email)
      VALUES (${username}, ${password}, ${email || null})
      RETURNING id, username, email
    `;
    
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const ua = request.headers.get('user-agent') || 'unknown';
    await logIP(result[0].id, ip, 
'REGISTER_SUCCESS', ua);
    
    return NextResponse.json({ 
      success: true, 
      user: result[0],
      warning: 'Password stored in plain text - DEMO ONLY'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

