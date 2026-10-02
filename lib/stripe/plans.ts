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
    name: 'Individual Membership',
    description: 'For intending entrepreneurs, start-ups, and professionals.',
    eligibility: 'Start-ups & professionals',
    benefits: [
      'Networking events & mentor access across the African business community',
      'Discounted workshops and training on business, finance & digital marketing',
      'Business resource library — templates, legal & financial guides',
      'Funding and grant application support',
      'Listing in the ABA Yorkshire member directory',
    ],
    prices: {
      monthly: { amountPence: 800, label: '£8/month' },
      yearly: { amountPence: 9000, label: '£90/year' },
    },
  },
  sme: {
    id: 'sme',
    name: 'SME Membership',
    description: 'For entrepreneurs with one+ year in business, or 1–20 employees.',
    eligibility: '1–20 employees',
    benefits: [
      'Everything in Individual, plus:',
      'Tailored business growth & scaling support',
      'Priority invitations to trade shows & investor expos',
      'SME advocacy in local government & business forums',
      'Discounts on legal, accounting & marketing services',
      'Market trend reports & industry insights',
    ],
    prices: {
      monthly: { amountPence: 2500, label: '£25/month' },
      yearly: { amountPence: 30000, label: '£300/year' },
    },
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate Membership',
    description: 'For corporate, government and partner organisations (10+ employees).',
    eligibility: '10+ employees',
    benefits: [
      'Everything in SME, plus:',
      'Executive-level networking & CSR partnerships',
      'Sponsorship & exhibition opportunities at ABA events',
      'Brand visibility across ABA publications & media',
      'Strategic consulting on market entry & trade',
      'Direct input into ABA policy & advocacy work',
    ],
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
