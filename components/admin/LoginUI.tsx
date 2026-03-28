"use client";

import { Shield, Users } from "lucide-react";

interface LoginUIProps {
  action: (formData: FormData) => void;
  errorMessage: string | null;
}

export default function LoginUI({ action, errorMessage }: LoginUIProps) {
  return (
    <div className="min-h-screen bg-[#1a2332] flex flex-col items-center justify-center px-4">
      {/* ── Logo & Heading ── */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full border-2 border-amber-400 flex items-center justify-center">
            <Users className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-[0.25em] text-amber-400">
            ABA
          </h1>
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-gray-400" />
          <h2 className="text-xl font-bold text-white">Admin CRM</h2>
        </div>
        <p className="text-sm text-gray-400">
          Manage members, events, and analytics
        </p>
      </div>

      {/* ── Login Card ── */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-8 pt-8 pb-6">
        <form action={action} className="space-y-5">
          {errorMessage && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Admin Email
            </label>
            <input
              id="username"
              name="username"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@aba.org.uk"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-[#c5a234] hover:bg-[#b8932d] text-white font-bold text-sm tracking-widest uppercase py-4 rounded-xl transition-colors shadow-md"
          >
            SIGN IN TO CRM
          </button>
        </form>

        {/* Divider + Footer */}
        <div className="border-t border-gray-200 mt-6 pt-4">
          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            Admin access only • Secure connection
          </p>
        </div>
      </div>
    </div>
  );
}
