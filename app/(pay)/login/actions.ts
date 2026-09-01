'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/pay/rate-limit';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface LoginActionState {
  error: string | null;
  sent: boolean;
}

const emailSchema = z.string().trim().email().max(254);

export async function sendMagicLink(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  const { allowed } = await checkRateLimit(`login:${ip}`, 5, 60);
  if (!allowed) {
    return { error: 'Too many attempts. Please wait a minute and try again.', sent: false };
  }

  const parsed = emailSchema.safeParse(formData.get('email'));
  if (!parsed.success) {
    return { error: 'Please enter a valid email address.', sent: false };
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? `https://${headerList.get('host')}`;
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      shouldCreateUser: false,
    },
  });

  // Always report success to avoid leaking which emails have an account.
  if (error) console.error('[sendMagicLink] Supabase error:', error.message);
  return { error: null, sent: true };
}
