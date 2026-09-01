'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { sendMagicLink, type LoginActionState } from '@/app/(pay)/login/actions';

const gold = '#d4a843';

const initialState: LoginActionState = { error: null, sent: false };

export default function LoginForm({ defaultEmail }: { defaultEmail?: string }) {
  const [state, formAction, pending] = useActionState(sendMagicLink, initialState);

  if (state.sent) {
    return (
      <p className="text-sm text-slate-600">
        If that email has an active membership, we&apos;ve sent a login link to it. Check your inbox.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-xs font-semibold text-slate-700">
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          defaultValue={defaultEmail}
          className="mt-1"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button
        type="submit"
        disabled={pending}
        style={{ backgroundColor: gold }}
        className="w-full text-white hover:opacity-90"
      >
        {pending ? 'Sending…' : 'Email me a login link'}
      </Button>
    </form>
  );
}
