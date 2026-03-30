import { redirect } from "next/navigation";
import { wpGraphQL } from "@/lib/graphql/client";
import { RESET_USER_PASSWORD } from "@/lib/graphql/mutations";
import { AlertCircle } from "lucide-react";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; login?: string; error?: string }>;
}) {
  const { key, login, error } = await searchParams;

  // Render generic placeholder if missing vital security search params.
  if (!key || !login) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Invalid Reset Link</h1>
          <p className="text-sm text-slate-500 mb-6">
            This password reset link is missing credentials, invalid, or has expired.
          </p>
          <a href="/portal/login" className="text-blue-600 hover:underline font-medium">
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  async function resetAction(formData: FormData) {
    "use server";
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const safeLogin = encodeURIComponent(login as string);

    if (password !== confirmPassword) {
      redirect(`/portal/reset-password?key=${key}&login=${safeLogin}&error=mismatch`);
    }

    if (password.length < 8) {
      redirect(`/portal/reset-password?key=${key}&login=${safeLogin}&error=short`);
    }

    let success = false;

    // wpGraphQL throws errors on API failure
    try {
      const data = await wpGraphQL<{ resetUserPassword: { user: { id: string } } }>(
        RESET_USER_PASSWORD,
        { key, login, password }
      );

      if (data?.resetUserPassword?.user) {
        success = true;
      }
    } catch (err) {
      success = false;
    }

    // Safely redirecting outside of try/catch to ensure NEXT_REDIRECT throws aren't suppressed
    if (success) {
      redirect("/portal/login?reset=success");
    } else {
      redirect(`/portal/reset-password?key=${key}&login=${safeLogin}&error=failed`);
    }
  }

  const errorMessages: Record<string, string> = {
    mismatch: "Passwords do not match. Please try again.",
    short: "Password must be at least 8 characters long.",
    failed: "Failed to reset password. The link may have expired.",
  };

  const errorMessage = error ? errorMessages[error] || "Something went wrong." : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
            <p className="mt-1 text-sm text-slate-500">
              Choose a strong password for your member portal
            </p>
          </div>

          <form action={resetAction} className="space-y-4">
            {errorMessage && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-3 text-sm text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 text-white py-2.5 text-sm font-semibold hover:bg-slate-700 transition mt-4"
            >
              Update Password
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Remembered your password?{" "}
            <a href="/portal/login" className="text-blue-600 hover:underline font-medium">
              Return to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
