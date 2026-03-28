// Events listing page — Public
// Server Component: fetches all events from WPGraphQL.

import { wpGraphQL } from '@/lib/graphql/client';
import { GET_EVENTS } from '@/lib/graphql/queries';
import type { Event, EventsConnection } from '@/types';

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getEvents(): Promise<Event[]> {
  try {
    const data = await wpGraphQL<{ events: EventsConnection }>(GET_EVENTS, { first: 50 });
    return data.events.nodes;
  } catch (err) {
    console.error('Failed to fetch events:', err);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900">Events</h1>
        <p className="mt-2 text-slate-600">
          Workshops, networking nights, and industry conferences — all in one place.
        </p>
      </div>

      {/* Replace this section with components/public/EventsGrid.tsx once available */}
      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-16 text-center text-slate-500">
          <p className="text-lg font-medium">No events at the moment.</p>
          <p className="mt-1 text-sm">Check back soon — we're always planning something.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

// Inline card — will be extracted to components/public/EventCard.tsx in Step 3
function EventCard({ event }: { event: Event }) {
  const isPast = event.eventDate ? new Date(event.eventDate) < new Date() : false;

  return (
    <a
      href={`/events/${event.slug}`}
      className={`block rounded-xl border p-6 hover:shadow-md transition ${
        isPast ? 'opacity-60 border-slate-200' : 'border-slate-200 hover:border-blue-200'
      }`}
    >
      {event.featuredImage && (
        <img
          src={event.featuredImage.node.sourceUrl}
          alt={event.featuredImage.node.altText}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}

      <div className="flex items-center gap-2 mb-2">
        {event.eventType && (
          <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">
            {event.eventType}
          </span>
        )}
        {isPast && (
          <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            Past
          </span>
        )}
      </div>

      <h2 className="text-lg font-semibold text-slate-900 line-clamp-2">{event.title}</h2>

      {event.eventDate && (
        <p className="mt-1 text-sm text-slate-500">
          {new Date(event.eventDate).toLocaleDateString('en-AU', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      )}

      {event.eventLocation && (
        <p className="mt-1 text-sm text-slate-500 truncate">{event.eventLocation}</p>
      )}

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-sm">
          {event.eventMemberPrice != null ? (
            <>
              <span className="font-semibold text-slate-800">${event.eventMemberPrice}</span>
              <span className="text-slate-400"> members</span>
            </>
          ) : (
            <span className="text-slate-400">Free</span>
          )}
        </div>
        {event.eventSpotsRemaining != null && event.eventSpotsRemaining <= 10 && (
          <span className="text-xs text-amber-600 font-medium">
            {event.eventSpotsRemaining} spots left
          </span>
        )}
      </div>
    </a>
  );
}
