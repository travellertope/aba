'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getStripeClient } from '@/lib/stripe/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function openBillingPortal() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: member } = await supabase
    .from('members')
    .select('stripe_customer_id')
    .eq('auth_user_id', user!.id)
    .single();

  if (!member?.stripe_customer_id) {
    redirect('/dashboard?error=no-billing-account');
  }

  const headerList = await headers();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? `https://${headerList.get('host')}`;

  const session = await getStripeClient().billingPortal.sessions.create({
    customer: member.stripe_customer_id,
    return_url: `${origin}/dashboard`,
  });

  redirect(session.url);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}
