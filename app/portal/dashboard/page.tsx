// Member Portal Dashboard — Server Component
// Auth.js v5: auth() reads the JWT session cookie server-side.
// Middleware guarantees this page is only reachable by authenticated users.

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { wpGraphQL } from '@/lib/graphql/client';
import { GET_CURRENT_USER, GET_EVENTS } from '@/lib/graphql/queries';
import type { Member, EventsConnection } from '@/types';

async function getCurrentUser(token: string): Promise<Member | null> {
  try {
    const data = await wpGraphQL<{ viewer: Member }>(GET_CURRENT_USER, {}, token);
    return data.viewer;
  } catch {
    return null;
  }
}

async function getUpcomingEvents(): Promise<EventsConnection['nodes']> {
  try {
    const data = await wpGraphQL<{ events: EventsConnection }>(GET_EVENTS, { first: 5 });
    return data.events.nodes.filter(
      (e) => !e.eventDate || new Date(e.eventDate) >= new Date(),
    );
  } catch {
    return [];
  }
}

export default async function PortalDashboardPage() {
  const session = await auth();
  if (!session) redirect('/portal/login');

  const [user, upcomingEvents] = await Promise.all([
    getCurrentUser(session.accessToken),
    getUpcomingEvents(),
  ]);

  const displayName = user?.firstName ?? session.user.name ?? 'Member';
  const tier = user?.membershipTier ?? session.user.membershipTier ?? 'free';
  const status = user?.subscriptionStatus ?? session.user.subscriptionStatus ?? 'inactive';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {displayName}</h1>
          <p className="text-sm text-slate-500 mt-1">
            <span className="capitalize">{tier}</span> Member ·{' '}
            <span className={status === 'active' ? 'text-green-600' : 'text-amber-600'}>
              {status}
            </span>
          </p>
        </div>
        <a href="/portal/profile" className="text-sm text-blue-600 hover:underline font-medium">
          Edit Profile
        </a>
      </div>

      {/* Stats — replace with components/portal/StatsGrid.tsx */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Membership Tier', value: tier },
          {
            label: 'Membership Expires',
            value: user?.membershipExpires
              ? new Date(user.membershipExpires).toLocaleDateString('en-AU')
              : '—',
          },
          { label: 'Company', value: user?.companyName ?? '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900 capitalize">{value}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Events — replace with components/portal/UpcomingEvents.tsx */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Upcoming Events</h2>
          <a href="/events" className="text-sm text-blue-600 hover:underline">
            View all
          </a>
        </div>
        <ul className="divide-y divide-slate-100">
          {upcomingEvents.length === 0 ? (
            <li className="px-6 py-8 text-center text-slate-500 text-sm">
              No upcoming events right now.
            </li>
          ) : (
            upcomingEvents.map((event) => (
              <li key={event.id} className="px-6 py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{event.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Date TBA'}{' '}
                    · {event.eventLocation ?? event.eventLink ?? 'Location TBA'}
                  </p>
                </div>
                <div className="text-right text-sm shrink-0">
                  {event.eventMemberPrice != null ? (
                    <span className="font-semibold text-slate-800">${event.eventMemberPrice}</span>
                  ) : (
                    <span className="text-slate-400">Free</span>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
