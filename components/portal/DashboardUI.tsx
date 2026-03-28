"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Building2,
  LogOut,
  LayoutDashboard,
  User,
  Calendar,
  BookOpen,
  Users,
  TrendingUp,
  CreditCard,
  ArrowRight,
  UserPlus,
} from "lucide-react";

/* ─── colour tokens ─── */
const navy = "#1a2340";
const gold = "#d4a843";
const goldLight = "#f5e6c0";

/* ─── dummy data ─── */
const portalTabs = [
  { label: "Dashboard", icon: <LayoutDashboard style={{ width: 16, height: 16 }} />, active: true },
  { label: "My Profile", icon: <User style={{ width: 16, height: 16 }} />, active: false },
  { label: "Events", icon: <Calendar style={{ width: 16, height: 16 }} />, active: false },
  { label: "Bookings", icon: <BookOpen style={{ width: 16, height: 16 }} />, active: false },
  { label: "Directory", icon: <Users style={{ width: 16, height: 16 }} />, active: false },
];

const stats = [
  { label: "Events Attended", value: "12", color: "#3b82f6", icon: <Calendar style={{ width: 20, height: 20, color: "#3b82f6" }} /> },
  { label: "Network Connections", value: "47", color: "#f59e0b", icon: <Users style={{ width: 20, height: 20, color: "#f59e0b" }} /> },
  { label: "Membership Status", value: "Active", color: "#10b981", icon: <CreditCard style={{ width: 20, height: 20, color: "#10b981" }} /> },
  { label: "Member Since", value: "2023", color: "#8b5cf6", icon: <TrendingUp style={{ width: 20, height: 20, color: "#8b5cf6" }} /> },
];

const upcomingEvents = [
  { title: "Annual Gala Night", date: "March 15, 2025", status: "Registered", statusColor: "#d4a843" },
  { title: "Business Forum", date: "February 8, 2025", status: "Available", statusColor: "#1a2340" },
  { title: "Leadership Masterclass", date: "February 22, 2025", status: "Available", statusColor: "#1a2340" },
];

const recentActivity = [
  { text: "Registered for Annual Gala Night", time: "2 days ago" },
  { text: "Updated business profile", time: "1 week ago" },
  { text: "Connected with Sarah Okonkwo", time: "2 weeks ago" },
  { text: "Attended Networking Mixer", time: "3 weeks ago" },
];

const quickActions = [
  { title: "Register for Event", subtitle: "Browse upcoming events", icon: <Calendar style={{ width: 22, height: 22, color: gold }} /> },
  { title: "Find Members", subtitle: "Search the directory", icon: <Users style={{ width: 22, height: 22, color: gold }} /> },
  { title: "Update Profile", subtitle: "Edit your information", icon: <User style={{ width: 22, height: 22, color: gold }} /> },
  { title: "Renew Membership", subtitle: "Manage subscription", icon: <CreditCard style={{ width: 22, height: 22, color: gold }} /> },
];

/* ─── component ─── */
export default function DashboardUI() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Member";
  const fullName = session?.user?.name ?? "Member";
  const tier = session?.user?.membershipTier ?? "member";
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1) + " Member";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        .grid-4-stat {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .grid-4-stat {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .grid-4-stat {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .grid-2-col {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .grid-4-action {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .grid-4-action {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .grid-4-action {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .action-card {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 1.25rem;
          cursor: pointer;
          transition: box-shadow 0.2s;
          background: white;
        }
        .action-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* ════════════ TOP BAR ════════════ */}
      <header style={{ backgroundColor: navy, padding: "0.75rem 0" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 style={{ width: 16, height: 16, color: gold }} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: gold, lineHeight: 1.2, letterSpacing: "0.04em" }}>ABA</p>
              <p style={{ fontSize: 10, color: "#9ca3af" }}>Member Portal</p>
            </div>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{fullName}</p>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>{tierLabel}</p>
            </div>
            <button
              title="Sign out"
              onClick={() => signOut({ callbackUrl: "/portal" })}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex" }}
            >
              <LogOut style={{ width: 20, height: 20, color: "#9ca3af" }} />
            </button>
          </div>
        </div>
      </header>

      {/* ════════════ SUB-NAV TABS ════════════ */}
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem", display: "flex", gap: "2rem" }}>
          {portalTabs.map((tab) => (
            <button
              key={tab.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0.85rem 0",
                fontSize: 14,
                fontWeight: tab.active ? 600 : 400,
                color: tab.active ? gold : "#6b7280",
                background: "none",
                border: "none",
                borderBottom: tab.active ? `3px solid ${gold}` : "3px solid transparent",
                cursor: "pointer",
                transition: "color 0.15s",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ════════════ MAIN CONTENT ════════════ */}
      <main style={{ maxWidth: "80rem", margin: "0 auto", padding: "1.5rem" }}>

        {/* ─── welcome banner ─── */}
        <div style={{
          backgroundColor: navy,
          borderRadius: 14,
          padding: "2rem 2rem",
          marginBottom: "1.5rem",
        }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "white" }}>
            Welcome back, {firstName}! 👋
          </h1>
          <p style={{ marginTop: 6, fontSize: 15, color: "#d1d5db" }}>
            Here&apos;s what&apos;s happening with your membership
          </p>
        </div>

        {/* ─── stat cards ─── */}
        <div className="grid-4-stat" style={{ marginBottom: "1.5rem" }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              backgroundColor: "white",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              padding: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: `${s.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#6b7280" }}>{s.label}</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── upcoming events + recent activity ─── */}
        <div className="grid-2-col" style={{ marginBottom: "1.5rem" }}>

          {/* upcoming events */}
          <div style={{ backgroundColor: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Upcoming Events</h2>
              <a href="/events" style={{ fontSize: 13, color: gold, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                View All <ArrowRight style={{ width: 14, height: 14 }} />
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {upcomingEvents.map((ev) => (
                <div key={ev.title} style={{
                  borderLeft: `3px solid ${navy}`,
                  padding: "0.75rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{ev.title}</p>
                    <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{ev.date}</p>
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "white",
                    backgroundColor: ev.statusColor,
                    borderRadius: 6,
                    padding: "0.2rem 0.6rem",
                  }}>
                    {ev.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* recent activity */}
          <div style={{ backgroundColor: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "1.5rem" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Recent Activity</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {recentActivity.map((a) => (
                <div key={a.text} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: gold,
                    marginTop: 5,
                    flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{a.text}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── quick actions ─── */}
        <div style={{ backgroundColor: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "1.5rem" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Quick Actions</h2>
          <div className="grid-4-action">
            {quickActions.map((qa) => (
              <div key={qa.title} className="action-card">
                <div style={{ marginBottom: 12 }}>
                  {qa.icon}
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{qa.title}</p>
                <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{qa.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
