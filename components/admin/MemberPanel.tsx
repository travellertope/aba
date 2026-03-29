"use client";

import { useState, useEffect } from "react";
import {
  X,
  UserPlus,
  Pencil,
  User,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  FileText,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";


// ─── Types ────────────────────────────────────────────────────

export interface MemberFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  tier: string;
  status: string;
  joinDate: string;
  paymentMethod: string;
  notes: string;
  sendWelcomeEmail: boolean;
}

export interface MemberPanelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  /** Called with the collected form data when admin submits */
  onSubmit?: (data: MemberFormData) => Promise<void>;
  /** Pre-filled data when editing an existing member */
  initialData?: Partial<MemberFormData>;
  /** Display name shown in the header when editing */
  memberName?: string;
}

// ─── Options ──────────────────────────────────────────────────

const membershipTiers = ["Executive", "Professional", "Corporate"];
const memberStatuses = ["Active", "Pending", "Inactive"];
const paymentMethods = ["Bank Transfer", "Card Payment", "Cash", "Other"];

const TIER_PRICES: Record<string, string> = {
  Corporate: "£1,000.00/year",
  Executive: "£300.00/year",
  Professional: "£90.00/year",
};

// ─── Component ────────────────────────────────────────────────

export default function MemberPanel({
  isOpen,
  onClose,
  mode,
  onSubmit,
  initialData,
  memberName,
}: MemberPanelProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [tier, setTier] = useState("");
  const [status, setStatus] = useState("Active");
  const [joinDate, setJoinDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

  // Submission state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);


  // Reset all submission state when the panel opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay so state resets after slide-out animation
      const t = setTimeout(() => {
        setError(null);
        setSuccess(false);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Populate form when opening in edit mode or when initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      setFirstName(initialData.firstName ?? "");
      setLastName(initialData.lastName ?? "");
      setEmail(initialData.email ?? "");
      setPhone(initialData.phone ?? "");
      setCompany(initialData.company ?? "");
      setJobTitle(initialData.jobTitle ?? "");
      setTier(initialData.tier ?? "");
      setStatus(initialData.status ?? "Active");
      setJoinDate(initialData.joinDate ?? new Date().toISOString().slice(0, 10));
      setPaymentMethod(initialData.paymentMethod ?? "");
      setNotes(initialData.notes ?? "");
      setSendWelcomeEmail(initialData.sendWelcomeEmail ?? false);
    } else if (isOpen && !initialData) {
      // Reset form for add mode
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setJobTitle("");
      setTier("");
      setStatus("Active");
      setJoinDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod("");
      setNotes("");
      setSendWelcomeEmail(true);
    }
  }, [isOpen, initialData]);

  const isEdit = mode === "edit";

  // ── Form submission ───────────────────────────────────────
  async function handleSubmit() {
    setError(null);

    // Client-side validation for required fields
    if (!firstName.trim()) return setError("First name is required.");
    if (!lastName.trim())  return setError("Last name is required.");
    if (!email.trim())     return setError("Email address is required.");
    if (!tier)             return setError("Membership tier is required.");

    if (!onSubmit) return;

    setIsLoading(true);
    try {
      await onSubmit({
        firstName,
        lastName,
        email,
        phone,
        company,
        jobTitle,
        tier,
        status,
        joinDate,
        paymentMethod,
        notes,
        sendWelcomeEmail,
      });
      setSuccess(true);
      // Auto-close after a brief success flash
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* ── Panel ── */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[520px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Scrollable content wrapper */}
        <div className="flex flex-col h-full">
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#1a2332] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                {isEdit ? (
                  <Pencil className="w-5 h-5 text-amber-400" />
                ) : (
                  <UserPlus className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {isEdit ? "Edit Member" : "Add New Member"}
                </h2>
                <p className="text-xs text-gray-400">
                  {isEdit
                    ? `Editing ${memberName ?? "member"}`
                    : "Register a new ABA membership"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Body (scrollable) ── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Section: Personal Information */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" />
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Sarah"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Okonkwo"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah.o@techsolutions.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7700 900124"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Section: Company Details */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-500" />
                Company Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Tech Solutions Ltd"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Managing Director"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Section: Membership Configuration */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-amber-500" />
                Membership Configuration
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Membership Tier <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={tier}
                        onChange={(e) => setTier(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      >
                        <option value="" disabled>
                          Select tier
                        </option>
                        {membershipTiers.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      >
                        {memberStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Join Date
                    </label>
                    <input
                      type="date"
                      value={joinDate}
                      onChange={(e) => setJoinDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <div className="relative">
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      >
                        <option value="" disabled>
                          Select method
                        </option>
                        {paymentMethods.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Tier Pricing Hint */}
                {tier && TIER_PRICES[tier] && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    <p className="text-xs text-amber-800">
                      <span className="font-semibold">{tier}</span> tier —{" "}
                      {TIER_PRICES[tier]}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Section: Additional Notes */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                Additional Notes
              </h3>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any relevant notes about this member (e.g. referral source, special interests, event attendance history)..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            {/* Error / Success Banners */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <p className="text-sm text-green-700">
                  {isEdit ? "Member updated!" : "Member created! Closing…"}
                </p>
              </div>
            )}

            {/* Send Welcome Email Toggle */}
            {!isEdit && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Send Welcome Email
                  </p>
                  <p className="text-xs text-gray-500">
                    Notify the member with login and membership details
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSendWelcomeEmail(!sendWelcomeEmail)}
                  disabled={isLoading}
                  className={`w-10 h-6 rounded-full relative shrink-0 transition-colors ${
                    sendWelcomeEmail ? "bg-amber-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      sendWelcomeEmail ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>


          {/* ── Footer (sticky) ── */}
          <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              {!isEdit && (
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-lg border border-[#1a2332] bg-white text-sm font-medium text-[#1a2332] hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Save as Draft
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={isLoading || success}
                className="px-5 py-2.5 rounded-lg bg-[#1a2332] text-white text-sm font-medium hover:bg-[#243044] transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isEdit ? "Updating…" : "Adding…"}
                  </>
                ) : isEdit ? (
                  <>
                    <Pencil className="w-4 h-4" />
                    Update Member
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Add Member
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
