import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')?.value;
  const isProtected = request.nextUrl.pathname.startsWith('/dashboard');
  
  if (isProtected && !sessionToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
