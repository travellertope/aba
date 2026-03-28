"use client";

import {
  CalendarDays,
  Download,
  Filter,
  Mail,
  Phone,
  Eye,
  TrendingUp,
  BarChart3,
  UserPlus,
  PhoneCall,
  Search,
} from "lucide-react";

// ─── Props ────────────────────────────────────────────────────

export interface LeadStat {
  label: string;
  value: string;
  sub: string;
  iconKey: string;
  borderColor: string;
}

export interface LeadCard {
  id: string;
  initials: string;
  name: string;
  scoreBadge: string;
  scoreType: "hot" | "warm";
  company: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
  eventsAttended: number;
  interests: string[];
  events: string[];
  notes: string;
  callHighlighted: boolean;
}

export interface WarmLeadsUIProps {
  stats: LeadStat[];
  leads: LeadCard[];
  totalCount: number;
}

// ─── Icon map ─────────────────────────────────────────────────

import type { LucideIcon } from "lucide-react";

const statIconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Eye,
  CalendarDays,
};

// ─── Component ────────────────────────────────────────────────

export default function WarmLeadsUI({ stats, leads, totalCount }: WarmLeadsUIProps) {
  return (
    <>
      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Warm Leads</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and convert high-potential prospects into members
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors self-start">
          <Download className="w-4 h-4" />
          Export Leads
        </button>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = statIconMap[stat.iconKey] ?? TrendingUp;
          return (
            <div
              key={stat.label}
              className={`bg-white rounded-lg border border-gray-200 border-l-4 ${stat.borderColor} p-4 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500 font-medium">
                  {stat.label}
                </p>
                <Icon className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Search / Filter Bar ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name, email, or company..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option>All Scores</option>
            <option>Hot Leads (90+)</option>
            <option>Warm Leads (75-89)</option>
          </select>
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option>Sort by Score</option>
            <option>Sort by Visits</option>
            <option>Sort by Last Visit</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            More Filters
          </button>
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">{totalCount}</span> leads
          </p>
        </div>
      </div>

      {/* ── Lead Cards ── */}
      <div className="space-y-5">
        {leads.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-400">
            No warm leads found.
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6"
            >
              {/* ── Card Header ── */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6b7040] flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">
                      {lead.initials}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-gray-900">
                        {lead.name}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          lead.scoreType === "hot"
                            ? "bg-red-600 text-white"
                            : "bg-[#1a2332] text-white"
                        }`}
                      >
                        {lead.scoreBadge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{lead.company}</p>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="w-3.5 h-3.5" />
                        {lead.email}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone className="w-3.5 h-3.5" />
                        {lead.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2332] text-white text-sm font-medium hover:bg-[#243044] transition-colors self-start shrink-0">
                  <UserPlus className="w-4 h-4" />
                  Convert to Member
                </button>
              </div>

              {/* ── Engagement + Interests Row ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
                    <BarChart3 className="w-3.5 h-3.5" />
                    Engagement History
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">{lead.visits} visits</span>{" "}
                    · Last visit:{" "}
                    <span className="font-semibold">{lead.lastVisit}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {lead.eventsAttended} events attended
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    Interests
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.interests.map((interest) => (
                      <span
                        key={interest}
                        className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Events Attended ── */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Events Attended
                </p>
                <div className="flex flex-wrap gap-2">
                  {lead.events.map((event) => (
                    <span
                      key={event}
                      className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Notes ── */}
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg px-4 py-2.5 mb-4">
                <p className="text-xs text-gray-700">
                  <span className="font-semibold text-red-600">Notes:</span>{" "}
                  {lead.notes}
                </p>
              </div>

              {/* ── Action Buttons ── */}
              <div className="grid grid-cols-3 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-amber-400 text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors">
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
                <button
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    lead.callHighlighted
                      ? "bg-[#1a2332] border-[#1a2332] text-white hover:bg-[#243044]"
                      : "border-[#1a2332] text-[#1a2332] hover:bg-gray-50"
                  }`}
                >
                  <PhoneCall className="w-4 h-4" />
                  Call Lead
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
