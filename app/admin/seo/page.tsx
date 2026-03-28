// Admin SEO & Analytics Page — Server Component
// TODO: Replace placeholder data with real Google Analytics 4, PageSpeed,
//       and Search Console API integrations when credentials are available.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SeoAnalyticsUI from "@/components/admin/SeoAnalyticsUI";
import type {
  SeoStat,
  TrafficSource,
  VisitorLocation,
  TopPage,
  TopKeyword,
  PageSpeedScore,
} from "@/components/admin/SeoAnalyticsUI";

export default async function AdminSeoPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  // ── Stats ──────────────────────────────────────────────────
  // TODO: Fetch from GA4 Data API (runReport)

  const stats: SeoStat[] = [
    {
      label: "Total Visitors",
      value: "—",
      sub: "Connect GA4 to see data",
      subColor: "text-gray-400",
      iconKey: "Users",
      iconColor: "text-gray-400",
      borderColor: "border-l-blue-500",
    },
    {
      label: "Page Views",
      value: "—",
      sub: "Connect GA4 to see data",
      subColor: "text-gray-400",
      iconKey: "Eye",
      iconColor: "text-green-500",
      borderColor: "border-l-green-500",
    },
    {
      label: "Avg Session",
      value: "—",
      sub: "Connect GA4 to see data",
      subColor: "text-gray-400",
      iconKey: "Clock",
      iconColor: "text-amber-500",
      borderColor: "border-l-amber-500",
    },
    {
      label: "Bounce Rate",
      value: "—",
      sub: "Connect GA4 to see data",
      subColor: "text-gray-400",
      iconKey: "TrendingUp",
      iconColor: "text-purple-500",
      borderColor: "border-l-purple-500",
    },
  ];

  // ── Traffic Sources ────────────────────────────────────────
  // TODO: Fetch from GA4 Data API (sessionSource dimension)

  const trafficSources: TrafficSource[] = [
    {
      name: "Google Search",
      type: "Organic",
      visits: "—",
      pct: 0,
      change: "—",
      changeColor: "text-gray-400",
      barColor: "bg-amber-500",
    },
    {
      name: "Direct",
      type: "Direct",
      visits: "—",
      pct: 0,
      change: "—",
      changeColor: "text-gray-400",
      barColor: "bg-amber-500",
    },
    {
      name: "LinkedIn",
      type: "Social",
      visits: "—",
      pct: 0,
      change: "—",
      changeColor: "text-gray-400",
      barColor: "bg-amber-500",
    },
    {
      name: "Facebook",
      type: "Social",
      visits: "—",
      pct: 0,
      change: "—",
      changeColor: "text-gray-400",
      barColor: "bg-amber-400",
    },
    {
      name: "Twitter/X",
      type: "Social",
      visits: "—",
      pct: 0,
      change: "—",
      changeColor: "text-gray-400",
      barColor: "bg-blue-400",
    },
    {
      name: "Referral Sites",
      type: "Referral",
      visits: "—",
      pct: 0,
      change: "—",
      changeColor: "text-gray-400",
      barColor: "bg-blue-300",
    },
  ];

  // ── Visitor Locations ──────────────────────────────────────
  // TODO: Fetch from GA4 Data API (city dimension)

  const visitorLocations: VisitorLocation[] = [
    { city: "London", country: "United Kingdom", visits: "—", pct: 0 },
    { city: "Manchester", country: "United Kingdom", visits: "—", pct: 0 },
    { city: "Birmingham", country: "United Kingdom", visits: "—", pct: 0 },
    { city: "New York", country: "United States", visits: "—", pct: 0 },
    { city: "Lagos", country: "Nigeria", visits: "—", pct: 0 },
  ];

  // ── Top Pages ──────────────────────────────────────────────
  // TODO: Fetch from GA4 Data API (pagePath dimension)

  const topPages: TopPage[] = [
    { page: "Home", path: "/", views: "—", avgTime: "—", bounce: 0, bounceColor: "bg-gray-400", exit: "—" },
    { page: "Membership", path: "/membership", views: "—", avgTime: "—", bounce: 0, bounceColor: "bg-gray-400", exit: "—" },
    { page: "Events", path: "/events", views: "—", avgTime: "—", bounce: 0, bounceColor: "bg-gray-400", exit: "—" },
    { page: "About Us", path: "/about", views: "—", avgTime: "—", bounce: 0, bounceColor: "bg-gray-400", exit: "—" },
    { page: "Contact", path: "/contact", views: "—", avgTime: "—", bounce: 0, bounceColor: "bg-gray-400", exit: "—" },
  ];

  // ── Top Keywords ───────────────────────────────────────────
  // TODO: Fetch from Google Search Console API

  const topKeywords: TopKeyword[] = [
    { keyword: "african business association uk", position: 0, posColor: "bg-gray-400", clicks: "—", impressions: "—", ctr: "—" },
    { keyword: "black business network london", position: 0, posColor: "bg-gray-400", clicks: "—", impressions: "—", ctr: "—" },
    { keyword: "african entrepreneurs uk", position: 0, posColor: "bg-gray-400", clicks: "—", impressions: "—", ctr: "—" },
  ];

  // ── PageSpeed Scores ───────────────────────────────────────
  // TODO: Fetch from PageSpeed Insights API v5

  const pageSpeedScores: PageSpeedScore[] = [
    {
      label: "Mobile Performance",
      subtitle: "Core Web Vitals Assessment",
      score: 0,
      scoreColor: "text-gray-400",
      borderColor: "border-gray-300",
      metrics: [
        { label: "First Contentful Paint", value: "—" },
        { label: "Largest Contentful Paint", value: "—" },
        { label: "Cumulative Layout Shift", value: "—" },
      ],
    },
    {
      label: "Desktop Performance",
      subtitle: "Core Web Vitals Assessment",
      score: 0,
      scoreColor: "text-gray-400",
      borderColor: "border-gray-300",
      metrics: [
        { label: "First Contentful Paint", value: "—" },
        { label: "Largest Contentful Paint", value: "—" },
        { label: "Cumulative Layout Shift", value: "—" },
      ],
    },
  ];

  return (
    <SeoAnalyticsUI
      stats={stats}
      trafficSources={trafficSources}
      visitorLocations={visitorLocations}
      topPages={topPages}
      topKeywords={topKeywords}
      pageSpeedScores={pageSpeedScores}
    />
  );
}
