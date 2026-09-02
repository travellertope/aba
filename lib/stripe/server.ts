// ============================================================
// Stripe server client — server-only, never import from a
// 'use client' component. Mirrors lib/graphql/client.ts's
// "server-only fetch client" pattern for the pay deployment.
// ============================================================
import 'server-only';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
}

// No explicit apiVersion override: the installed `stripe` package pins its
// own default API version, and its TypeScript types are built against that
// same version. Overriding the string here without also matching the type
// definitions is how webhook payload shapes silently drift from the types.
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  typescript: true,
});
