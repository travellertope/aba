// ============================================================
// "New member registered" notification to ABA admin staff.
// Best-effort only: a failure here must never break the Stripe
// webhook it's called from — the member's payment already
// succeeded and their account is already active by the time this
// runs, so an email hiccup shouldn't roll any of that back.
// ============================================================
import 'server-only';
import { getResendClient } from './resend';
import { TIER_CONFIG } from '@/lib/stripe/plans';
import type { BillingInterval, PayMembershipTier } from '@/types/pay';

export interface NewRegistrationNotice {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string | null;
  tier: PayMembershipTier;
  interval: BillingInterval;
}

export async function notifyAdminOfRegistration(member: NewRegistrationNotice): Promise<void> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!adminEmail || !fromEmail) {
    console.warn(
      '[notifyAdminOfRegistration] ADMIN_NOTIFICATION_EMAIL / RESEND_FROM_EMAIL not set — skipping admin notification.',
    );
    return;
  }

  const tierConfig = TIER_CONFIG[member.tier];
  const priceLabel = tierConfig.prices[member.interval]?.label ?? `${member.tier}/${member.interval}`;

  const firstName = escapeHtml(member.firstName);
  const lastName = escapeHtml(member.lastName);
  const email = escapeHtml(member.email);
  const phone = escapeHtml(member.phone);
  const businessName = member.businessName ? escapeHtml(member.businessName) : null;

  try {
    await getResendClient().emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New ABA member: ${firstName} ${lastName} (${tierConfig.name})`,
      html: `
        <h2>New membership registration</h2>
        <p><strong>${firstName} ${lastName}</strong> just paid for ABA membership.</p>
        <table cellpadding="4">
          <tr><td><strong>Tier</strong></td><td>${escapeHtml(tierConfig.name)} — ${escapeHtml(priceLabel)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${email}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
          ${businessName ? `<tr><td><strong>Business</strong></td><td>${businessName}</td></tr>` : ''}
        </table>
      `,
    });
  } catch (err) {
    console.error('[notifyAdminOfRegistration] Failed to send admin notification email:', err);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
