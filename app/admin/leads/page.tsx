// Admin Warm Leads Page — Server Component
// Fetches warm leads from WPGraphQL and maps them to WarmLeadsUI props.
// Auth + role check enforced by parent layout.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { wpGraphQL } from "@/lib/graphql/client";
import { GET_WARM_LEADS } from "@/lib/graphql/queries";
import WarmLeadsUI from "@/components/admin/WarmLeadsUI";
import type { LeadStat, LeadCard } from "@/components/admin/WarmLeadsUI";
import type { PageInfo } from "@/types";

// ─── GraphQL response shape ──────────────────────────────────

interface LeadNode {
  id: string;
  databaseId: number;
  title: string;
  leadSource: string | null;
  leadStatus: string | null;
  leadNotes: string | null;
  leadEmail: string | null;
  leadPhone: string | null;
  leadCompany: string | null;
  assignedTo: number | null;
  followUpDate: string | null;
  leadScore: number | null;
  leadVisits: number | null;
  leadEventsAttended: number | null;
  leadInterests: string[] | null;
}

interface WarmLeadsResponse {
  warmLeads: {
    nodes: LeadNode[];
    pageInfo: PageInfo;
  };
}

// ─── Helpers ─────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Page ────────────────────────────────────────────────────

export default async function AdminLeadsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let leadNodes: LeadNode[] = [];

  try {
    const data = await wpGraphQL<WarmLeadsResponse>(
      GET_WARM_LEADS,
      { first: 100 },
      session.accessToken,
    );
    leadNodes = data.warmLeads.nodes;
  } catch {
    // Graceful degradation — renders empty state
  }

  // ── Classify leads by score ────────────────────────────────

  const hotLeads = leadNodes.filter((l) => (l.leadScore ?? 0) >= 90);
  const warmLeads = leadNodes.filter((l) => {
    const s = l.leadScore ?? 0;
    return s >= 75 && s < 90;
  });

  const totalVisits = leadNodes.reduce((sum, l) => sum + (l.leadVisits ?? 0), 0);
  const avgVisits = leadNodes.length > 0
    ? (totalVisits / leadNodes.length).toFixed(1)
    : "0";

  // ── Build stats ────────────────────────────────────────────

  const stats: LeadStat[] = [
    {
      label: "Hot Leads",
      value: hotLeads.length.toString(),
      sub: "Score ≥ 90",
      iconKey: "TrendingUp",
      borderColor: "border-l-red-500",
    },
    {
      label: "Warm Leads",
      value: warmLeads.length.toString(),
      sub: "Score 75–89",
      iconKey: "TrendingUp",
      borderColor: "border-l-amber-500",
    },
    {
      label: "Total Visits",
      value: totalVisits.toString(),
      sub: "Across all leads",
      iconKey: "Eye",
      borderColor: "border-l-blue-500",
    },
    {
      label: "Avg. Visits",
      value: avgVisits,
      sub: "Per lead",
      iconKey: "CalendarDays",
      borderColor: "border-l-green-500",
    },
  ];

  // ── Build lead cards (sorted by score desc) ────────────────

  const leads: LeadCard[] = leadNodes
    .sort((a, b) => (b.leadScore ?? 0) - (a.leadScore ?? 0))
    .map((l) => {
      const score = l.leadScore ?? 0;
      const scoreType = score >= 90 ? "hot" as const : "warm" as const;
      const scoreLabel = scoreType === "hot" ? "Hot Lead" : "Warm Lead";
      return {
        id: String(l.databaseId),
        initials: getInitials(l.title),
        name: l.title,
        scoreBadge: `${scoreLabel} · ${score}`,
        scoreType,
        company: l.leadCompany ?? "—",
        email: l.leadEmail ?? "—",
        phone: l.leadPhone ?? "—",
        visits: l.leadVisits ?? 0,
        lastVisit: formatDate(l.followUpDate),
        eventsAttended: l.leadEventsAttended ?? 0,
        interests: l.leadInterests ?? [],
        events: [], // Event names not stored on lead — extend when event attendance tracking is added
        notes: l.leadNotes ?? "No notes recorded.",
        callHighlighted: score >= 95,
      };
    });

  return (
    <WarmLeadsUI
      stats={stats}
      leads={leads}
      totalCount={leads.length}
    />
  );
}
