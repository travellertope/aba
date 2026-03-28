// Member Portal Dashboard — Server Component
// Fetches the current authenticated user's data from WPGraphQL.
// Protected by middleware.ts (Step 4) — unauthenticated users are redirected to /portal/login.
// In Step 3: replace the inline UI with components/portal/DashboardUI.tsx from v0.dev.

import { GET_CURRENT_USER, GET_EVENTS } from '@/lib/graphql/queries';
import { wpGraphQL } from '@/lib/graphql/client';
import type { Member, EventsConnection } from '@/types';

// Step 4: replace with getServerSession(authOptions)
async function getCurrentUser(token?: string): Promise<Member | null> {
  try {
    const data = await wpGraphQL<{ viewer: Member }>(GET_CURRENT_USER, {}, token);
    return data.viewer;
  } catch {
    return null;
  }
}

async function getUpcomingEvents() {
  try {
    const data = await wpGraphQL<{ events: EventsConnection }>(GET_EVENTS, { first: 5 });
    return data.events.nodes;
  } catch {
    return [];
  }
}

export default async function PortalDashboardPage() {
  // Step 4: const session = await getServerSession(authOptions);
  // const token = session?.accessToken;
  const token = undefined;

  const [user, upcomingEvents] = await Promise.all([
    getCurrentUser(token),
    getUpcomingEvents(),
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {user?.membershipTier
              ? `${user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1)} Member`
              : 'ABA Member'}{' '}
            ·{' '}
            <span
              className={
                user?.subscriptionStatus === 'active' ? 'text-green-600' : 'text-amber-600'
              }
            >
              {user?.subscriptionStatus ?? 'Status unknown'}
            </span>
          </p>
        </div>
        <a
          href="/portal/profile"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Edit Profile
        </a>
      </div>

      {/* Stats cards — replace with components/portal/StatsGrid.tsx */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Membership Tier', value: user?.membershipTier ?? '—' },
          { label: 'Membership Expires', value: user?.membershipExpires ?? '—' },
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
