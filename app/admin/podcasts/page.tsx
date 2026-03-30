// Admin Podcasts Page — Server Component
// Fetches podcast episodes from WPGraphQL and maps them to PodcastsUI props.
// Auth + role check enforced by parent layout.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { wpGraphQL } from "@/lib/graphql/client";
import { GET_PODCASTS } from "@/lib/graphql/queries";
import PodcastsUI from "@/components/admin/PodcastsUI";
import type {
  PodcastStat,
  RssFeed,
  EpisodeCard,
} from "@/components/admin/PodcastsUI";
import type { PageInfo } from "@/types";

// ─── GraphQL response shape ──────────────────────────────────

interface PodcastNode {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  excerpt: string | null;
  date: string | null;
  status: string | null;
  audioUrl: string | null;
  duration: string | null;
  guestTags: string | null;
  season: number | null;
  episode: number | null;
}

interface PodcastsResponse {
  podcasts: {
    nodes: PodcastNode[];
    pageInfo: PageInfo;
  };
}

// ─── Helpers ─────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

function statusLabel(status: string | null): string {
  switch (status) {
    case "publish":
      return "Published";
    case "draft":
      return "Draft";
    case "future":
      return "Scheduled";
    default:
      return status ?? "Draft";
  }
}

function statusColor(status: string | null): string {
  switch (status) {
    case "publish":
      return "bg-green-100 text-green-700";
    case "draft":
      return "bg-gray-100 text-gray-600";
    case "future":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function episodeCode(season: number | null, episode: number | null): string {
  const s = season ?? 1;
  const e = episode ?? 0;
  return `S${String(s).padStart(2, "0")}E${String(e).padStart(2, "0")}`;
}

function parseDurationMinutes(duration: string | null): number {
  if (!duration) return 0;
  const parts = duration.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0], 10) || 0;
  }
  if (parts.length === 3) {
    return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
  }
  return parseInt(duration, 10) || 0;
}

// ─── Page ────────────────────────────────────────────────────

export default async function AdminPodcastsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let podcastNodes: PodcastNode[] = [];

  try {
    const data = await wpGraphQL<PodcastsResponse>(
      GET_PODCASTS,
      { first: 100 },
      session.accessToken,
    );
    podcastNodes = data.podcasts.nodes;
  } catch {
    // Graceful degradation — renders empty state
  }

  // ── Compute stats ──────────────────────────────────────────

  const published = podcastNodes.filter((p) => p.status === "publish");
  const totalMinutes = podcastNodes.reduce(
    (sum, p) => sum + parseDurationMinutes(p.duration),
    0,
  );
  const totalHours = Math.round(totalMinutes / 60);

  const seasons = new Set(podcastNodes.map((p) => p.season ?? 1));

  const stats: PodcastStat[] = [
    {
      label: "Total Episodes",
      value: podcastNodes.length.toString(),
      sub: `${published.length} published`,
      iconKey: "Mic",
      iconColor: "text-amber-500",
      borderColor: "border-l-amber-500",
    },
    {
      label: "Published",
      value: published.length.toString(),
      sub: "Available to listeners",
      iconKey: "Play",
      iconColor: "text-green-500",
      borderColor: "border-l-green-500",
    },
    {
      label: "Seasons",
      value: seasons.size.toString(),
      sub: `${podcastNodes.length} episodes total`,
      iconKey: "Rss",
      iconColor: "text-blue-500",
      borderColor: "border-l-blue-500",
    },
    {
      label: "Total Duration",
      value: `${totalHours}h`,
      sub: `${totalMinutes} minutes of content`,
      iconKey: "Clock",
      iconColor: "text-purple-500",
      borderColor: "border-l-purple-500",
    },
  ];

  // ── RSS Feeds ──────────────────────────────────────────────

  const wpUrl = process.env.WP_GRAPHQL_URL?.replace("/graphql", "") ?? "";

  const rssFeeds: RssFeed[] = wpUrl
    ? [
        {
          name: "Main RSS Feed",
          url: `${wpUrl}/feed/podcast`,
          icon: "📡",
          highlight: true,
        },
        {
          name: "Apple Podcasts",
          url: `${wpUrl}/feed/podcast`,
          icon: "🎧",
          highlight: false,
        },
        {
          name: "Spotify",
          url: `${wpUrl}/feed/podcast`,
          icon: "🎵",
          highlight: false,
        },
        {
          name: "Google Podcasts",
          url: `${wpUrl}/feed/podcast`,
          icon: "🔍",
          highlight: false,
        },
      ]
    : [];

  // ── Map episodes ───────────────────────────────────────────

  const episodes: EpisodeCard[] = podcastNodes.map((p) => {
    const guest = p.guestTags ?? "—";
    const tags = p.guestTags
      ? p.guestTags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    return {
      id: String(p.databaseId),
      code: episodeCode(p.season, p.episode),
      status: statusLabel(p.status),
      statusColor: statusColor(p.status),
      title: p.title,
      description: stripHtml(p.excerpt) || "No description available.",
      guest,
      duration: p.duration ?? "—",
      date: formatDate(p.date),
      listens: "", // Listen counts not tracked in WP — extend when analytics is added
      tags,
      hasPlay: p.status === "publish" && !!p.audioUrl,
    };
  });

  return (
    <PodcastsUI
      stats={stats}
      rssFeeds={rssFeeds}
      episodes={episodes}
      totalEpisodes={episodes.length}
    />
  );
}
