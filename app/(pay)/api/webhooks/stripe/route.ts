import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { getStripeClient } from '@/lib/stripe/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { PayMembershipStatus } from '@/types/pay';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Stripe subscription.status → our membership_status
function mapSubscriptionStatus(status: Stripe.Subscription.Status): PayMembershipStatus {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'active';
    case 'past_due':
    case 'unpaid':
      return 'past_due';
    default:
      return 'cancelled';
  }
}

async function getOrCreateAuthUser(supabase: ReturnType<typeof createSupabaseAdminClient>, email: string) {
  const { data, error } = await supabase.auth.admin.createUser({ email, email_confirm: true });
  if (!error && data.user) return data.user.id;

  // Already exists (redelivered webhook, or a prior failed/abandoned attempt) —
  // generateLink also creates-or-fetches the user and hands back their id.
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });
  if (linkError || !linkData.user) {
    throw new Error(`Could not resolve auth user for ${email}: ${linkError?.message ?? error?.message}`);
  }
  return linkData.user.id;
}

export async function POST(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error('[stripe webhook] STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error('Missing stripe-signature header');
    event = getStripeClient().webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error('[stripe webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription' || !session.subscription) break;

        const memberId = session.client_reference_id ?? session.metadata?.member_id;
        if (!memberId) {
          console.error('[stripe webhook] checkout.session.completed missing member_id', session.id);
          break;
        }

        const subscription = await getStripeClient().subscriptions.retrieve(session.subscription as string);
        const email = session.customer_details?.email;
        if (!email) break;

        const authUserId = await getOrCreateAuthUser(supabase, email);
        const periodEnd = subscription.items.data[0]?.current_period_end;

        await supabase
          .from('members')
          .update({
            auth_user_id: authUserId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            membership_status: mapSubscriptionStatus(subscription.status),
            membership_expires_at: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          })
          .eq('id', memberId);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data: member } = await supabase
          .from('members')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();
        if (!member) break;

        await supabase.from('payment_history').upsert(
          {
            member_id: member.id,
            stripe_invoice_id: invoice.id,
            amount_pence: invoice.amount_paid,
            currency: invoice.currency,
            status: 'paid',
            description: invoice.lines.data[0]?.description ?? 'Membership payment',
            paid_at: invoice.status_transitions.paid_at
              ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
              : new Date().toISOString(),
          },
          { onConflict: 'stripe_invoice_id' },
        );

        await supabase.from('members').update({ membership_status: 'active' }).eq('id', member.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        await supabase
          .from('members')
          .update({ membership_status: 'past_due' })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const periodEnd = subscription.items.data[0]?.current_period_end;
        await supabase
          .from('members')
          .update({
            membership_status: mapSubscriptionStatus(subscription.status),
            membership_expires_at: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await supabase
          .from('members')
          .update({ membership_status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`[stripe webhook] Error handling ${event.type}:`, err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
