"use client";

import {
  Users,
  CalendarDays,
  CreditCard,
  Search,
  Download,
  Filter,
  Mail,
  Eye,
  PoundSterling,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Icon map ─────────────────────────────────────────────────

const statIconMap: Record<string, LucideIcon> = {
  PoundSterling,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
};

// ─── Props ────────────────────────────────────────────────────

export interface RevenueStat {
  label: string;
  value: string;
  sub: string;
  subColor: string;
  iconKey: string;
  iconColor: string;
  borderColor: string;
}

export interface TierBreakdown {
  name: string;
  badgeColor: string;
  activeMembers: number;
  annualRevenue: string;
  pricePerMember: string;
}

export interface FailedPayment {
  name: string;
  email: string;
  reason: string;
  amount: string;
  tier: string;
  retryDate: string;
}

export interface Transaction {
  id: string;
  name: string;
  email: string;
  txId: string;
  amount: string;
  tier: string;
  tierColor: string;
  status: "Succeeded" | "Failed" | "Pending";
  statusSub: string;
  date: string;
  time: string;
  nextDate: string;
  method: string;
}

export interface PaymentsUIProps {
  stats: RevenueStat[];
  tiers: TierBreakdown[];
  failedPayments: FailedPayment[];
  transactions: Transaction[];
  totalTransactions: number;
}

// ─── Status Badge ─────────────────────────────────────────────

function StatusBadge({ status, sub }: { status: string; sub: string }) {
  if (status === "Succeeded") {
    return (
      <div className="flex items-center gap-1">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
          {status}
        </span>
      </div>
    );
  }
  if (status === "Failed") {
    return (
      <div>
        <div className="flex items-center gap-1">
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
            {status}
          </span>
        </div>
        {sub && (
          <p className="text-[10px] text-red-500 mt-0.5 ml-5">{sub}</p>
        )}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <Clock className="w-4 h-4 text-amber-500" />
      <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
        {status}
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────

export default function PaymentsUI({
  stats,
  tiers,
  failedPayments,
  transactions,
  totalTransactions,
}: PaymentsUIProps) {
  return (
    <>
      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Payment Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor revenue, subscriptions, and payment status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a2332] text-white text-sm font-medium hover:bg-[#243044] transition-colors">
            <RefreshCw className="w-4 h-4" />
            Sync Stripe
          </button>
        </div>
      </div>

      {/* ── Revenue Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = statIconMap[stat.iconKey] ?? PoundSterling;
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
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-xs mt-0.5 ${stat.subColor}`}>{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Membership Tier Breakdown ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-5 h-5 text-gray-500" />
          <h3 className="text-base font-bold text-gray-900">
            Membership Tier Breakdown
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${tier.badgeColor}`}
                >
                  {tier.name}
                </span>
                <CreditCard className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">Active Members</p>
              <p className="text-2xl font-bold text-gray-900 mb-3">
                {tier.activeMembers}
              </p>
              <p className="text-xs text-gray-500">Annual Revenue</p>
              <p className="text-lg font-bold text-gray-900 mb-2">
                {tier.annualRevenue}
              </p>
              <p className="text-xs text-gray-500">Price per Member</p>
              <p className="text-sm font-semibold text-gray-700">
                {tier.pricePerMember}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Failed Payments Alert ── */}
      {failedPayments.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-red-300 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold text-gray-900">
              Failed Payments Require Attention
            </h3>
          </div>
          <p className="text-sm text-red-500 mb-4">
            {failedPayments.length} payment{failedPayments.length === 1 ? " has" : "s have"} failed and require{failedPayments.length === 1 ? "s" : ""} immediate action to prevent
            subscription cancellation.
          </p>
          <div className="space-y-3">
            {failedPayments.map((fp) => (
              <div
                key={fp.email}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 rounded-lg border border-gray-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {fp.name}
                  </p>
                  <p className="text-xs text-gray-500">{fp.email}</p>
                  <p className="text-xs">
                    <span className="font-semibold text-red-600">Reason:</span>{" "}
                    <span className="text-red-500">{fp.reason}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {fp.amount}
                    </p>
                    <p className="text-xs text-gray-500">{fp.tier}</p>
                    <p className="text-xs text-red-500">{fp.retryDate}</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry Now
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a2332] text-white text-xs font-medium hover:bg-[#243044] transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    Contact
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
              placeholder="Search by customer, email, or transaction ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option>All Status</option>
            <option>Succeeded</option>
            <option>Failed</option>
            <option>Pending</option>
          </select>
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option>All Tiers</option>
            <option>Corporate</option>
            <option>Executive</option>
            <option>Professional</option>
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
            Showing <span className="font-bold text-gray-900">{totalTransactions}</span>{" "}
            transactions
          </p>
        </div>
      </div>

      {/* ── Recent Transactions Table ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-5 h-5 text-gray-500" />
          <h3 className="text-base font-bold text-gray-900">
            Recent Transactions
          </h3>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                    Customer
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                    Transaction ID
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                    Amount
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                    Tier
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                    Date
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                    Payment Method
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {tx.name}
                        </p>
                        <p className="text-[11px] text-gray-500">{tx.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-600 font-mono">
                          {tx.txId}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {tx.amount}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${tx.tierColor}`}
                        >
                          {tx.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={tx.status} sub={tx.statusSub} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-700">{tx.date}</p>
                        <p className="text-xs text-gray-700">{tx.time}</p>
                        {tx.nextDate && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {tx.nextDate}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {tx.method.split("\n").map((line, li) => (
                          <p key={li} className="text-xs text-gray-600">
                            {line}
                          </p>
                        ))}
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
