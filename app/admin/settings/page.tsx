// Admin Panel Page — Server Component
// Fetches WP users with admin/staff roles and maps to AdminPanelUI props.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { wpGraphQL } from "@/lib/graphql/client";
import { GET_MEMBERS } from "@/lib/graphql/queries";
import AdminPanelUI from "@/components/admin/AdminPanelUI";
import type {
  AdminStat,
  AdminUser,
  SecurityAlert,
} from "@/components/admin/AdminPanelUI";
import type { PageInfo } from "@/types";

// ─── GraphQL response shape ──────────────────────────────────

interface UserNode {
  id: string;
  databaseId: number;
  name: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  abaRole: string | null;
  phone: string | null;
  membershipTier: string | null;
  subscriptionStatus: string | null;
}

interface MembersResponse {
  users: { nodes: UserNode[]; pageInfo: PageInfo };
}

// ─── Helpers ─────────────────────────────────────────────────

function initials(firstName: string | null, lastName: string | null, name: string): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function roleLabel(abaRole: string | null): string {
  switch (abaRole) {
    case "administrator":
      return "Super Admin";
    case "aba_manager":
      return "Manager";
    case "aba_staff":
      return "Staff";
    case "aba_corporate":
      return "Corporate";
    case "aba_executive":
      return "Executive";
    case "aba_professional":
      return "Professional";
    case "aba_free_member":
      return "Free Member";
    case "editor":
      return "Editor";
    case "author":
      return "Author";
    case "subscriber":
      return "Subscriber";
    default:
      return abaRole ?? "User";
  }
}

function roleColor(abaRole: string | null): string {
  switch (abaRole) {
    case "administrator":
      return "bg-red-500 text-white";
    case "aba_manager":
      return "bg-blue-600 text-white";
    case "aba_staff":
      return "bg-amber-500 text-white";
    case "aba_corporate":
      return "bg-purple-600 text-white";
    case "aba_executive":
      return "bg-indigo-500 text-white";
    case "aba_professional":
      return "bg-teal-500 text-white";
    case "aba_free_member":
      return "bg-gray-400 text-white";
    case "editor":
      return "bg-green-600 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

function rolePermissions(abaRole: string | null): string[] {
  switch (abaRole) {
    case "administrator":
      return ["Full Access", "User Management"];
    case "aba_manager":
      return ["Member Management", "Event Management"];
    case "aba_staff":
      return ["Member Management", "View Reports"];
    case "aba_corporate":
    case "aba_executive":
    case "aba_professional":
      return ["Member Portal"];
    case "editor":
      return ["Content Management"];
    default:
      return ["View Only"];
  }
}

// ─── Page ────────────────────────────────────────────────────

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let allUsers: UserNode[] = [];

  try {
    const data = await wpGraphQL<MembersResponse>(
      GET_MEMBERS,
      { first: 200 },
      session.accessToken,
    );
    allUsers = data.users.nodes;
  } catch {
    // Graceful degradation
  }

  // Show all registered users — the Admin Panel manages all CRM users
  // ── Map to AdminUser props ─────────────────────────────────
  // TODO: MFA status and last login are not tracked in WP yet.
  //       These fields are set to defaults until MFA integration is added.

  const users: AdminUser[] = allUsers.map((u) => {
    const perms = rolePermissions(u.abaRole);
    return {
      initials: initials(u.firstName, u.lastName, u.name),
      name: u.name,
      joined: "—",
      email: u.email,
      phone: u.phone ?? "—",
      role: roleLabel(u.abaRole),
      roleColor: roleColor(u.abaRole),
      status: "Active",
      statusColor: "text-green-600",
      mfa: "—",
      mfaEnabled: false,
      lastLogin: "—",
      permissions: perms,
      extraPerms: 0,
      highlightPerm: false,
      showMfaAction: false,
    };
  });

  // ── Stats ──────────────────────────────────────────────────

  const adminRoles = ["administrator", "aba_manager", "aba_staff"];
  const adminCount = allUsers.filter(
    (u) => u.abaRole && adminRoles.includes(u.abaRole),
  ).length;

  const stats: AdminStat[] = [
    {
      label: "Total Users",
      value: users.length.toString(),
      sub: "Registered accounts",
      iconKey: "Users",
      iconColor: "text-blue-500",
      borderColor: "border-l-blue-500",
    },
    {
      label: "Admin Users",
      value: adminCount.toString(),
      sub: "CRM access",
      iconKey: "CheckCircle2",
      iconColor: "text-green-500",
      borderColor: "border-l-green-500",
    },
    {
      label: "MFA Enabled",
      value: "—",
      sub: "MFA not yet integrated",
      iconKey: "Shield",
      iconColor: "text-green-400",
      borderColor: "border-l-amber-500",
    },
    {
      label: "Pending Invites",
      value: "—",
      sub: "Invite system pending",
      iconKey: "UserPlus",
      iconColor: "text-amber-500",
      borderColor: "border-l-red-500",
    },
  ];

  // ── Security Alert ─────────────────────────────────────────

  const securityAlert: SecurityAlert | null = null;
  // TODO: Compute once MFA tracking is available:
  // { message: "X users have not enabled MFA...", usersWithoutMfa: N }

  return (
    <AdminPanelUI
      stats={stats}
      users={users}
      totalUsers={users.length}
      securityAlert={securityAlert}
    />
  );
}
