// Admin CRM Dashboard — Server Component
// Fetches real data from WPGraphQL and passes it to the CRMDashboardUI component.
// Auth is enforced by the parent layout.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { wpGraphQL } from "@/lib/graphql/client";
import { GET_DASHBOARD_SUMMARY } from "@/lib/graphql/queries";
import CRMDashboardUI from "@/components/admin/CRMDashboardUI";
import type { DashboardStat, DashboardAlert, RecentMember, UpcomingEvent } from "@/components/admin/CRMDashboardUI";
import { Users, CalendarDays, PoundSterling, TrendingUp } from "lucide-react";
import type { PageInfo } from "@/types";

// ─── GraphQL response shape ──────────────────────────────────

interface DashboardMember {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  membershipTier: string | null;
  subscriptionStatus: string | null;
  membershipExpires: string | null;
}

interface DashboardEvent {
  id: string;
  title: string;
  eventDate: string | null;
  eventCapacity: number | null;
  eventSpotsRemaining: number | null;
}

interface DashboardLead {
  id: string;
  title: string;
  leadStatus: string | null;
}

interface DashboardSummaryResponse {
  users: { nodes: DashboardMember[]; pageInfo: PageInfo };
  events: { nodes: DashboardEvent[]; pageInfo: PageInfo };
  warmLeads: { nodes: DashboardLead[]; pageInfo: PageInfo };
}

// ─── Helpers ─────────────────────────────────────────────────

const TIER_BADGE_COLORS: Record<string, string> = {
  executive: "bg-green-100 text-green-700 border border-green-300",
  professional: "bg-amber-100 text-amber-700 border border-amber-300",
  corporate: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  free: "bg-gray-100 text-gray-600 border border-gray-300",
};

function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Page ────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) redirect("/portal/login");

  // Fetch all dashboard data in a single GraphQL request
  let members: DashboardMember[] = [];
  let events: DashboardEvent[] = [];
  let leads: DashboardLead[] = [];

  try {
    const data = await wpGraphQL<DashboardSummaryResponse>(
      GET_DASHBOARD_SUMMARY,
      {},
      session.accessToken,
    );
    members = data.users.nodes;
    events = data.events.nodes;
    leads = data.warmLeads.nodes;
  } catch {
    // Graceful degradation — dashboard renders with empty state
  }

  // ── Compute stats ──────────────────────────────────────────

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const activeMembers = members.filter((m) => m.subscriptionStatus === "active").length;

  const upcomingEvents = events.filter(
    (e) => e.eventDate && new Date(e.eventDate) >= now,
  );

  // Members whose membership expires within 30 days
  const expiringThisMonth = members.filter((m) => {
    if (!m.membershipExpires) return false;
    const expDate = new Date(m.membershipExpires);
    const daysUntil = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntil >= 0 && daysUntil <= 30;
  });

  const newLeads = leads.filter((l) => l.leadStatus === "new").length;

  // ── Build props ────────────────────────────────────────────

  const stats: DashboardStat[] = [
    {
      label: "Total Members",
      value: members.length.toString(),
      change: `${activeMembers} active`,
      icon: Users,
      iconBg: "bg-blue-900",
      iconColor: "text-amber-400",
    },
    {
      label: "Upcoming Events",
      value: upcomingEvents.length.toString(),
      change: `${events.length} total`,
      icon: CalendarDays,
      iconBg: "bg-green-600",
      iconColor: "text-white",
    },
    {
      label: "Warm Leads",
      value: leads.length.toString(),
      change: `${newLeads} new`,
      icon: PoundSterling,
      iconBg: "bg-amber-500",
      iconColor: "text-white",
    },
    {
      label: "Attendance Rate",
      value: `${activeMembers > 0 ? Math.round((activeMembers / members.length) * 100) : 0}%`,
      change: "Active member ratio",
      icon: TrendingUp,
      iconBg: "bg-purple-500",
      iconColor: "text-white",
    },
  ];

  const alerts: DashboardAlert[] = [];

  if (expiringThisMonth.length > 0) {
    alerts.push({
      text: `${expiringThisMonth.length} membership${expiringThisMonth.length === 1 ? "" : "s"} expiring within 30 days`,
      borderColor: "border-l-amber-500",
      bgColor: "bg-amber-50",
    });
  }

  // Find events nearing capacity (>= 80% full)
  for (const event of upcomingEvents) {
    if (event.eventCapacity && event.eventSpotsRemaining != null) {
      const registered = event.eventCapacity - event.eventSpotsRemaining;
      const pct = Math.round((registered / event.eventCapacity) * 100);
      if (pct >= 80) {
        alerts.push({
          text: `${event.title} ${pct}% capacity`,
          borderColor: "border-l-blue-500",
          bgColor: "bg-blue-50",
        });
      }
    }
  }

  if (newLeads > 0) {
    alerts.push({
      text: `${newLeads} new warm lead${newLeads === 1 ? "" : "s"} awaiting follow-up`,
      borderColor: "border-l-yellow-400",
      bgColor: "bg-yellow-50",
    });
  }

  // Recent members — last 5 sorted by expiry date as a proxy for recency
  const recentMembers: RecentMember[] = members
    .filter((m) => m.membershipExpires)
    .sort(
      (a, b) =>
        new Date(b.membershipExpires!).getTime() -
        new Date(a.membershipExpires!).getTime(),
    )
    .slice(0, 5)
    .map((m) => {
      const tier = m.membershipTier ?? "free";
      const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
      return {
        name: m.name,
        company: m.companyName ?? "—",
        badge: tierLabel,
        badgeColor: TIER_BADGE_COLORS[tier] ?? TIER_BADGE_COLORS.free,
        time: m.membershipExpires ? formatRelativeTime(m.membershipExpires) : "—",
      };
    });

  // Upcoming events — next 3
  const upcomingEventProps: UpcomingEvent[] = upcomingEvents
    .sort(
      (a, b) =>
        new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime(),
    )
    .slice(0, 3)
    .map((e) => {
      const capacity = e.eventCapacity ?? 0;
      const remaining = e.eventSpotsRemaining ?? capacity;
      const registered = capacity - remaining;
      return {
        name: e.title,
        date: e.eventDate ? formatEventDate(e.eventDate) : "TBC",
        registered: Math.max(0, registered),
        total: capacity,
      };
    });

  return (
    <CRMDashboardUI
      stats={stats}
      alerts={alerts}
      recentMembers={recentMembers}
      upcomingEvents={upcomingEventProps}
    />
  );
}
