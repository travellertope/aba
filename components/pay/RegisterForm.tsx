'use client';

import { useActionState, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { registerAndCheckout, type RegisterActionState } from '@/app/(pay)/register/actions';
import type { BillingInterval, MembershipTierConfig, PayMembershipTier } from '@/types/pay';

const initialState: RegisterActionState = { error: null };

function gbp(amountPence: number): string {
  return `£${(amountPence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function RegisterForm({
  tiers,
}: {
  tiers: Record<PayMembershipTier, MembershipTierConfig>;
}) {
  const [state, formAction, pending] = useActionState(registerAndCheckout, initialState);
  const [tier, setTier] = useState<PayMembershipTier>('individual');
  const [interval, setInterval] = useState<BillingInterval>('yearly');

  const tierList = Object.values(tiers) as MembershipTierConfig[];
  const selectedConfig = tiers[tier];
  const availableIntervals = Object.keys(selectedConfig.prices) as BillingInterval[];
  const price = selectedConfig.prices[interval] ?? selectedConfig.prices[availableIntervals[0]]!;

  function selectTier(next: PayMembershipTier) {
    setTier(next);
    const nextIntervals = Object.keys(tiers[next].prices) as BillingInterval[];
    if (!nextIntervals.includes(interval)) setInterval(nextIntervals[0]);
  }

  const fieldError = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={formAction}>
      <input type="hidden" name="tier" value={tier} />
      <input type="hidden" name="interval" value={interval} />

      {/* ── Checkout progress ── */}
      <nav
        aria-label="Checkout progress"
        className="mx-auto flex max-w-5xl items-center gap-2.5 px-4 pt-5 text-xs text-[#746b57]"
      >
        <span className="flex items-center gap-2 font-semibold text-[#1a2340]">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#d4a843] font-[family-name:var(--font-mono-price)] text-[10px] text-[#1a2340]">
            1
          </span>
          Your details
        </span>
        <span className="h-px w-5 bg-[#e6ddc9]" />
        <span className="flex items-center gap-2">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#e6ddc9] font-[family-name:var(--font-mono-price)] text-[10px]">
            2
          </span>
          Secure payment
        </span>
      </nav>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-5 pb-20 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* ── Form column ── */}
        <div className="min-w-0">
          <Panel title="Choose your membership" hint="You can switch tiers any time before paying.">
            <div className="grid gap-3 sm:grid-cols-3">
              {tierList.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => selectTier(t.id)}
                  className={cn(
                    'flex flex-col gap-1.5 rounded-[10px] border-[1.5px] p-3.5 text-left transition-colors',
                    tier === t.id
                      ? 'border-[#b8842e] bg-[#f3efe4] shadow-[0_0_0_1px_#b8842e]'
                      : 'border-[#e6ddc9] hover:border-[#b8842e]',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[13.5px] font-semibold text-[#1a2340]">{t.name}</div>
                      <div className="text-[11.5px] text-[#746b57]">{t.eligibility}</div>
                    </div>
                    <span
                      className={cn(
                        'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px]',
                        tier === t.id ? 'border-[#b8842e]' : 'border-[#e6ddc9]',
                      )}
                    >
                      {tier === t.id && <span className="h-2 w-2 rounded-full bg-[#b8842e]" />}
                    </span>
                  </div>
                  <div className="font-[family-name:var(--font-mono-price)] text-[15px] font-semibold text-[#1a2340]">
                    {gbp(Object.values(t.prices)[0]!.amountPence)}
                    <span className="ml-1 font-[family-name:var(--font-body)] text-[11px] font-medium text-[#746b57]">
                      /{Object.keys(t.prices)[0]}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {availableIntervals.length > 1 && (
              <div className="mt-3.5 inline-flex gap-0.5 rounded-lg border border-[#e6ddc9] p-[3px]">
                {availableIntervals.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setInterval(i)}
                    className={cn(
                      'rounded-md px-3.5 py-1.5 text-xs font-semibold capitalize',
                      interval === i ? 'bg-[#1a2340] text-white' : 'text-[#746b57]',
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 rounded-lg bg-[#f3efe4] p-4">
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#746b57]">
                What&apos;s included with {selectedConfig.name}
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {selectedConfig.benefits.map((benefit) =>
                  benefit.endsWith(':') ? (
                    <li key={benefit} className="pt-1 text-[12px] font-semibold text-[#1a2340]">
                      {benefit}
                    </li>
                  ) : (
                    <li key={benefit} className="flex items-start gap-2 text-[12.5px] text-[#1a2340]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        className="mt-[3px] h-3 w-3 shrink-0 text-[#b8842e]"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {benefit}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </Panel>

          <Panel title="Your details" hint="We'll send your receipt and account access here.">
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="First name" name="firstName" required error={fieldError('firstName')} maxLength={100} />
              <Field label="Last name" name="lastName" required error={fieldError('lastName')} maxLength={100} />
            </div>
            <Field label="Phone" name="phone" type="tel" required error={fieldError('phone')} maxLength={32} />
            <Field
              label="Email address"
              name="email"
              type="email"
              required
              error={fieldError('email')}
              hint="Your receipt and login link go here — no password needed."
              maxLength={254}
            />
          </Panel>

          <Panel title="Business details" hint="Used for your listing in the ABA member directory.">
            <Field label="Business name" name="businessName" optional error={fieldError('businessName')} maxLength={200} />
            <Field
              label="Business street address"
              name="businessStreetAddress"
              required
              error={fieldError('businessStreetAddress')}
              maxLength={200}
            />
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Town / city" name="businessTownCity" optional error={fieldError('businessTownCity')} maxLength={100} />
              <Field
                label="State / county"
                name="businessStateCounty"
                optional
                error={fieldError('businessStateCounty')}
                maxLength={100}
              />
            </div>
            <Field
              label="Website"
              name="websiteAddress"
              optional
              error={fieldError('websiteAddress')}
              maxLength={200}
              placeholder="https://"
            />
          </Panel>

          {state.error && (
            <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
          )}
        </div>

        {/* ── Order summary ── */}
        <aside className="mt-6 flex flex-col gap-4 lg:sticky lg:top-[88px] lg:mt-0">
          <div className="overflow-hidden rounded-xl border border-[#e6ddc9] bg-white">
            <div className="px-5 pb-1 pt-[18px]">
              <h2 className="font-[family-name:var(--font-display)] text-[15px] font-medium text-[#1a2340]">
                Order summary
              </h2>
            </div>
            <div className="flex items-start justify-between gap-3 border-t border-[#e6ddc9] px-5 py-3.5">
              <div>
                <div className="text-[13.5px] font-semibold text-[#1a2340]">{selectedConfig.name}</div>
                <div className="mt-0.5 text-xs text-[#746b57]">Billed {interval} · renews automatically</div>
              </div>
              <div className="whitespace-nowrap font-[family-name:var(--font-mono-price)] text-sm font-semibold text-[#1a2340]">
                {gbp(price.amountPence)}
              </div>
            </div>
            <div className="flex items-baseline justify-between border-t border-[#e6ddc9] bg-[#f3efe4] px-5 py-4">
              <span className="text-[13px] font-semibold text-[#1a2340]">Due today</span>
              <span className="font-[family-name:var(--font-mono-price)] text-[22px] font-semibold text-[#1a2340]">
                {gbp(price.amountPence)}
              </span>
            </div>
            <p className="border-t border-[#e6ddc9] px-5 pb-[18px] pt-3 text-[11.5px] text-[#746b57]">
              Renews at {gbp(price.amountPence)}/{interval === 'yearly' ? 'year' : 'month'}. Cancel any time from
              your member dashboard.
            </p>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-[#e6ddc9] bg-white p-4 text-xs text-[#746b57]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="mt-0.5 h-4 w-4 shrink-0 text-[#2f7a4d]"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <div>
              <strong className="mb-0.5 block text-[12.5px] text-[#1a2340]">You&apos;ll pay on Stripe&apos;s secure page</strong>
              We never see or store your card details. All major cards accepted.
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#d4a843] px-4 py-[15px] text-[15px] font-bold text-[#1a2340] hover:brightness-95 disabled:opacity-60"
            >
              {pending ? 'Redirecting to payment…' : `Continue to secure payment — ${gbp(price.amountPence)}`}
              {!pending && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-[15px] w-[15px]">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </button>
            <p className="mt-2 text-center text-[11px] text-[#746b57]">
              By continuing you agree to ABA&apos;s membership terms.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}

function Panel({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 rounded-xl border border-[#e6ddc9] bg-white p-6 first:mt-0">
      <h2 className="font-[family-name:var(--font-display)] text-[19px] font-medium text-[#1a2340]">{title}</h2>
      <p className="mb-4 mt-1 text-[13px] text-[#746b57]">{hint}</p>
      <div className="space-y-3.5">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  optional,
  error,
  hint,
  maxLength,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  maxLength?: number;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[12.5px] font-semibold text-[#1a2340]">
        {label}
        {required && <span className="text-[#a8402a]"> *</span>}
        {optional && <span className="font-medium text-[#746b57]"> (optional)</span>}
      </label>
      {hint && <p className="-mt-1 text-[11.5px] text-[#746b57]">{hint}</p>}
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        className="rounded-lg border-[#e6ddc9] px-3 py-2.5 text-sm focus-visible:border-[#b8842e] focus-visible:ring-[#b8842e]"
      />
      {error && <p className="text-xs text-[#a8402a]">{error}</p>}
    </div>
  );
}
