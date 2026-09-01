import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { openBillingPortal, signOut } from './actions';
import { TIER_CONFIG } from '@/lib/stripe/plans';
import type { PayMembershipStatus } from '@/types/pay';

const navy = '#1a2340';

const STATUS_STYLES: Record<PayMembershipStatus, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  past_due: 'bg-red-100 text-red-800',
  cancelled: 'bg-slate-100 text-slate-600',
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  if (!member) redirect('/login');

  const { data: payments } = await supabase
    .from('payment_history')
    .select('*')
    .eq('member_id', member.id)
    .order('paid_at', { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 style={{ color: navy }} className="text-2xl font-bold">
          Welcome, {member.first_name}
        </h1>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Membership</CardTitle>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[member.membership_status as PayMembershipStatus]}`}
          >
            {member.membership_status.replace('_', ' ')}
          </span>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">Tier:</span>{' '}
            {TIER_CONFIG[member.membership_tier as keyof typeof TIER_CONFIG]?.name ?? member.membership_tier}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Billing:</span> {member.billing_interval}
          </p>
          {member.membership_expires_at && (
            <p>
              <span className="font-semibold text-slate-900">Renews / expires:</span>{' '}
              {new Date(member.membership_expires_at).toLocaleDateString('en-GB')}
            </p>
          )}
          <form action={openBillingPortal} className="pt-3">
            <Button type="submit" size="sm">
              Manage billing &amp; card details
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-900">Name:</span> {member.first_name} {member.last_name}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Email:</span> {member.email}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Phone:</span> {member.phone}
          </p>
          {member.business_name && (
            <p>
              <span className="font-semibold text-slate-900">Business:</span> {member.business_name}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {!payments || payments.length === 0 ? (
            <p className="text-sm text-slate-500">No payments recorded yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                  <th className="py-2">Date</th>
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Amount</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="py-2">
                      {p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td className="py-2">{p.description ?? '—'}</td>
                    <td className="py-2 text-right">£{(p.amount_pence / 100).toFixed(2)}</td>
                    <td className="py-2 text-right capitalize">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
