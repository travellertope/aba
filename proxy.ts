// Proxy — Route Protection via Auth.js v5
// Next.js 16 renamed "middleware" → "proxy". File must be proxy.ts, export named "proxy".
// Runs on every matched request at the Edge before the page renders.

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextAuthRequest } from 'next-auth';

const ADMIN_ROLES = ['administrator', 'aba_manager', 'aba_staff'] as const;

export const proxy = auth((req: NextAuthRequest) => {
    const { pathname } = req.nextUrl;
    const session = req.auth;

    // ── Unauthenticated users hitting /portal/* (except login/reset) ──
    if (
      !session && 
      pathname.startsWith('/portal') && 
      !pathname.startsWith('/portal/login') &&
      !pathname.startsWith('/portal/reset-password') &&
      !pathname.startsWith('/portal/forgot-password')
    ) {
      const loginUrl = new URL('/portal/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ── Authenticated users hitting the login page → redirect to dashboard ──
    if (session && pathname.startsWith('/portal/login')) {
      return NextResponse.redirect(new URL('/portal/dashboard', req.url));
    }

    // ── /admin/* — requires manager/admin/staff role ──
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      if (!session) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
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
