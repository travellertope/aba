// ============================================================
// Auth.js v5 Middleware — Route Protection
// Runs on every request matched by config.matcher.
// ============================================================

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes inside /portal/* that don't require a session
const PUBLIC_PORTAL_ROUTES = ['/portal/login', '/portal/forgot-password'];

// Role set that may access /admin/*
const ADMIN_ROLES = new Set(['administrator', 'aba_manager', 'aba_staff']);

export default auth((req: NextRequest & { auth: Awaited<ReturnType<typeof auth>> }) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  // ── /portal/* protection ──────────────────────────────────
  // Allow: the v0.dev login preview at /portal (public route group)
  // Allow: /portal/login, /portal/forgot-password
  // Require session: everything else under /portal/*
  if (pathname.startsWith('/portal/') && !PUBLIC_PORTAL_ROUTES.includes(pathname)) {
    if (!session) {
      const loginUrl = new URL('/portal/login', nextUrl.origin);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── /admin/* protection ───────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const loginUrl = new URL('/portal/login', nextUrl.origin);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const role = session.user?.role;
    if (!role || !ADMIN_ROLES.has(role)) {
      // Authenticated but not an admin — redirect to member dashboard
      return NextResponse.redirect(new URL('/portal/dashboard', nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - Public files in /public (images, fonts, etc.)
     * - api/auth/* (NextAuth route handler — handles its own auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$|api/auth).*)',
  ],
};
