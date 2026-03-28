"use client";

import {
  Search,
  Download,
  Filter,
  Eye,
  Mic,
  Play,
  Clock,
  CalendarDays,
  Rss,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

// ─── Icon map ─────────────────────────────────────────────────

const statIconMap: Record<string, LucideIcon> = {
  Mic,
  Play,
  Rss,
  Clock,
};

// ─── Props ────────────────────────────────────────────────────

export interface PodcastStat {
  label: string;
  value: string;
  sub: string;
  iconKey: string;
  iconColor: string;
  borderColor: string;
}

export interface RssFeed {
  name: string;
  url: string;
  icon: string;
  highlight: boolean;
}

export interface EpisodeCard {
  id: string;
  code: string;
  status: string;
  statusColor: string;
  title: string;
  description: string;
  guest: string;
  duration: string;
  date: string;
  listens: string;
  tags: string[];
  hasPlay: boolean;
}

export interface PodcastsUIProps {
  stats: PodcastStat[];
  rssFeeds: RssFeed[];
  episodes: EpisodeCard[];
  totalEpisodes: number;
}

// ─── Component ────────────────────────────────────────────────

export default function PodcastsUI({
  stats,
  rssFeeds,
  episodes,
  totalEpisodes,
}: PodcastsUIProps) {
  return (
    <>
      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            ABA Podcast Platform
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage podcast episodes and distribute via RSS feeds
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Analytics Report
          </button>
          <Link
            href="/admin/podcasts/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a2332] text-white text-sm font-medium hover:bg-[#243044] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Episode
          </Link>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = statIconMap[stat.iconKey] ?? Mic;
          return (
            <div
              key={stat.label}
              className={`bg-white rounded-lg border border-gray-200 border-l-4 ${stat.borderColor} p-4 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500 font-medium">
                  {stat.label}
                </p>
                <Icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── RSS Feed Distribution ── */}
      {rssFeeds.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Rss className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-gray-900">
              RSS Feed Distribution
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Share these links with your audience so they can listen on their
            preferred platform. The RSS feed automatically updates when you
            publish new episodes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rssFeeds.map((feed) => (
              <div
                key={feed.name}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                  feed.highlight
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg shrink-0">{feed.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {feed.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {feed.url}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
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
              placeholder="Search episodes by title, guest, or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option>All Status</option>
            <option>Published</option>
            <option>Scheduled</option>
            <option>Draft</option>
          </select>
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option>All Seasons</option>
            <option>Season 1</option>
            <option>Season 2</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            More Filters
          </button>
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">{totalEpisodes}</span>{" "}
            episodes
          </p>
        </div>
      </div>

      {/* ── Episode Cards ── */}
      <div className="space-y-4">
        {episodes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-400">
            No episodes found.
          </div>
        ) : (
          episodes.map((ep) => (
            <div
              key={ep.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6"
            >
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-[#c5a234] to-[#8b7d3c] flex items-center justify-center shrink-0">
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Code + Status */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500">
                      {ep.code}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ep.statusColor}`}
                    >
                      {ep.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-bold text-gray-900 mb-1">
                    {ep.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-gray-500 leading-relaxed mb-2">
                    {ep.description}
                  </p>

                  {/* Meta Row */}
                  <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      Guest: <span className="font-medium">{ep.guest}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ep.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {ep.date}
                    </span>
                    {ep.listens && (
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {ep.listens}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {ep.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {ep.hasPlay && (
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a2332] text-white text-xs font-medium hover:bg-[#243044] transition-colors">
                        <Play className="w-3.5 h-3.5" />
                        Play Episode
                      </button>
                    )}
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                    <Link
                      href={`/admin/podcasts/${ep.id}/edit`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-300 bg-white text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-300 bg-white text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
