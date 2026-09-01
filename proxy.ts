// Proxy — Route Protection via Auth.js v5
// Next.js 16 renamed "middleware" → "proxy". File must be proxy.ts, export named "proxy".
// Runs on every matched request at the Edge before the page renders.

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextAuthRequest } from 'next-auth';

const ADMIN_ROLES = ['administrator', 'aba_manager', 'aba_staff'] as const;

// app/(pay)/* routes — the only ones pay.[domain] should ever serve.
// Keep this in sync with the actual folders under app/(pay)/.
const PAY_ONLY_PATH_PREFIXES = ['/register', '/login', '/dashboard', '/auth', '/api/webhooks/stripe'];

export const proxy = auth((req: NextAuthRequest) => {
    const { pathname } = req.nextUrl;
    const session = req.auth;

    // ── Host-based gating for the standalone payments deployment ──
    // This repo is a single Next.js app serving multiple domains: the main
    // ABA site AND pay.[domain]. Without this check, pay.[domain] would
    // happily serve /admin, /portal, the marketing site — everything —
    // since a route group like app/(pay)/ only organizes code, it doesn't
    // restrict which hostname can reach a route.
    const host = req.headers.get('host') ?? '';
    const payHostname = process.env.PAY_HOSTNAME;

    if (payHostname && host.startsWith(payHostname)) {
      const isPayRoute = pathname === '/' || PAY_ONLY_PATH_PREFIXES.some((p) => pathname.startsWith(p));
      if (!isPayRoute) {
        return NextResponse.redirect(new URL('/register', req.url));
      }
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/register', req.url));
      }
      return NextResponse.next();
    }

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
    // Every path except Next.js internals and files with an extension
    // (static assets) — needed so the pay-host gating above can catch
    // requests to /, /about, /admin, etc., not just /portal and /admin.
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
