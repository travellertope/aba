import { wpGraphQL } from "@/lib/graphql/client";
import { GET_TEAM_MEMBERS } from "@/lib/graphql/queries";
import ManagementTeamUI from "@/components/public/ManagementTeamUI";
import type { TeamMember, TeamMembersConnection } from "@/types";

export const revalidate = 3600;

export const metadata = {
  title: "Management Team | African Business Association",
  description:
    "Meet the management team and advisory board members of the African Business Association, Yorkshire.",
};

interface QueryResult {
  teamMembers: TeamMembersConnection;
}

export default async function ManagementTeamPage() {
  let allMembers: TeamMember[] = [];

  try {
    const data = await wpGraphQL<QueryResult>(GET_TEAM_MEMBERS);
    allMembers = data.teamMembers.nodes;
  } catch {
    // Gracefully render empty state if WPGraphQL is unreachable
  }

  const managementMembers = allMembers
    .filter((m) => m.memberSection === "management")
    .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));

  const advisoryMembers = allMembers
    .filter((m) => m.memberSection === "advisory")
    .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));

  return (
    <ManagementTeamUI
      managementMembers={managementMembers}
      advisoryMembers={advisoryMembers}
    />
  );
}
