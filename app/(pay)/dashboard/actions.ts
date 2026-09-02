'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getStripeClient } from '@/lib/stripe/server';
import { getAppOrigin } from '@/lib/pay/origin';
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

  let checkoutUrl: string;
  try {
    const headerList = await headers();
    const origin = getAppOrigin(headerList.get('host'));

    const session = await getStripeClient().billingPortal.sessions.create({
      customer: member.stripe_customer_id,
      return_url: `${origin}/dashboard`,
    });
    checkoutUrl = session.url;
  } catch (err) {
    console.error('[openBillingPortal] Failed:', err);
    redirect('/dashboard?error=billing-portal-unavailable');
  }

  redirect(checkoutUrl);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}
