'use client';

import { useActionState, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { registerAndCheckout, type RegisterActionState } from '@/app/(pay)/register/actions';
import type { BillingInterval, MembershipTierConfig, PayMembershipTier } from '@/types/pay';

const gold = '#d4a843';
const navy = '#1a2340';

const initialState: RegisterActionState = { error: null };

export default function RegisterForm({
  tiers,
}: {
  tiers: Record<PayMembershipTier, MembershipTierConfig>;
}) {
  const [state, formAction, pending] = useActionState(registerAndCheckout, initialState);
  const [tier, setTier] = useState<PayMembershipTier>('individual');
  const [interval, setInterval] = useState<BillingInterval>('yearly');

  const selectedConfig = tiers[tier];
  const availableIntervals = Object.keys(selectedConfig.prices) as BillingInterval[];

  function selectTier(next: PayMembershipTier) {
    setTier(next);
    const nextIntervals = Object.keys(tiers[next].prices) as BillingInterval[];
    if (!nextIntervals.includes(interval)) setInterval(nextIntervals[0]);
  }

  const fieldError = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={formAction} className="mx-auto max-w-3xl px-4 py-10">
      <h1 style={{ color: navy }} className="text-2xl font-bold">
        Register to Become a Member
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Choose your membership tier, then complete your details below.
      </p>

      {/* ── Tier selection ── */}
      <input type="hidden" name="tier" value={tier} />
      <input type="hidden" name="interval" value={interval} />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {(Object.values(tiers) as MembershipTierConfig[]).map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => selectTier(t.id)}
            className={cn(
              'rounded-xl border p-4 text-left transition-colors',
              tier === t.id ? 'border-2' : 'border-slate-200 hover:border-slate-300',
            )}
            style={tier === t.id ? { borderColor: gold, backgroundColor: '#fdf8ee' } : undefined}
          >
            <p style={{ color: navy }} className="text-sm font-bold">
              {t.name}
            </p>
            <p className="mt-1 text-xs text-slate-500">{t.description}</p>
            <p className="mt-2 text-lg font-bold" style={{ color: navy }}>
              {Object.values(t.prices)[0]?.label}
            </p>
          </button>
        ))}
      </div>

      {availableIntervals.length > 1 && (
        <div className="mt-4 inline-flex rounded-md border border-slate-200 p-1">
          {availableIntervals.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInterval(i)}
              className={cn(
                'rounded px-3 py-1 text-xs font-semibold capitalize',
                interval === i ? 'text-white' : 'text-slate-600',
              )}
              style={interval === i ? { backgroundColor: navy } : undefined}
            >
              {i} — {selectedConfig.prices[i]?.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Personal info ── */}
      <div className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 style={{ color: navy }} className="text-sm font-bold uppercase tracking-wide">
          Personal Info
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First Name" name="firstName" required error={fieldError('firstName')} maxLength={100} />
          <Field label="Last Name" name="lastName" required error={fieldError('lastName')} maxLength={100} />
        </div>
        <Field label="Phone" name="phone" type="tel" required error={fieldError('phone')} maxLength={32} />
        <Field
          label="Email Address"
          name="email"
          type="email"
          required
          error={fieldError('email')}
          hint="We'll send your receipt and account access to this address."
          maxLength={254}
        />
      </div>

      {/* ── Business info ── */}
      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 style={{ color: navy }} className="text-sm font-bold uppercase tracking-wide">
          Business Info
        </h2>
        <Field label="Business Name" name="businessName" error={fieldError('businessName')} maxLength={200} />
        <Field
          label="Business Street Address"
          name="businessStreetAddress"
          required
          error={fieldError('businessStreetAddress')}
          maxLength={200}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Town / City" name="businessTownCity" error={fieldError('businessTownCity')} maxLength={100} />
          <Field
            label="State / County"
            name="businessStateCounty"
            error={fieldError('businessStateCounty')}
            maxLength={100}
          />
        </div>
        <Field label="Website Address" name="websiteAddress" error={fieldError('websiteAddress')} maxLength={200} />
      </div>

      {state.error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        style={{ backgroundColor: gold }}
        className="mt-6 w-full text-white hover:opacity-90"
      >
        {pending ? 'Redirecting to payment…' : `Continue to Payment — ${selectedConfig.prices[interval]?.label}`}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  error,
  hint,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
      <Input id={name} name={name} type={type} required={required} maxLength={maxLength} className="mt-1" />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
