"use client";

import {
  Users,
  Download,
  PoundSterling,
  CalendarDays,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

// ─── Icon Map (server passes string keys) ─────────────────────

const iconMap: Record<string, LucideIcon> = {
  Users,
  PoundSterling,
  CalendarDays,
  TrendingUp,
};

// ─── Prop Types ───────────────────────────────────────────────

export interface HeroStat {
  label: string;
  value: string;
  sub: string;
  iconKey: string;
  bg: string;
}

export interface TierBreakdown {
  tier: string;
  members: number;
  revenue: string;
  pct: number;
  barWidth: number;
  barColor: string;
}

export interface GrowthMonth {
  month: string;
  value: number;
  pct: number;
}

export interface EventPerformanceRow {
  event: string;
  registered: number;
  attended: string;
  attendanceRate: string;
  rateColor: string;
  revenue: string;
}

export interface AnalyticsProps {
  heroStats: HeroStat[];
  membershipBreakdown: TierBreakdown[];
  totalRevenue: string;
  memberGrowth: GrowthMonth[];
  eventPerformance: EventPerformanceRow[];
}

// ─── Component ────────────────────────────────────────────────

export default function AnalyticsUI({
  heroStats,
  membershipBreakdown,
  totalRevenue,
  memberGrowth,
  eventPerformance,
}: AnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics & Reports
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Insights into membership and event performance
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-amber-400 bg-white text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors self-start">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* ── Hero Stats (Colored Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {heroStats.map((stat) => {
          const Icon = iconMap[stat.iconKey];
          return (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-xl p-5 text-white shadow-md`}
            >
              {Icon && <Icon className="w-7 h-7 text-white/70 mb-3" />}
              <p className="text-sm text-white/80 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-white/70 mt-1">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Membership Breakdown + Member Growth ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-5">
            Membership Breakdown
          </h3>
          <div className="space-y-5">
            {membershipBreakdown.map((tier) => (
              <div key={tier.tier}>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {tier.tier}
                    </p>
                    <p className="text-xs text-gray-500">
                      {tier.members} members · {tier.revenue}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-amber-500">
                    {tier.pct}%
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${tier.barColor} rounded-full`}
                    style={{ width: `${tier.barWidth}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-5 pt-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Total</p>
            <p className="text-xl font-bold text-gray-900">{totalRevenue}</p>
          </div>
        </div>

        {/* Member Growth (6 Months) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-5">
            Member Growth (6 Months)
          </h3>
          <div className="space-y-4">
            {memberGrowth.map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 w-8 shrink-0">
                  {m.month}
                </span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-amber-500 to-[#5a6a3a]"
                    style={{ width: `${m.pct}%` }}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">
                    {m.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Event Performance ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <h3 className="text-base font-bold text-gray-900">
            Event Performance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Event
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Registered
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Attended
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Attendance Rate
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {eventPerformance.map((ev) => (
                <tr
                  key={ev.event}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {ev.event}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {ev.registered}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {ev.attended}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-sm font-semibold ${ev.rateColor || "text-gray-400"}`}
                    >
                      {ev.attendanceRate}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-amber-600">
                    {ev.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
