// ============================================================
// Resolves the absolute origin (scheme + host, no trailing slash)
// this deployment is running as — needed for Stripe redirect URLs
// and Supabase auth redirects, both of which reject a bare host
// with no scheme (e.g. "pay.abfb.co.uk" instead of
// "https://pay.abfb.co.uk").
// ============================================================
import 'server-only';

export function getAppOrigin(host: string | null): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  const raw = configured || (host ? `https://${host}` : '');

  if (!raw) {
    throw new Error('Could not determine app origin: NEXT_PUBLIC_APP_URL is not set and no host header was present.');
  }

  // Guard against NEXT_PUBLIC_APP_URL being set without a scheme
  // (e.g. "pay.abfb.co.uk") — Stripe and Supabase both reject that.
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  return withScheme.replace(/\/+$/, '');
}
