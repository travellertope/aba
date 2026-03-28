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

/** Compute a simple engagement score from available lead data. */
function computeScore(lead: LeadNode): number {
  let score = 50; // base
  if (lead.leadStatus === "qualified") score += 30;
  else if (lead.leadStatus === "contacted") score += 15;
  else if (lead.leadStatus === "new") score += 5;
  if (lead.leadEmail) score += 5;
  if (lead.leadPhone) score += 5;
  if (lead.leadNotes && lead.leadNotes.length > 50) score += 5;
  if (lead.followUpDate) score += 5;
  return Math.min(score, 100);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function capitalizeSource(source: string | null): string {
  if (!source) return "—";
  return source.charAt(0).toUpperCase() + source.slice(1);
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

  // ── Compute scores and classify ────────────────────────────

  const scoredLeads = leadNodes.map((l) => ({
    ...l,
    score: computeScore(l),
  }));

  const hotLeads = scoredLeads.filter((l) => l.score >= 90);
  const warmLeads = scoredLeads.filter((l) => l.score >= 75 && l.score < 90);
  const totalVisits = scoredLeads.length; // proxy: each lead = 1 visit
  const avgVisits = scoredLeads.length > 0
    ? (totalVisits / scoredLeads.length).toFixed(1)
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
      label: "Total Leads",
      value: scoredLeads.length.toString(),
      sub: "All statuses",
      iconKey: "Eye",
      borderColor: "border-l-blue-500",
    },
    {
      label: "Follow-ups Due",
      value: scoredLeads
        .filter((l) => l.followUpDate && new Date(l.followUpDate) <= new Date())
        .length.toString(),
      sub: "Overdue or today",
      iconKey: "CalendarDays",
      borderColor: "border-l-green-500",
    },
  ];

  // ── Build lead cards (sorted by score desc) ────────────────

  const leads: LeadCard[] = scoredLeads
    .sort((a, b) => b.score - a.score)
    .map((l) => {
      const scoreType = l.score >= 90 ? "hot" as const : "warm" as const;
      const scoreLabel = scoreType === "hot" ? "Hot Lead" : "Warm Lead";
      return {
        id: String(l.databaseId),
        initials: getInitials(l.title),
        name: l.title,
        scoreBadge: `${scoreLabel} · ${l.score}`,
        scoreType,
        company: l.leadCompany ?? "—",
        email: l.leadEmail ?? "—",
        phone: l.leadPhone ?? "—",
        visits: 1, // Single visit proxy — extend when analytics available
        lastVisit: formatDate(l.followUpDate),
        eventsAttended: 0, // Not available in current schema
        interests: l.leadSource ? [capitalizeSource(l.leadSource)] : [],
        events: [], // Not available in current schema
        notes: l.leadNotes ?? "No notes recorded.",
        callHighlighted: l.score >= 95,
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
