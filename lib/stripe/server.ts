// ============================================================
// Stripe server client — server-only, never import from a
// 'use client' component. Mirrors lib/graphql/client.ts's
// "server-only fetch client" pattern for the pay deployment.
//
// Lazily constructed: a missing STRIPE_SECRET_KEY throws only when
// getStripeClient() is actually called, inside whatever try/catch
// the caller has — not at module import time, where it can't be
// caught and crashes the whole request.
// ============================================================
import 'server-only';
import Stripe from 'stripe';

let cached: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (cached) return cached;

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
  }

  // No explicit apiVersion override: the installed `stripe` package pins its
  // own default API version, and its TypeScript types are built against that
  // same version. Overriding the string here without also matching the type
  // definitions is how webhook payload shapes silently drift from the types.
  cached = new Stripe(STRIPE_SECRET_KEY, { typescript: true });
  return cached;
}
