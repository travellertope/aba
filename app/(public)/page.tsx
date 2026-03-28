// Homepage — Public Marketing Site (Step 3)
// Server Component: fetches live events and passes to HomepageUI client component.

import { wpGraphQL } from '@/lib/graphql/client';
import { GET_EVENTS } from '@/lib/graphql/queries';
import HomepageUI from '@/components/public/HomepageUI';
import type { EventsConnection } from '@/types';

async function getUpcomingEvents() {
  try {
    const data = await wpGraphQL<{ events: EventsConnection }>(GET_EVENTS, { first: 6 });
    return data.events.nodes;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const events = await getUpcomingEvents();

  return <HomepageUI events={events} />;
}
