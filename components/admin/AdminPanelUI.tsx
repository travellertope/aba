"use client";

import {
  Users,
  Download,
  Search,
  Settings,
  Shield,
  CheckCircle2,
  XCircle,
  UserPlus,
  Mail,
  Phone,
  Pencil,
  Trash2,
  KeyRound,
  AlertCircle,
  Filter,
  type LucideIcon,
} from "lucide-react";

// ─── Icon Map (server passes string keys) ─────────────────────

const iconMap: Record<string, LucideIcon> = {
  Users,
  CheckCircle2,
  Shield,
  UserPlus,
  Settings,
};

// ─── Prop Types ───────────────────────────────────────────────

export interface AdminStat {
  label: string;
  value: string;
  sub: string;
  iconKey: string;
  iconColor: string;
  borderColor: string;
}

export interface AdminUser {
  initials: string;
  name: string;
  joined: string;
  email: string;
  phone: string;
  role: string;
  roleColor: string;
  status: string;
  statusColor: string;
  mfa: string;
  mfaEnabled: boolean;
  lastLogin: string;
  permissions: string[];
  extraPerms: number;
  highlightPerm: boolean;
  showMfaAction: boolean;
}

export interface SecurityAlert {
  message: string;
  usersWithoutMfa: number;
}

export interface AdminPanelProps {
  stats: AdminStat[];
  users: AdminUser[];
  totalUsers: number;
  securityAlert: SecurityAlert | null;
}

// ─── Component ────────────────────────────────────────────────

export default function AdminPanelUI({
  stats,
  users,
  totalUsers,
  securityAlert,
}: AdminPanelProps) {
  return (
    <div className="space-y-6">
      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage CRM users, roles, and security settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Users
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a2332] text-white text-sm font-medium hover:bg-[#243044] transition-colors">
            <UserPlus className="w-4 h-4" />
            Invite User
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

      {/* ── Security Recommendation ── */}
      {securityAlert && securityAlert.usersWithoutMfa > 0 && (
        <div className="bg-white rounded-xl border-2 border-amber-300 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-gray-900">
              Security Recommendation
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {securityAlert.message}
          </p>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
            <KeyRound className="w-4 h-4" />
            Enforce MFA for All Users
          </button>
        </div>
      )}

      {/* ── Search / Filter Bar ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option>All Roles</option>
            <option>Super Admin</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Staff</option>
          </select>
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option>All Status</option>
            <option>Active</option>
            <option>Invited</option>
            <option>Disabled</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-3.5 h-3.5" />
              More Filters
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Shield className="w-3.5 h-3.5" />
              MFA Only
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">{totalUsers}</span> users
          </p>
        </div>
      </div>

      {/* ── Users Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  User
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Contact
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Role
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  MFA
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Last Login
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Permissions
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.initials}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors align-top"
                >
                  {/* User */}
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#8b7d3c] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[11px] font-bold text-white">
                          {user.initials}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-tight">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {user.joined}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate max-w-[160px]">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                        {user.phone}
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded ${user.roleColor}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${user.statusColor}`}>
                      {user.status}
                    </span>
                  </td>

                  {/* MFA */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {user.mfaEnabled ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          user.mfaEnabled
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {user.mfa}
                      </span>
                    </div>
                  </td>

                  {/* Last Login */}
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                    {user.lastLogin}
                  </td>

                  {/* Permissions */}
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      {user.permissions.map((perm, i) => (
                        <p
                          key={i}
                          className={`text-xs font-medium ${
                            user.highlightPerm && i > 0
                              ? "text-amber-700 bg-amber-50 px-1 rounded"
                              : "text-blue-600"
                          }`}
                        >
                          {perm}
                        </p>
                      ))}
                      {user.extraPerms > 0 && (
                        <p className="text-[11px] text-gray-400">
                          +{user.extraPerms}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      {user.showMfaAction && (
                        <button className="p-1.5 rounded hover:bg-amber-50 text-amber-500 transition-colors">
                          <KeyRound className="w-4 h-4" />
                        </button>
                      )}
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
