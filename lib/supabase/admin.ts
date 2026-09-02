// ============================================================
// Supabase admin client — service role key, bypasses RLS.
// SERVER-ONLY. Only ever use this from trusted, unspoofable
// contexts: the Stripe webhook handler (signature-verified) and
// admin-role Server Actions. Never expose SUPABASE_SERVICE_ROLE_KEY
// to the client bundle.
// ============================================================
import 'server-only';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createSupabaseAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.');
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
