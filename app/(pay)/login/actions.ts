'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/pay/rate-limit';
import { getAppOrigin } from '@/lib/pay/origin';
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

  try {
    const origin = getAppOrigin(headerList.get('host'));
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
  } catch (err) {
    console.error('[sendMagicLink] Failed:', err);
    return { error: 'Something went wrong. Please try again shortly.', sent: false };
  }

  return { error: null, sent: true };
}
