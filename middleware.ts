// Middleware — Route Protection
// Step 4 will fully implement this using NextAuth's withAuth middleware.
// For now, it stubs the structure so the routing rules are visible.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Roles that may access /admin routes
const ADMIN_ROLES = ['administrator', 'aba_manager', 'aba_staff'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Step 4: Replace with NextAuth token check ────────────
  // const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  //
  // if (!token && pathname.startsWith('/portal') && pathname !== '/portal/login') {
  //   return NextResponse.redirect(new URL('/portal/login', request.url));
  // }
  //
  // if (pathname.startsWith('/admin') && !ADMIN_ROLES.includes(token?.role as string)) {
  //   return NextResponse.redirect(new URL('/portal/dashboard', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  // Protect /portal (except login) and all /admin routes
  matcher: ['/portal/((?!login|forgot-password).*)' , '/admin/:path*'],
};
