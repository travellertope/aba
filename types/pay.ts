// ============================================================
// Standalone Membership Payments — Shared TypeScript Interfaces
// Data model for the pay.[domain] deployment, backed by Supabase.
// Distinct from types/index.ts (WPGraphQL/CRM data model) until
// the two systems are merged.
// ============================================================

export type PayMembershipTier = 'individual' | 'sme' | 'corporate';
export type BillingInterval = 'monthly' | 'yearly';
export type PayMembershipStatus =
  | 'pending'
  | 'active'
  | 'past_due'
  | 'cancelled';
export type PaymentStatus = 'paid' | 'failed' | 'refunded';

export interface PayMember {
  id: string;
  authUserId: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  phone: string;
  email: string;
  businessName: string | null;
  businessStreetAddress: string;
  businessTownCity: string | null;
  businessStateCounty: string | null;
  websiteAddress: string | null;
  membershipTier: PayMembershipTier;
  billingInterval: BillingInterval;
  membershipStatus: PayMembershipStatus;
  membershipExpiresAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PayPaymentRecord {
  id: string;
  memberId: string;
  stripeInvoiceId: string | null;
  stripePaymentIntentId: string | null;
  amountPence: number;
  currency: string;
  status: PaymentStatus;
  description: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface MembershipTierConfig {
  id: PayMembershipTier;
  name: string;
  description: string;
  /** Short factual eligibility line shown on the tier picker, e.g. "1-20 employees". */
  eligibility: string;
  prices: Partial<Record<BillingInterval, { amountPence: number; label: string }>>;
}

export interface RegistrationFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  businessName: string;
  businessStreetAddress: string;
  businessTownCity: string;
  businessStateCounty: string;
  websiteAddress: string;
  tier: PayMembershipTier;
  interval: BillingInterval;
}
