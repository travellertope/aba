// Admin CRM Dashboard — Server Component
// Auth.js v5: auth() reads session server-side.
// Middleware guarantees only administrator/aba_manager/aba_staff can reach this page.

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { wpGraphQL } from '@/lib/graphql/client';
import { GET_MEMBERS, GET_WARM_LEADS, GET_EVENTS } from '@/lib/graphql/queries';
import type { EventsConnection, WarmLeadsConnection } from '@/types';

interface MembersConnection {
  nodes: {
    id: string;
    name: string;
    email: string;
    membershipTier: string | null;
    subscriptionStatus: string | null;
    companyName: string | null;
  }[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

async function getAdminSummary(token: string) {
  const [membersData, leadsData, eventsData] = await Promise.allSettled([
    wpGraphQL<{ users: MembersConnection }>(GET_MEMBERS, { first: 100 }, token),
    wpGraphQL<{ warmLeads: WarmLeadsConnection }>(GET_WARM_LEADS, { first: 100 }, token),
    wpGraphQL<{ events: EventsConnection }>(GET_EVENTS, { first: 50 }),
  ]);

  return {
    members: membersData.status === 'fulfilled' ? membersData.value.users.nodes : [],
    leads: leadsData.status === 'fulfilled' ? leadsData.value.warmLeads.nodes : [],
    events: eventsData.status === 'fulfilled' ? eventsData.value.events.nodes : [],
  };
}

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) redirect('/portal/login');

  const { members, leads, events } = await getAdminSummary(session.accessToken);

  const activeMembers = members.filter((m) => m.subscriptionStatus === 'active').length;
  const newLeads = leads.filter((l) => l.leadStatus === 'new').length;
  const upcomingCount = events.filter(
    (e) => e.eventDate && new Date(e.eventDate) >= new Date(),
  ).length;

  const stats = [
    { label: 'Total Members', value: members.length, sub: `${activeMembers} active` },
    { label: 'Warm Leads', value: leads.length, sub: `${newLeads} new` },
    { label: 'Upcoming Events', value: upcomingCount, sub: `${events.length} total` },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            CRM & Membership Overview · Logged in as{' '}
            <span className="font-medium">{session.user.name}</span>{' '}
            <span className="text-slate-400">({session.user.role})</span>
          </p>
        </div>
        <a href="/portal/dashboard" className="text-sm text-blue-600 hover:underline">
          Member View
        </a>
      </div>

      {/* Stats — replace with components/admin/StatsGrid.tsx */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Members table — replace with components/admin/MembersTable.tsx */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Members</h2>
          <a href="/admin/members" className="text-sm text-blue-600 hover:underline">
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-3 font-medium text-slate-500">Name</th>
                <th className="px-6 py-3 font-medium text-slate-500">Company</th>
                <th className="px-6 py-3 font-medium text-slate-500">Tier</th>
                <th className="px-6 py-3 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.slice(0, 10).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No members found.
                  </td>
                </tr>
              ) : (
                members.slice(0, 10).map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 font-medium text-slate-900">{member.name}</td>
                    <td className="px-6 py-3 text-slate-500">{member.companyName ?? '—'}</td>
                    <td className="px-6 py-3 capitalize text-slate-700">
                      {member.membershipTier ?? '—'}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          member.subscriptionStatus === 'active'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {member.subscriptionStatus ?? 'unknown'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warm Leads table — replace with components/admin/LeadsTable.tsx */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Warm Leads</h2>
          <a href="/admin/leads" className="text-sm text-blue-600 hover:underline">
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-3 font-medium text-slate-500">Name / Company</th>
                <th className="px-6 py-3 font-medium text-slate-500">Source</th>
                <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                <th className="px-6 py-3 font-medium text-slate-500">Follow Up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.slice(0, 10).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.slice(0, 10).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3">
                      <p className="font-medium text-slate-900">{lead.title}</p>
                      <p className="text-slate-400 text-xs">{lead.leadCompany ?? '—'}</p>
                    </td>
                    <td className="px-6 py-3 capitalize text-slate-500">
                      {lead.leadSource ?? '—'}
                    </td>
                    <td className="px-6 py-3">
                      <LeadStatusBadge status={lead.leadStatus} />
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {lead.followUpDate
                        ? new Date(lead.followUpDate).toLocaleDateString('en-AU')
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LeadStatusBadge({ status }: { status: string | null }) {
  const colors: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700',
    contacted: 'bg-yellow-50 text-yellow-700',
    qualified: 'bg-purple-50 text-purple-700',
    converted: 'bg-green-50 text-green-700',
    lost: 'bg-slate-100 text-slate-500',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[status ?? ''] ?? 'bg-slate-100 text-slate-500'}`}
    >
      {status ?? 'unknown'}
    </span>
  );
}
