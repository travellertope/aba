import { redirect } from "next/navigation";
import { wpGraphQL } from "@/lib/graphql/client";
import { RESET_USER_PASSWORD } from "@/lib/graphql/mutations";
import { Building2 } from "lucide-react";

/* ─── colour tokens ─── */
const navy = "#1a2340";
const gold = "#d4a843";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; login?: string; error?: string }>;
}) {
  const { key, login, error } = await searchParams;

  // Render generic error placeholder if missing vital security search params.
  if (!key || !login) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: navy,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            backgroundColor: "white",
            borderRadius: 16,
            padding: "2rem 2rem 1.75rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: `2px solid #ef4444`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 24, color: "#ef4444" }}>⚠</span>
            </div>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
            Invalid Reset Link
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
            This password reset link is missing credentials, invalid, or has expired.
          </p>
          <a
            href="/portal/login"
            style={{
              display: "inline-block",
              width: "100%",
              backgroundColor: navy,
              color: "white",
              textDecoration: "none",
              borderRadius: 8,
              padding: "0.85rem",
              fontSize: 15,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: navy,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ─── logo ─── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: `2px solid ${gold}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Building2 style={{ width: 22, height: 22, color: gold }} />
        </div>
        <span
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: gold,
            letterSpacing: "0.12em",
          }}
        >
          ABA
        </span>
      </div>

      {/* ─── heading ─── */}
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "white",
          marginBottom: 6,
        }}
      >
        Set New Password
      </h1>
      <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 32 }}>
        Choose a strong password for your member portal
      </p>

      {/* ─── reset card ─── */}
      <form
        action={resetAction}
        style={{
          width: "100%",
          maxWidth: 480,
          backgroundColor: "white",
          borderRadius: 16,
          padding: "2rem 2rem 1.75rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* error message */}
        {errorMessage && (
          <div style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            padding: "0.75rem 1rem",
            fontSize: 14,
            color: "#dc2626",
            marginBottom: 20,
          }}>
            {errorMessage}
          </div>
        )}

        {/* password field */}
        <label
          htmlFor="password"
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
            marginBottom: 6,
          }}
        >
          New Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          style={{
            width: "100%",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: "0.75rem 1rem",
            fontSize: 14,
            color: "#374151",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 20,
          }}
        />

        {/* confirm password field */}
        <label
          htmlFor="confirmPassword"
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
            marginBottom: 6,
          }}
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          style={{
            width: "100%",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: "0.75rem 1rem",
            fontSize: 14,
            color: "#374151",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 24,
          }}
        />

        {/* reset button */}
        <button
          type="submit"
          style={{
            width: "100%",
            backgroundColor: gold,
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "0.85rem",
            fontSize: 15,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            cursor: "pointer",
          }}
        >
          Update Password
        </button>

        {/* divider */}
        <div
          style={{
            height: 1,
            backgroundColor: "#e5e7eb",
            margin: "1.5rem 0",
          }}
        />

        {/* return link */}
        <p style={{ textAlign: "center", fontSize: 14, color: "#6b7280" }}>
          Remembered your password?{" "}
          <a
            href="/portal/login"
            style={{
              color: gold,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Return to Login
          </a>
        </p>
      </form>
    </div>
  );
}
