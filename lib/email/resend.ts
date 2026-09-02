// ============================================================
// Resend client — server-only. Lazily constructed like
// lib/stripe/server.ts, so a missing RESEND_API_KEY only throws
// when actually sending an email, inside whatever try/catch the
// caller has — never at module import time.
// ============================================================
import 'server-only';
import { Resend } from 'resend';

let cached: Resend | null = null;

export function getResendClient(): Resend {
  if (cached) return cached;

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set in environment variables.');
  }

  cached = new Resend(RESEND_API_KEY);
  return cached;
}
