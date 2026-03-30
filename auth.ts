// ============================================================
// Auth.js v5 (next-auth@beta) — Core Configuration
// This is the single source of truth for authentication.
// Import { auth, signIn, signOut } from '@/auth' everywhere.
// ============================================================

import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { LOGIN_MUTATION } from '@/lib/graphql/mutations';
import type { AbaRole, MembershipTier, SubscriptionStatus } from '@/types';

const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL!;

// ── Extend the built-in session/token types ───────────────
declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      role: AbaRole;
      membershipTier: MembershipTier;
      subscriptionStatus: SubscriptionStatus;
    } & DefaultSession['user'];
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    role: AbaRole;
    membershipTier: MembershipTier;
    subscriptionStatus: SubscriptionStatus;
    databaseId: number;
  }
}

// In next-auth v5, JWT is augmented inside 'next-auth', not 'next-auth/jwt'
declare module 'next-auth' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    role: AbaRole;
    membershipTier: MembershipTier;
    subscriptionStatus: SubscriptionStatus;
    databaseId: number;
  }
}

// ── WPGraphQL login helper ────────────────────────────────

interface WPLoginResponse {
  login: {
    authToken: string;
    refreshToken: string;
    user: {
      id: string;
      databaseId: number;
      name: string;
      email: string;
      abaRole: AbaRole;
      membershipTier: MembershipTier;
      subscriptionStatus: SubscriptionStatus;
    };
  };
}

async function wpLogin(username: string, password: string): Promise<WPLoginResponse['login'] | null> {
  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: LOGIN_MUTATION,
        variables: { username, password },
      }),
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (json.errors?.length || !json.data?.login) return null;

    return json.data.login;
  } catch {
    return null;
  }
}

// ── Auth.js configuration ─────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'WordPress',
      credentials: {
        username: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const login = await wpLogin(
          credentials.username as string,
          credentials.password as string,
        );

        if (!login) return null;

        return {
          id: String(login.user.databaseId),
          databaseId: login.user.databaseId,
          name: login.user.name,
          email: login.user.email,
          role: login.user.abaRole,
          membershipTier: login.user.membershipTier,
          subscriptionStatus: login.user.subscriptionStatus,
          accessToken: login.authToken,
          refreshToken: login.refreshToken,
        };
      },
    }),
  ],

  callbacks: {
    // Persist extra fields from the User object into the JWT
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.databaseId = user.databaseId;
        token.role = user.role;
        token.membershipTier = user.membershipTier;
        token.subscriptionStatus = user.subscriptionStatus;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    // Expose the JWT fields on the client-accessible session object
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as AbaRole;
      session.user.membershipTier = token.membershipTier as MembershipTier;
      session.user.subscriptionStatus = token.subscriptionStatus as SubscriptionStatus;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },

  pages: {
    signIn: '/portal/login',
    error: '/portal/login',   // Auth errors redirect back to login with ?error=
  },

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8, // 8 hours — matches typical WP JWT expiry
  },

  // NEXTAUTH_SECRET must be set in .env.local
});
