// Admin Members Page — Server Component
// Fetches the full member list from WPGraphQL and maps it to the MembersUI props.
// Auth + role check enforced by parent layout.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { wpGraphQL } from "@/lib/graphql/client";
import { GET_MEMBERS } from "@/lib/graphql/queries";
import MembersUI from "@/components/admin/MembersUI";
import type { MemberRow } from "@/components/admin/MembersUI";
import type { PageInfo } from "@/types";

// ─── GraphQL response shape ──────────────────────────────────

interface MemberNode {
  id: string;
  databaseId: number;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  companyName: string | null;
  membershipTier: string | null;
  subscriptionStatus: string | null;
  membershipExpires: string | null;
  abaRole: string | null;
  avatar: { url: string } | null;
}

interface MembersResponse {
  users: {
    nodes: MemberNode[];
    pageInfo: PageInfo;
  };
}

// ─── Helpers ─────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
  executive: "bg-amber-100 text-amber-700 border border-amber-300",
  professional: "bg-blue-100 text-blue-700 border border-blue-300",
  corporate: "bg-orange-100 text-orange-700 border border-orange-300",
  free: "bg-gray-100 text-gray-600 border border-gray-300",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700 border border-green-300",
  inactive: "bg-gray-100 text-gray-500 border border-gray-300",
  cancelled: "bg-red-100 text-red-700 border border-red-300",
  trialing: "bg-purple-100 text-purple-700 border border-purple-300",
};

function getInitials(name: string, firstName?: string, lastName?: string): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatJoinDate(expiresStr: string | null): string {
  if (!expiresStr) return "—";
  // Use membershipExpires as best available date indicator
  const date = new Date(expiresStr);
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Page ────────────────────────────────────────────────────

export default async function AdminMembersPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let memberNodes: MemberNode[] = [];

  try {
    const data = await wpGraphQL<MembersResponse>(
      GET_MEMBERS,
      { first: 100 },
      session.accessToken,
    );
    memberNodes = data.users.nodes;
  } catch {
    // Graceful degradation — renders empty state
  }

  const members: MemberRow[] = memberNodes.map((m) => {
    const tier = m.membershipTier ?? "free";
    const status = m.subscriptionStatus ?? "inactive";

    return {
      id: String(m.databaseId),
      initials: getInitials(m.name, m.firstName, m.lastName),
      name: m.name,
      email: m.email,
      phone: m.phone ?? "—",
      company: m.companyName ?? "—",
      tier: capitalize(tier),
      tierColor: TIER_COLORS[tier] ?? TIER_COLORS.free,
      status: capitalize(status),
      statusColor: STATUS_COLORS[status] ?? STATUS_COLORS.inactive,
      joined: formatJoinDate(m.membershipExpires),
    };
  });

  return <MembersUI members={members} totalCount={members.length} />;
}
