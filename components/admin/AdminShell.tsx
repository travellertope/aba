"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  LogOut,
  LayoutDashboard,
  Flame,
  CreditCard,
  Calendar,
  Mic,
  Search,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Warm Leads", href: "/admin/leads", icon: Flame },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Podcasts", href: "/admin/podcasts", icon: Mic },
  { label: "SEO", href: "/admin/seo", icon: Search },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Admin", href: "/admin/settings", icon: Settings },
];

interface AdminShellProps {
  userName: string;
  userRole: string;
  children: React.ReactNode;
}

export default function AdminShell({ userName, userRole, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Header ── */}
      <header className="bg-[#1a2332] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400 flex items-center justify-center">
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-amber-400">
              ABA CRM
            </h1>
            <p className="text-xs text-gray-400">○ Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-xs text-gray-400 capitalize">{userRole.replace(/_/g, " ")}</p>
          </div>
          <Link href="/api/auth/signout">
            <LogOut className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          </Link>
        </div>
      </header>

      {/* ── Navigation ── */}
      <nav className="bg-white border-b border-gray-200 px-6 overflow-x-auto">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "text-amber-600 border-amber-500"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {children}
      </main>
    </div>
  );
}
