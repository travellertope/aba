// Homepage — Public Marketing Site
// Server Component: fetches latest events and courses for preview sections.
// Wiring step: swap placeholder arrays with real WPGraphQL data.

import { wpGraphQL } from '@/lib/graphql/client';
import { GET_EVENTS } from '@/lib/graphql/queries';
import type { EventsConnection } from '@/types';

async function getUpcomingEvents() {
  try {
    const data = await wpGraphQL<{ events: EventsConnection }>(GET_EVENTS, { first: 3 });
    return data.events.nodes;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const upcomingEvents = await getUpcomingEvents();

  return (
    <div>
      {/* Hero Section — replace with components/public/HeroSection.tsx */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Australian Business Association</h1>
        <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto">
          Connect. Learn. Grow. Your network is your net worth.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/portal/login"
            className="rounded-md bg-white text-slate-900 px-6 py-3 font-semibold hover:bg-slate-100 transition"
          >
            Member Login
          </a>
          <a
            href="/membership"
            className="rounded-md border border-white text-white px-6 py-3 font-semibold hover:bg-white/10 transition"
          >
            Join Today
          </a>
        </div>
      </section>

      {/* Upcoming Events Preview — replace with components/public/EventsPreview.tsx */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <p className="text-slate-500">No upcoming events. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <a
                key={event.id}
                href={`/events/${event.slug}`}
                className="block rounded-xl border border-slate-200 p-6 hover:shadow-md transition"
              >
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  {event.eventType ?? 'Event'} · {event.eventDate ?? 'TBA'}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{event.title}</h3>
                {event.excerpt && (
                  <p
                    className="mt-2 text-sm text-slate-600 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: event.excerpt }}
                  />
                )}
                <p className="mt-4 text-sm font-medium text-blue-600">
                  {event.eventMemberPrice != null
                    ? `From $${event.eventMemberPrice} (members)`
                    : 'View Details →'}
                </p>
              </a>
            ))}
          </div>
        )}
        <div className="mt-8">
          <a href="/events" className="text-blue-600 font-medium hover:underline">
            View all events →
          </a>
        </div>
      </section>
    </div>
  );
}
