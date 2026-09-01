// ============================================================
// Membership tier → Stripe Price ID mapping.
// Price IDs are created once in the Stripe Dashboard (or via API)
// and wired in here through env vars — never hardcode a price
// amount that also has to match a live Stripe Price object.
//
// Pricing source: African Business Association "Register to
// Become a Member" page.
// ============================================================
import type { BillingInterval, MembershipTierConfig, PayMembershipTier } from '@/types/pay';

export const TIER_CONFIG: Record<PayMembershipTier, MembershipTierConfig> = {
  individual: {
    id: 'individual',
    name: 'Individual / Start-up Membership',
    description: 'For intending entrepreneurs, start-ups, and professionals.',
    prices: {
      monthly: { amountPence: 800, label: '£8/month' },
      yearly: { amountPence: 9000, label: '£90/year' },
    },
  },
  sme: {
    id: 'sme',
    name: 'Small and Medium Enterprises Membership',
    description: 'For entrepreneurs with one+ year in business, or 1–20 employees.',
    prices: {
      monthly: { amountPence: 2500, label: '£25/month' },
      yearly: { amountPence: 30000, label: '£300/year' },
    },
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate Businesses and Organisations Membership',
    description: 'For corporate, government and partner organisations (10+ employees).',
    prices: {
      // Corporate is a recurring annual subscription only — no monthly option.
      yearly: { amountPence: 100000, label: '£1,000/year' },
    },
  },
};

// Stripe Price IDs, one per (tier, interval) combination that's actually offered.
// Set these once the Products/Prices are created in Stripe.
const PRICE_ID_ENV: Record<PayMembershipTier, Partial<Record<BillingInterval, string | undefined>>> = {
  individual: {
    monthly: process.env.STRIPE_PRICE_INDIVIDUAL_MONTHLY,
    yearly: process.env.STRIPE_PRICE_INDIVIDUAL_YEARLY,
  },
  sme: {
    monthly: process.env.STRIPE_PRICE_SME_MONTHLY,
    yearly: process.env.STRIPE_PRICE_SME_YEARLY,
  },
  corporate: {
    yearly: process.env.STRIPE_PRICE_CORPORATE_YEARLY,
  },
};

export function isValidTierInterval(tier: PayMembershipTier, interval: BillingInterval): boolean {
  return Boolean(TIER_CONFIG[tier].prices[interval]);
}

export function getStripePriceId(tier: PayMembershipTier, interval: BillingInterval): string {
  const priceId = PRICE_ID_ENV[tier]?.[interval];
  if (!priceId) {
    throw new Error(
      `No Stripe price configured for tier="${tier}" interval="${interval}". Set the matching STRIPE_PRICE_* env var.`,
    );
  }
  return priceId;
}
