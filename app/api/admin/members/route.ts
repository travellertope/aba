// app/api/admin/members/route.ts
// ─────────────────────────────────────────────────────────────
// POST /api/admin/members
//
// Proxy for the createAbaMember WPGraphQL mutation.
// Client components cannot import the server-only wpGraphQL client
// directly, so this Route Handler bridges that gap.
// The admin's JWT token is read from the server-side session and
// forwarded to WordPress — it never touches the client.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { wpGraphQL } from '@/lib/graphql/client';
import { CREATE_MEMBER } from '@/lib/graphql/mutations';

// ── Types ────────────────────────────────────────────────────

interface CreateMemberInput {
  firstName: string;
  lastName: string;
  email: string;
  membershipTier: string;
  phone?: string;
  companyName?: string;
  jobTitle?: string;
  status?: string;
  joinDate?: string;
  paymentMethod?: string;
  notes?: string;
  sendWelcomeEmail?: boolean;
}

interface CreateMemberResponse {
  createAbaMember: {
    success: boolean;
    message: string;
    userId: number | null;
  };
}

// ── Handler ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // SECURITY ARCHITECTURE MANDATE:
  // Before deploying to production, MUST implement @upstash/ratelimit here.
  // This prevents an administrator account (or a client-side infinite loop bug) 
  // from repeatedly hammering the WP GraphQL endpoint and incurring massive "Denial of Wallet" API charges.
  // const ip = req.ip ?? "127.0.0.1";
  // const { success } = await ratelimit.limit(ip);
  // if (!success) return NextResponse.json({ success: false, message: "Rate limit exceeded" }, { status: 429 });

  // 1. Verify the caller is an authenticated admin
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized — not logged in.' },
      { status: 401 },
    );
  }

  if (session.user.role !== 'administrator') {
    return NextResponse.json(
      { success: false, message: 'Forbidden — administrator role required.' },
      { status: 403 },
    );
  }

  // 2. Parse and validate the request body
  let input: CreateMemberInput;

  try {
    input = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body — expected JSON.' },
      { status: 400 },
    );
  }

  const { firstName, lastName, email, membershipTier } = input;

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !membershipTier?.trim()) {
    return NextResponse.json(
      {
        success: false,
        message: 'Missing required fields: firstName, lastName, email, membershipTier.',
      },
      { status: 400 },
    );
  }

  // 3. Forward to WPGraphQL with the admin's auth token
  try {
    const data = await wpGraphQL<CreateMemberResponse>(
      CREATE_MEMBER,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        membershipTier: membershipTier.trim(),
        phone: input.phone?.trim() || undefined,
        companyName: input.companyName?.trim() || undefined,
        jobTitle: input.jobTitle?.trim() || undefined,
        status: input.status || 'active',
        joinDate: input.joinDate || new Date().toISOString().slice(0, 10),
        paymentMethod: input.paymentMethod?.trim() || undefined,
        notes: input.notes?.trim() || undefined,
        sendWelcomeEmail: input.sendWelcomeEmail ?? false,
        frontendUrl: req.nextUrl.origin,
      },
      session.accessToken,
    );

    const result = data.createAbaMember;

    return NextResponse.json(result, {
      status: result.success ? 200 : 422,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error from WPGraphQL.';
    return NextResponse.json(
      { success: false, message, userId: null },
      { status: 500 },
    );
  }
}
