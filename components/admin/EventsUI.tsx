"use client";

import {
  Users,
  Download,
  Search,
  Calendar,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Clock,
  CalendarDays,
  TrendingUp,
  Mail,
  UserPlus,
  Ticket,
  type LucideIcon,
} from "lucide-react";

// ─── Icon Map (server passes string keys) ─────────────────────

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  CalendarDays,
  Users,
  TrendingUp,
};

// ─── Prop Types ───────────────────────────────────────────────

export interface EventStat {
  label: string;
  value: string;
  sub: string;
  iconKey: string;
  iconColor: string;
  borderColor: string;
}

export interface TierCount {
  tier: string;
  count: number;
}

export interface UpcomingEvent {
  name: string;
  date: string;
  time: string;
  venue: string;
  registered: number;
  capacity: number;
  revenue: string;
  status: string;
  statusColor: string;
  daysAway: number;
  tierBreakdown: TierCount[];
}

export interface PastEvent {
  name: string;
  date: string;
  venue: string;
  registered: number;
  attended: number;
  attendanceRate: string;
  rateColor: string;
  revenue: string;
  status: string;
  statusColor: string;
}

export interface EventsProps {
  stats: EventStat[];
  upcomingEvents: UpcomingEvent[];
  pastEvents: PastEvent[];
  totalPastEvents: number;
}

// ─── Component ────────────────────────────────────────────────

export default function EventsUI({
  stats,
  upcomingEvents,
  pastEvents,
  totalPastEvents,
}: EventsProps) {
  return (
    <div className="space-y-6">
      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Event Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create, manage, and track all ABA events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Events
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a2332] text-white text-sm font-medium hover:bg-[#243044] transition-colors">
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.iconKey];
          return (
            <div
              key={stat.label}
              className={`bg-white rounded-lg border border-gray-200 border-l-4 ${stat.borderColor} p-4 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500 font-medium">
                  {stat.label}
                </p>
                {Icon && <Icon className={`w-4 h-4 ${stat.iconColor}`} />}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Upcoming Events (Detailed Cards) ── */}
      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-amber-500" />
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.map((event) => {
              const pct = Math.round(
                (event.registered / event.capacity) * 100
              );
              return (
                <div
                  key={event.name}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6"
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-base font-bold text-gray-900">
                          {event.name}
                        </h4>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${event.statusColor}`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-red-400" />
                          {event.venue}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a2332] text-white text-xs font-medium hover:bg-[#243044] transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-300 bg-white text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Registration + Revenue + Tier Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Registration Progress */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Registration
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{event.registered} registered</span>
                        <span className="font-medium text-gray-700">
                          {event.registered} / {event.capacity}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            pct >= 75 ? "bg-amber-500" : "bg-green-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {event.capacity - event.registered} spots remaining
                      </p>
                    </div>

                    {/* Revenue */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Revenue
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {event.revenue}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        In {event.daysAway} days
                      </p>
                    </div>

                    {/* Tier Breakdown */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Registrant Breakdown
                      </p>
                      <div className="space-y-1">
                        {event.tierBreakdown.map((t) => (
                          <div
                            key={t.tier}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-gray-500">{t.tier}</span>
                            <span className="font-medium text-gray-700">
                              {t.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 flex-wrap">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-amber-400 bg-white text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                      Email Registrants
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                      <UserPlus className="w-3.5 h-3.5" />
                      Add Attendee
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                      <Ticket className="w-3.5 h-3.5" />
                      Manage Tickets
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      Export List
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Search / Filter Bar ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by name, venue, or date..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option>All Status</option>
            <option>Upcoming</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option>All Types</option>
            <option>Gala / Social</option>
            <option>Workshop</option>
            <option>Networking</option>
            <option>Conference</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-3.5 h-3.5" />
              More Filters
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <CalendarDays className="w-3.5 h-3.5" />
              Date Range
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">{totalPastEvents}</span> past events
          </p>
        </div>
      </div>

      {/* ── Past Events Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 pt-5 pb-3">
          <Calendar className="w-5 h-5 text-gray-500" />
          <h3 className="text-base font-bold text-gray-900">Past Events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                  Event
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Date
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Venue
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Registered
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Attended
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Rate
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Revenue
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pastEvents.map((ev) => (
                <tr
                  key={ev.name}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {ev.name}
                      </p>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ev.statusColor}`}
                      >
                        {ev.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                    {ev.date}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {ev.venue}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {ev.registered}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {ev.attended}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${ev.rateColor}`}>
                      {ev.attendanceRate}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-amber-600">
                    {ev.revenue}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-red-50 text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
