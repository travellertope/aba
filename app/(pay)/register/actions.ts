'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { registrationSchema } from '@/lib/pay/validation';
import { checkRateLimit } from '@/lib/pay/rate-limit';
import { isValidTierInterval, getStripePriceId } from '@/lib/stripe/plans';
import { getStripeClient } from '@/lib/stripe/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export interface RegisterActionState {
  error: string | null;
  fieldErrors?: Record<string, string>;
}

export async function registerAndCheckout(
  _prevState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  const { allowed } = await checkRateLimit(`register:${ip}`, 5, 60);
  if (!allowed) {
    return { error: 'Too many attempts. Please wait a minute and try again.' };
  }

  const raw = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    dateOfBirth: formData.get('dateOfBirth'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    businessName: formData.get('businessName'),
    businessStreetAddress: formData.get('businessStreetAddress'),
    businessTownCity: formData.get('businessTownCity'),
    businessStateCounty: formData.get('businessStateCounty'),
    websiteAddress: formData.get('websiteAddress'),
    tier: formData.get('tier'),
    interval: formData.get('interval'),
  };

  const parsed = registrationSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0];
      if (typeof path === 'string' && !fieldErrors[path]) fieldErrors[path] = issue.message;
    }
    return { error: 'Please check the highlighted fields.', fieldErrors };
  }

  const data = parsed.data;

  if (!isValidTierInterval(data.tier, data.interval)) {
    return { error: 'That billing option is not available for the selected membership tier.' };
  }

  // Everything below can fail on missing/misconfigured env vars (Stripe key,
  // price IDs, Supabase keys) — catch it here and show a normal error
  // message instead of letting it crash to a raw browser error page.
  let checkoutUrl: string;
  try {
    const supabase = createSupabaseAdminClient();

    const { data: member, error: dbError } = await supabase
      .from('members')
      .upsert(
        {
          first_name: data.firstName,
          last_name: data.lastName,
          date_of_birth: data.dateOfBirth || null,
          phone: data.phone,
          email: data.email,
          business_name: data.businessName || null,
          business_street_address: data.businessStreetAddress,
          business_town_city: data.businessTownCity || null,
          business_state_county: data.businessStateCounty || null,
          website_address: data.websiteAddress || null,
          membership_tier: data.tier,
          billing_interval: data.interval,
          membership_status: 'pending',
        },
        { onConflict: 'email' },
      )
      .select('id')
      .single();

    if (dbError || !member) {
      console.error('[registerAndCheckout] Supabase upsert failed:', dbError);
      return { error: 'Something went wrong saving your details. Please try again.' };
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL ?? `https://${headerList.get('host')}`;

    const session = await getStripeClient().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: getStripePriceId(data.tier, data.interval), quantity: 1 }],
      customer_email: data.email,
      client_reference_id: member.id,
      metadata: { member_id: member.id, tier: data.tier, interval: data.interval },
      subscription_data: {
        metadata: { member_id: member.id, tier: data.tier, interval: data.interval },
      },
      success_url: `${origin}/register/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/register`,
    });

    if (!session.url) {
      return { error: 'Could not start checkout. Please try again.' };
    }
    checkoutUrl = session.url;
  } catch (err) {
    console.error('[registerAndCheckout] Checkout setup failed:', err);
    return { error: 'Something went wrong starting checkout. Please try again shortly.' };
  }

  redirect(checkoutUrl);
}
