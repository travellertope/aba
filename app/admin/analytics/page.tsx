// Admin Analytics & Reports Page — Server Component
// Fetches members + events from WPGraphQL and computes analytics.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { wpGraphQL } from "@/lib/graphql/client";
import { GET_DASHBOARD_SUMMARY, GET_EVENTS } from "@/lib/graphql/queries";
import AnalyticsUI from "@/components/admin/AnalyticsUI";
import type {
  HeroStat,
  TierBreakdown,
  GrowthMonth,
  EventPerformanceRow,
} from "@/components/admin/AnalyticsUI";
import type { PageInfo } from "@/types";

// ─── GraphQL response shapes ─────────────────────────────────

interface MemberNode {
  id: string;
  name: string;
  email: string;
  membershipTier: string | null;
  subscriptionStatus: string | null;
  membershipExpires: string | null;
}

interface EventNode {
  id: string;
  databaseId: number;
  title: string;
  eventDate: string | null;
  eventCapacity: number | null;
  eventSpotsRemaining: number | null;
  eventMemberPrice: number | null;
  eventNonMemberPrice: number | null;
}

interface SummaryResponse {
  users: { nodes: MemberNode[]; pageInfo: PageInfo };
  events: { nodes: { id: string; title: string; eventDate: string | null; eventCapacity: number | null; eventSpotsRemaining: number | null }[] };
  warmLeads: { nodes: { id: string }[] };
}

interface EventsResponse {
  events: { nodes: EventNode[]; pageInfo: PageInfo };
}

// ─── Helpers ─────────────────────────────────────────────────

const TIER_PRICES: Record<string, number> = {
  corporate: 1000,
  executive: 300,
  professional: 90,
};

function formatCurrency(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "short" });
}

// ─── Page ────────────────────────────────────────────────────

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let members: MemberNode[] = [];
  let events: EventNode[] = [];

  try {
    const [summaryData, eventsData] = await Promise.all([
      wpGraphQL<SummaryResponse>(GET_DASHBOARD_SUMMARY, {}, session.accessToken),
      wpGraphQL<EventsResponse>(GET_EVENTS, { first: 50 }, session.accessToken),
    ]);
    members = summaryData.users.nodes;
    events = eventsData.events.nodes;
  } catch {
    // Graceful degradation — renders empty/zero state
  }

  const activeMembers = members.filter(
    (m) => m.subscriptionStatus?.toLowerCase() === "active",
  );

  // ── Hero Stats ─────────────────────────────────────────────

  const totalRevenue = activeMembers.reduce((sum, m) => {
    const tier = (m.membershipTier ?? "").toLowerCase();
    return sum + (TIER_PRICES[tier] ?? 0);
  }, 0);

  const now = new Date();
  const ytdEvents = events.filter((e) => {
    if (!e.eventDate) return false;
    const d = new Date(e.eventDate);
    return d.getFullYear() === now.getFullYear();
  });

  const avgAttendance =
    ytdEvents.length > 0
      ? Math.round(
          ytdEvents.reduce((sum, e) => {
            const cap = e.eventCapacity ?? 0;
            const remaining = e.eventSpotsRemaining ?? 0;
            const attended = cap > 0 ? cap - remaining : 0;
            return sum + (cap > 0 ? (attended / cap) * 100 : 0);
          }, 0) / ytdEvents.length,
        )
      : 0;

  const heroStats: HeroStat[] = [
    {
      label: "Total Members",
      value: members.length.toString(),
      sub: `${activeMembers.length} active`,
      iconKey: "Users",
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      label: "Annual Revenue",
      value: formatCurrency(totalRevenue),
      sub: "From memberships",
      iconKey: "PoundSterling",
      bg: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      label: "Events (YTD)",
      value: ytdEvents.length.toString(),
      sub: `${avgAttendance}% avg attendance`,
      iconKey: "CalendarDays",
      bg: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      label: "Growth Rate",
      value: "—",
      sub: "Historical data needed",
      iconKey: "TrendingUp",
      bg: "bg-gradient-to-br from-gray-700 to-gray-900",
    },
  ];

  // ── Membership Breakdown ───────────────────────────────────

  const tierCounts: Record<string, { members: number; revenue: number }> = {};
  for (const m of activeMembers) {
    const tier = (m.membershipTier ?? "unknown").toLowerCase();
    if (!tierCounts[tier]) tierCounts[tier] = { members: 0, revenue: 0 };
    tierCounts[tier].members += 1;
    tierCounts[tier].revenue += TIER_PRICES[tier] ?? 0;
  }

  const tierOrder = ["corporate", "executive", "professional"];
  const totalActive = activeMembers.length || 1;

  const membershipBreakdown: TierBreakdown[] = tierOrder
    .filter((t) => tierCounts[t])
    .map((t) => {
      const data = tierCounts[t];
      const pct = Math.round((data.members / totalActive) * 100);
      return {
        tier: t.charAt(0).toUpperCase() + t.slice(1),
        members: data.members,
        revenue: formatCurrency(data.revenue),
        pct,
        barWidth: pct,
        barColor: t === "professional" ? "bg-blue-500" : "bg-amber-500",
      };
    });

  // ── Member Growth (last 6 months) ──────────────────────────
  // Uses membership expiry dates as a proxy for join dates.
  // TODO: Replace with actual join-date tracking when available.

  const growthMonths: GrowthMonth[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const cutoff = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const count = members.filter((m) => {
      if (!m.membershipExpires) return true;
      return new Date(m.membershipExpires) >= cutoff;
    }).length;
    growthMonths.push({
      month: monthLabel(d),
      value: count,
      pct: 0,
    });
  }
  const maxGrowth = Math.max(...growthMonths.map((g) => g.value), 1);
  for (const g of growthMonths) {
    g.pct = Math.round((g.value / maxGrowth) * 100);
  }

  // ── Event Performance ──────────────────────────────────────

  const sortedEvents = [...events]
    .filter((e) => e.eventDate)
    .sort(
      (a, b) =>
        new Date(b.eventDate!).getTime() - new Date(a.eventDate!).getTime(),
    )
    .slice(0, 10);

  const eventPerformance: EventPerformanceRow[] = sortedEvents.map((e) => {
    const cap = e.eventCapacity ?? 0;
    const remaining = e.eventSpotsRemaining ?? cap;
    const registered = cap > 0 ? cap - remaining : 0;
    const upcoming = e.eventDate ? new Date(e.eventDate) > now : false;
    const attended = upcoming ? "Upcoming" : registered.toString();
    const rate =
      !upcoming && cap > 0
        ? `${Math.round((registered / cap) * 100)}%`
        : "-";
    const rateColor =
      !upcoming && cap > 0 && registered / cap >= 0.8
        ? "text-green-600"
        : !upcoming && cap > 0
          ? "text-amber-500"
          : "";

    const price = e.eventMemberPrice ?? 0;
    const revenue = upcoming ? formatCurrency(registered * price) : formatCurrency(registered * price);

    return {
      event: e.title,
      registered,
      attended,
      attendanceRate: rate,
      rateColor,
      revenue,
    };
  });

  return (
    <AnalyticsUI
      heroStats={heroStats}
      membershipBreakdown={membershipBreakdown}
      totalRevenue={formatCurrency(totalRevenue)}
      memberGrowth={growthMonths}
      eventPerformance={eventPerformance}
    />
  );
}
