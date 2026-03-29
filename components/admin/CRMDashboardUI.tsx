"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  CalendarDays,
  PoundSterling,
  TrendingUp,
  AlertCircle,
  UserPlus,
  Calendar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MemberPanel from "./MemberPanel";

// ─── Icon map (server passes string keys, client resolves to components) ──

const iconMap: Record<string, LucideIcon> = {
  Users,
  CalendarDays,
  PoundSterling,
  TrendingUp,
};

// ─── Props ────────────────────────────────────────────────────

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  iconKey: string;
  iconBg: string;
  iconColor: string;
}

export interface DashboardAlert {
  text: string;
  borderColor: string;
  bgColor: string;
}

export interface RecentMember {
  name: string;
  company: string;
  badge: string;
  badgeColor: string;
  time: string;
}

export interface UpcomingEvent {
  name: string;
  date: string;
  registered: number;
  total: number;
}

export interface CRMDashboardProps {
  stats: DashboardStat[];
  alerts: DashboardAlert[];
  recentMembers: RecentMember[];
  upcomingEvents: UpcomingEvent[];
}

// ─── Quick Actions (static — lives entirely in the client component) ─────

const quickActionLinks = [
  {
    label: "Create Event",
    description: "Schedule new event",
    icon: Calendar,
    href: "/admin/events/new",
  },
  {
    label: "View Analytics",
    description: "Detailed reports",
    icon: TrendingUp,
    href: "/admin/analytics",
  },
  {
    label: "Payment Records",
    description: "Track revenue",
    icon: PoundSterling,
    href: "/admin/payments",
  },
];

// ─── Component ────────────────────────────────────────────────

export default function CRMDashboardUI({
  stats,
  alerts,
  recentMembers,
  upcomingEvents,
}: CRMDashboardProps) {
  const [memberPanelOpen, setMemberPanelOpen] = useState(false);

  async function handleCreateMember(data: import("./MemberPanel").MemberFormData) {
    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        membershipTier: data.tier,
        phone: data.phone || undefined,
        companyName: data.company || undefined,
        jobTitle: data.jobTitle || undefined,
        status: data.status.toLowerCase(),
        joinDate: data.joinDate,
        paymentMethod: data.paymentMethod || undefined,
        notes: data.notes || undefined,
        sendWelcomeEmail: data.sendWelcomeEmail,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create member.");
    }
  }

  return (
    <>
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">CRM Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          Overview of membership and event management
        </p>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.iconKey] ?? Users;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <div
                className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center mb-4`}
              >
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
              <p className="text-xs text-green-600 font-medium mt-1">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── System Alerts ── */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-gray-700" />
            <h3 className="text-base font-bold text-gray-900">
              System Alerts
            </h3>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`${alert.bgColor} border-l-4 ${alert.borderColor} rounded-r-lg px-4 py-3 text-sm text-gray-700`}
              >
                {alert.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Members + Events Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              <h3 className="text-base font-bold text-gray-900">
                Recent Members
              </h3>
            </div>
            <Link
              href="/admin/members"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentMembers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No recent members found.
              </p>
            ) : (
              recentMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500">{member.company}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${member.badgeColor}`}
                    >
                      {member.badge}
                    </span>
                    <span className="text-xs text-gray-400">{member.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-gray-500" />
              <h3 className="text-base font-bold text-gray-900">
                Upcoming Events
              </h3>
            </div>
            <Link
              href="/admin/events"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Manage
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No upcoming events.
              </p>
            ) : (
              upcomingEvents.map((event) => {
                const pct = event.total > 0
                  ? Math.round((event.registered / event.total) * 100)
                  : 0;
                return (
                  <div
                    key={event.name}
                    className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {event.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">{event.date}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Registration</span>
                      <span className="font-medium text-gray-700">
                        {event.registered} / {event.total}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Add New Member — opens off-canvas panel */}
          <button
            onClick={() => setMemberPanelOpen(true)}
            className="flex flex-col items-start gap-2 rounded-xl border border-gray-200 p-4 text-left hover:border-amber-400 hover:shadow-md transition-all group"
          >
            <UserPlus className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Add New Member
              </p>
              <p className="text-xs text-gray-500">Register new membership</p>
            </div>
          </button>

          {quickActionLinks.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-start gap-2 rounded-xl border border-gray-200 p-4 text-left hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <action.icon className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {action.label}
                </p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Add Member Panel ── */}
      <MemberPanel
        isOpen={memberPanelOpen}
        onClose={() => setMemberPanelOpen(false)}
        mode="add"
        onSubmit={handleCreateMember}
      />
    </>
  );
}
