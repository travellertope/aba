// Middleware — Route Protection via Auth.js v5
// Runs on every matched request at the Edge before the page renders.
// Auth.js exports a `auth` middleware helper that reads the JWT session cookie.

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_ROLES = ['administrator', 'aba_manager', 'aba_staff'] as const;

export default auth((req: NextRequest & { auth: Awaited<ReturnType<typeof auth>> | null }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // ── Unauthenticated users hitting /portal/* (except login) ──
  if (!session && pathname.startsWith('/portal') && !pathname.startsWith('/portal/login')) {
    const loginUrl = new URL('/portal/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Authenticated users hitting the login page → redirect to dashboard ──
  if (session && pathname.startsWith('/portal/login')) {
    return NextResponse.redirect(new URL('/portal/dashboard', req.url));
  }

  // ── /admin/* — requires manager/admin/staff role ──
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/portal/login', req.url));
    }
    const role = session.user?.role as string | undefined;
    if (!role || !ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
      // Member without admin access → back to their dashboard
      return NextResponse.redirect(new URL('/portal/dashboard', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match /portal/* and /admin/* but skip Next.js internals and static files
    '/portal/((?!_next|favicon.ico).*)',
    '/admin/((?!_next|favicon.ico).*)',
  ],
};
