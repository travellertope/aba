"use client";

import { useState } from "react";
import {
  Upload,
  Download,
  UserPlus,
  FileSpreadsheet,
  Filter,
  Mail,
  Phone,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import MemberPanel from "./MemberPanel";
import type { MemberFormData } from "./MemberPanel";

// ─── Props ────────────────────────────────────────────────────

export interface MemberRow {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tier: string;
  tierColor: string;
  status: string;
  statusColor: string;
  joined: string;
}

export interface MembersUIProps {
  members: MemberRow[];
  totalCount: number;
}

// ─── Component ────────────────────────────────────────────────

export default function MembersUI({ members, totalCount }: MembersUIProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"add" | "edit">("add");
  const [editData, setEditData] = useState<Partial<MemberFormData> | undefined>();
  const [editName, setEditName] = useState<string | undefined>();

  async function handleCreateMember(data: MemberFormData) {
    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        membershipTier: data.tier,
        phone: data.phone || undefined,
        companyName: data.company || undefined,
        jobTitle: data.jobTitle || undefined,
        status: data.status.toLowerCase(),
        joinDate: data.joinDate,
        paymentMethod: data.paymentMethod || undefined,
        notes: data.notes || undefined,
        sendWelcomeEmail: data.sendWelcomeEmail,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create member.");
    }
  }

  function openAddPanel() {
    setPanelMode("add");
    setEditData(undefined);
    setEditName(undefined);
    setPanelOpen(true);
  }

  function openEditPanel(member: MemberRow) {
    const [firstName = "", ...rest] = member.name.split(" ");
    const lastName = rest.join(" ");
    setPanelMode("edit");
    setEditData({
      firstName,
      lastName,
      email: member.email,
      phone: member.phone === "—" ? "" : member.phone,
      company: member.company === "—" ? "" : member.company,
      tier: member.tier,
      status: member.status,
    });
    setEditName(member.name);
    setPanelOpen(true);
  }

  return (
    <>
      <MemberPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        mode={panelMode}
        onSubmit={panelMode === "add" ? handleCreateMember : undefined}
        initialData={editData}
        memberName={editName}
      />

      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Member Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all ABA members
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            Import Members
          </button>
          <button
            onClick={openAddPanel}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a2332] text-white text-sm font-medium hover:bg-[#243044] transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add New Member
          </button>
        </div>
      </div>

      {/* ── CSV Import Banner ── */}
      <div className="bg-white rounded-xl border-2 border-dashed border-amber-300 p-6">
        <div className="flex items-start gap-3 mb-3">
          <FileSpreadsheet className="w-6 h-6 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Import Members via CSV
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Use our standardized template to ensure clean data import.
              Download the template, fill in your member details, and upload
              the completed file.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 ml-9">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a2332] text-white text-sm font-medium hover:bg-[#243044] transition-colors">
            <Download className="w-4 h-4" />
            Download Template
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            Upload CSV
          </button>
        </div>

        <div className="mt-4 ml-9">
          <p className="text-xs font-semibold text-amber-700 mb-1">
            Template includes:
          </p>
          <ul className="text-xs text-blue-600 space-y-0.5 list-disc list-inside">
            <li>Name, Email, Phone (required fields)</li>
            <li>Company, Membership Tier, Status</li>
            <li>Join Date and additional notes</li>
          </ul>
        </div>
      </div>

      {/* ── Search / Filter Bar ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search members by name, email, or company..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
          {/* Dropdowns */}
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option>All Tiers</option>
            <option>Executive</option>
            <option>Professional</option>
            <option>Corporate</option>
          </select>
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Expired</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-3.5 h-3.5" />
              More Filters
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">{totalCount}</span>{" "}
            members
          </p>
        </div>
      </div>

      {/* ── Members Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                  Member
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                  Contact
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                  Company
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                  Tier
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                  Joined
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    No members found.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {/* Member */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#8b7d3c] flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-white">
                            {member.initials}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900 whitespace-nowrap">
                          {member.name}
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-xs whitespace-nowrap">
                            {member.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-xs whitespace-nowrap">
                            {member.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                      {member.company}
                    </td>

                    {/* Tier */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${member.tierColor}`}
                      >
                        {member.tier}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${member.statusColor}`}
                      >
                        {member.status}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                      {member.joined}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditPanel(member)}
                          className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-red-50 text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
