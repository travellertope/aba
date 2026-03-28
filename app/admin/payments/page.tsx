// Admin Payments Page — Server Component
// Fetches member data from WPGraphQL for tier breakdown stats.
// Transaction data will come from Stripe API when STRIPE_SECRET_KEY is configured.
// Auth + role check enforced by parent layout.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { wpGraphQL } from "@/lib/graphql/client";
import { GET_MEMBERS } from "@/lib/graphql/queries";
import PaymentsUI from "@/components/admin/PaymentsUI";
import type {
  RevenueStat,
  TierBreakdown,
  FailedPayment,
  Transaction,
} from "@/components/admin/PaymentsUI";
import type { PageInfo } from "@/types";

// ─── GraphQL response shape ──────────────────────────────────

interface MemberNode {
  id: string;
  databaseId: number;
  name: string;
  email: string;
  membershipTier: string | null;
  subscriptionStatus: string | null;
}

interface MembersResponse {
  users: {
    nodes: MemberNode[];
    pageInfo: PageInfo;
  };
}

// ─── Tier pricing config ─────────────────────────────────────

const TIER_PRICING: Record<string, { annual: number; label: string; badgeColor: string }> = {
  corporate: {
    annual: 1000,
    label: "Corporate",
    badgeColor: "bg-green-100 text-green-700 border border-green-300",
  },
  executive: {
    annual: 300,
    label: "Executive",
    badgeColor: "bg-amber-100 text-amber-700 border border-amber-300",
  },
  professional: {
    annual: 90,
    label: "Professional",
    badgeColor: "bg-blue-100 text-blue-700 border border-blue-300",
  },
};

// ─── Helpers ─────────────────────────────────────────────────

function formatGBP(pence: number): string {
  return `£${(pence / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`;
}

// ─── Page ────────────────────────────────────────────────────

export default async function AdminPaymentsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let memberNodes: MemberNode[] = [];

  try {
    const data = await wpGraphQL<MembersResponse>(
      GET_MEMBERS,
      { first: 500 },
      session.accessToken,
    );
    memberNodes = data.users.nodes;
  } catch {
    // Graceful degradation
  }

  // ── Compute tier breakdown from member data ────────────────

  const activeMembers = memberNodes.filter((m) => m.subscriptionStatus === "active");

  const tierCounts: Record<string, number> = {};
  for (const m of activeMembers) {
    const tier = m.membershipTier ?? "free";
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
  }

  const tiers: TierBreakdown[] = Object.entries(TIER_PRICING).map(
    ([key, config]) => {
      const count = tierCounts[key] ?? 0;
      return {
        name: config.label,
        badgeColor: config.badgeColor,
        activeMembers: count,
        annualRevenue: `£${(count * config.annual).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
        pricePerMember: `£${config.annual.toLocaleString("en-GB", { minimumFractionDigits: 2 })}/year`,
      };
    },
  );

  const totalAnnualRevenue = Object.entries(TIER_PRICING).reduce(
    (sum, [key, config]) => sum + (tierCounts[key] ?? 0) * config.annual,
    0,
  );

  // ── Revenue stats ──────────────────────────────────────────
  // TODO: Replace with real Stripe data when STRIPE_SECRET_KEY is configured

  const stats: RevenueStat[] = [
    {
      label: "Total Revenue",
      value: `£${totalAnnualRevenue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
      sub: `${activeMembers.length} active subscriptions`,
      subColor: "text-green-600",
      iconKey: "PoundSterling",
      iconColor: "text-amber-500",
      borderColor: "border-l-green-500",
    },
    {
      label: "Annual Recurring",
      value: `£${totalAnnualRevenue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
      sub: `${activeMembers.length} active`,
      subColor: "text-blue-600",
      iconKey: "RefreshCw",
      iconColor: "text-blue-500",
      borderColor: "border-l-blue-500",
    },
    {
      label: "Total Members",
      value: memberNodes.length.toString(),
      sub: `${activeMembers.length} active`,
      subColor: "text-gray-500",
      iconKey: "CheckCircle2",
      iconColor: "text-green-500",
      borderColor: "border-l-green-500",
    },
    {
      label: "Inactive / Cancelled",
      value: (memberNodes.length - activeMembers.length).toString(),
      sub: "Require follow-up",
      subColor: "text-red-500",
      iconKey: "AlertCircle",
      iconColor: "text-red-500",
      borderColor: "border-l-red-500",
    },
  ];

  // ── Failed payments & transactions ─────────────────────────
  // TODO: Fetch from Stripe API. For now, pass empty arrays so the UI
  // renders correctly with empty states once Stripe is connected.

  const failedPayments: FailedPayment[] = [];
  const transactions: Transaction[] = [];

  return (
    <PaymentsUI
      stats={stats}
      tiers={tiers}
      failedPayments={failedPayments}
      transactions={transactions}
      totalTransactions={transactions.length}
    />
  );
}
