// Admin Event Management Page — Server Component
// Fetches events from WPGraphQL, splits into upcoming/past, and computes stats.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { wpGraphQL } from "@/lib/graphql/client";
import { GET_EVENTS } from "@/lib/graphql/queries";
import EventsUI from "@/components/admin/EventsUI";
import type {
  EventStat,
  UpcomingEvent,
  PastEvent,
} from "@/components/admin/EventsUI";
import type { PageInfo } from "@/types";

// ─── GraphQL response shape ──────────────────────────────────

interface EventNode {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  eventDate: string | null;
  eventEndDate: string | null;
  eventLocation: string | null;
  eventMemberPrice: number | null;
  eventNonMemberPrice: number | null;
  eventCapacity: number | null;
  eventSpotsRemaining: number | null;
  eventType: string | null;
}

interface EventsResponse {
  events: { nodes: EventNode[]; pageInfo: PageInfo };
}

// ─── Helpers ─────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string | null, endStr: string | null): string {
  if (!dateStr) return "—";
  const start = new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (!endStr) return start;
  const end = new Date(endStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${start} – ${end}`;
}

function formatCurrency(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}

function daysFromNow(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function eventStatusLabel(
  capacity: number,
  remaining: number,
  isUpcoming: boolean,
): { status: string; statusColor: string } {
  if (!isUpcoming) {
    return {
      status: "Completed",
      statusColor: "bg-gray-100 text-gray-600 border border-gray-300",
    };
  }
  const pct = capacity > 0 ? ((capacity - remaining) / capacity) * 100 : 0;
  if (pct >= 90) {
    return {
      status: "Almost Full",
      statusColor: "bg-amber-100 text-amber-700 border border-amber-300",
    };
  }
  return {
    status: "On Sale",
    statusColor: "bg-green-100 text-green-700 border border-green-300",
  };
}

// ─── Page ────────────────────────────────────────────────────

export default async function AdminEventsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let eventNodes: EventNode[] = [];

  try {
    const data = await wpGraphQL<EventsResponse>(
      GET_EVENTS,
      { first: 100 },
      session.accessToken,
    );
    eventNodes = data.events.nodes;
  } catch {
    // Graceful degradation
  }

  const now = new Date();

  const upcoming = eventNodes
    .filter((e) => e.eventDate && new Date(e.eventDate) > now)
    .sort(
      (a, b) =>
        new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime(),
    );

  const past = eventNodes
    .filter((e) => e.eventDate && new Date(e.eventDate) <= now)
    .sort(
      (a, b) =>
        new Date(b.eventDate!).getTime() - new Date(a.eventDate!).getTime(),
    );

  // ── Stats ──────────────────────────────────────────────────

  const totalRegistrations = eventNodes.reduce((sum, e) => {
    const cap = e.eventCapacity ?? 0;
    const remaining = e.eventSpotsRemaining ?? cap;
    return sum + (cap - remaining);
  }, 0);

  const completedWithCap = past.filter((e) => (e.eventCapacity ?? 0) > 0);
  const avgAttendance =
    completedWithCap.length > 0
      ? Math.round(
          completedWithCap.reduce((sum, e) => {
            const cap = e.eventCapacity!;
            const remaining = e.eventSpotsRemaining ?? cap;
            return sum + ((cap - remaining) / cap) * 100;
          }, 0) / completedWithCap.length,
        )
      : 0;

  const stats: EventStat[] = [
    {
      label: "Total Events",
      value: eventNodes.length.toString(),
      sub: "Year to date",
      iconKey: "Calendar",
      iconColor: "text-blue-500",
      borderColor: "border-l-blue-500",
    },
    {
      label: "Upcoming",
      value: upcoming.length.toString(),
      sub: "Scheduled",
      iconKey: "CalendarDays",
      iconColor: "text-amber-500",
      borderColor: "border-l-amber-500",
    },
    {
      label: "Total Registrations",
      value: totalRegistrations.toLocaleString("en-GB"),
      sub: "Across all events",
      iconKey: "Users",
      iconColor: "text-green-500",
      borderColor: "border-l-green-500",
    },
    {
      label: "Avg Attendance",
      value: `${avgAttendance}%`,
      sub: "Completed events",
      iconKey: "TrendingUp",
      iconColor: "text-purple-500",
      borderColor: "border-l-purple-500",
    },
  ];

  // ── Upcoming Events ────────────────────────────────────────

  const upcomingEvents: UpcomingEvent[] = upcoming.map((e) => {
    const cap = e.eventCapacity ?? 0;
    const remaining = e.eventSpotsRemaining ?? cap;
    const registered = cap - remaining;
    const price = e.eventMemberPrice ?? 0;
    const { status, statusColor } = eventStatusLabel(cap, remaining, true);

    return {
      name: e.title,
      date: formatDate(e.eventDate),
      time: formatTime(e.eventDate, e.eventEndDate),
      venue: e.eventLocation ?? "TBA",
      registered,
      capacity: cap,
      revenue: formatCurrency(registered * price),
      status,
      statusColor,
      daysAway: daysFromNow(e.eventDate!),
      tierBreakdown: [],
      // TODO: Tier breakdown requires per-event registration tracking.
      //       Currently empty — will populate when ticket/registration system is built.
    };
  });

  // ── Past Events ────────────────────────────────────────────

  const pastEventsData: PastEvent[] = past.map((e) => {
    const cap = e.eventCapacity ?? 0;
    const remaining = e.eventSpotsRemaining ?? cap;
    const registered = cap - remaining;
    const attended = registered; // Approximation — no separate attendance tracking yet
    const rate = cap > 0 ? Math.round((attended / cap) * 100) : 0;
    const price = e.eventMemberPrice ?? 0;

    return {
      name: e.title,
      date: formatDate(e.eventDate),
      venue: e.eventLocation ?? "—",
      registered,
      attended,
      attendanceRate: cap > 0 ? `${rate}%` : "—",
      rateColor: rate >= 85 ? "text-green-600" : rate >= 70 ? "text-amber-600" : "text-red-500",
      revenue: formatCurrency(registered * price),
      status: "Completed",
      statusColor: "bg-gray-100 text-gray-600 border border-gray-300",
    };
  });

  return (
    <EventsUI
      stats={stats}
      upcomingEvents={upcomingEvents}
      pastEvents={pastEventsData}
      totalPastEvents={pastEventsData.length}
    />
  );
}
