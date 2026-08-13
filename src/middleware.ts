// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // Strict Transport Security (max-age 2 years, include subdomains)
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  // Content Security Policy – example restrictive policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'"
  );
  // Clickjacking protection
  response.headers.set('X-Frame-Options', 'DENY');
  // MIME type sniffing protection
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions Policy – disable most powerful features
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), payment=()');
  return response;
}

export const config = {
  matcher: '/:path*',
};
