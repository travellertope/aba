"use client";

import {
  Users,
  Download,
  Search,
  Eye,
  Clock,
  TrendingUp,
  Globe,
  MapPin,
  FileText,
  ExternalLink,
  Zap,
  type LucideIcon,
} from "lucide-react";

// ─── Icon Map (server passes string keys) ─────────────────────

const iconMap: Record<string, LucideIcon> = {
  Users,
  Eye,
  Clock,
  TrendingUp,
  Globe,
  MapPin,
  FileText,
  Search,
  Zap,
};

// ─── Prop Types ───────────────────────────────────────────────

export interface SeoStat {
  label: string;
  value: string;
  sub: string;
  subColor: string;
  iconKey: string;
  iconColor: string;
  borderColor: string;
}

export interface TrafficSource {
  name: string;
  type: string;
  visits: string;
  pct: number;
  change: string;
  changeColor: string;
  barColor: string;
}

export interface VisitorLocation {
  city: string;
  country: string;
  visits: string;
  pct: number;
}

export interface TopPage {
  page: string;
  path: string;
  views: string;
  avgTime: string;
  bounce: number;
  bounceColor: string;
  exit: string;
}

export interface TopKeyword {
  keyword: string;
  position: number;
  posColor: string;
  clicks: string;
  impressions: string;
  ctr: string;
}

export interface PageSpeedScore {
  label: string;
  subtitle: string;
  score: number;
  scoreColor: string;
  borderColor: string;
  metrics: { label: string; value: string }[];
}

export interface SeoAnalyticsProps {
  stats: SeoStat[];
  trafficSources: TrafficSource[];
  visitorLocations: VisitorLocation[];
  topPages: TopPage[];
  topKeywords: TopKeyword[];
  pageSpeedScores: PageSpeedScore[];
}

// ─── Component ────────────────────────────────────────────────

export default function SeoAnalyticsUI({
  stats,
  trafficSources,
  visitorLocations,
  topPages,
  topKeywords,
  pageSpeedScores,
}: SeoAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            SEO & Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Public website performance and visitor insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a2332] text-white text-sm font-medium hover:bg-[#243044] transition-colors">
            <ExternalLink className="w-4 h-4" />
            View in GA4
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
              <p className={`text-xs mt-0.5 ${stat.subColor}`}>{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Google PageSpeed Insights ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-gray-900">
            Google PageSpeed Insights
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pageSpeedScores.map((ps) => (
            <div key={ps.label} className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {ps.label}
                  </p>
                  <p className="text-xs text-gray-500">{ps.subtitle}</p>
                </div>
                <div
                  className={`w-14 h-14 rounded-full border-4 ${ps.borderColor} flex items-center justify-center`}
                >
                  <span className={`text-lg font-bold ${ps.scoreColor}`}>
                    {ps.score}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                {ps.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex justify-between text-gray-600"
                  >
                    <span>{m.label}</span>
                    <span className="font-semibold">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Traffic Sources + Visitor Locations ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-5 h-5 text-gray-500" />
            <h3 className="text-base font-bold text-gray-900">
              Traffic Sources
            </h3>
          </div>
          <div className="space-y-5">
            {trafficSources.map((src) => (
              <div key={src.name}>
                <div className="flex items-center justify-between mb-0.5">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {src.name}
                    </p>
                    <p className="text-[11px] text-gray-400">{src.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {src.visits}
                    </p>
                    <p className="text-[11px] text-gray-400">{src.pct}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${src.barColor} rounded-full`}
                      style={{ width: `${src.pct}%` }}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-medium ${src.changeColor} whitespace-nowrap`}
                  >
                    {src.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visitor Locations */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-gray-900">
              Visitor Locations
            </h3>
          </div>
          <div className="space-y-4">
            {visitorLocations.map((loc) => (
              <div key={loc.city}>
                <div className="flex items-center justify-between mb-0.5">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {loc.city}
                    </p>
                    <p className="text-[11px] text-gray-400">{loc.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {loc.visits}
                    </p>
                    <p className="text-[11px] text-gray-400">{loc.pct}%</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${loc.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Pages ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 pt-5 pb-3">
          <FileText className="w-5 h-5 text-gray-500" />
          <h3 className="text-base font-bold text-gray-900">Top Pages</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Page
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Views
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Avg Time
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Bounce Rate
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Exit Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((p) => (
                <tr
                  key={p.page}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {p.page}
                    </p>
                    <p className="text-[11px] text-gray-400">{p.path}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {p.views}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {p.avgTime}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium text-white px-2.5 py-1 rounded-full ${p.bounceColor}`}
                    >
                      {p.bounce}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {p.exit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Top Keywords ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 pt-5 pb-3">
          <Search className="w-5 h-5 text-gray-500" />
          <h3 className="text-base font-bold text-gray-900">
            Top Keywords (Google Search Console)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Keyword
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Position
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Clicks
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Impressions
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  CTR
                </th>
              </tr>
            </thead>
            <tbody>
              {topKeywords.map((kw) => (
                <tr
                  key={kw.keyword}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {kw.keyword}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold text-white px-2 py-0.5 rounded ${kw.posColor}`}
                    >
                      #{kw.position}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {kw.clicks}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {kw.impressions}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {kw.ctr}
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
