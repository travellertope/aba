import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { AuthError } from 'next-auth';

/* ─── colour tokens ─── */
const navy = "#1a2340";
const gold = "#d4a843";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; reset?: string }>;
}) {
  const session = await auth();
  if (session) redirect('/portal/dashboard');

  const { callbackUrl, error, reset } = await searchParams;

  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Invalid email or password. Please try again.',
  };
  const errorMessage = error ? errorMessages[error] || 'Something went wrong.' : null;

  async function loginAction(formData: FormData) {
    'use server';
    try {
      await signIn('credentials', formData);
    } catch (err) {
      if (err instanceof AuthError) {
        redirect(`/portal/login?error=${err.type}&callbackUrl=${callbackUrl || ''}`);
      }
      throw err; // Re-throw Next.js redirect signals
    }
  }

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
        Member Portal
      </h1>
      <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 32 }}>
        Access your membership dashboard
      </p>

      {/* ─── login card ─── */}
      <form
        action={loginAction}
        style={{
          width: "100%",
          maxWidth: 480,
          backgroundColor: "white",
          borderRadius: 16,
          padding: "2rem 2rem 1.75rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <input type="hidden" name="redirectTo" value={callbackUrl || '/portal/dashboard'} />

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

        {/* success message */}
        {reset === 'success' && (
          <div style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 8,
            padding: "0.75rem 1rem",
            fontSize: 14,
            color: "#15803d",
            marginBottom: 20,
          }}>
            Password updated successfully. You may now log in.
          </div>
        )}

        {/* email field */}
        <label
          htmlFor="username"
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
            marginBottom: 6,
          }}
        >
          Email Address
        </label>
        <input
          id="username"
          name="username"
          type="email"
          placeholder="your.email@example.com"
          required
          maxLength={64}
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
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          maxLength={64}
          style={{
            width: "100%",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: "0.75rem 1rem",
            fontSize: 14,
            color: "#374151",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 16,
          }}
        />

        {/* remember me + forgot password */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              color: "#374151",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              style={{ width: 16, height: 16, accentColor: gold, cursor: "pointer" }}
            />
            Remember me
          </label>
          <a
            href="/portal/forgot-password"
            style={{
              fontSize: 14,
              color: gold,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Forgot password?
          </a>
        </div>

        {/* sign in button */}
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
          Sign In
        </button>

        {/* divider */}
        <div
          style={{
            height: 1,
            backgroundColor: "#e5e7eb",
            margin: "1.5rem 0",
          }}
        />

        {/* join link */}
        <p style={{ textAlign: "center", fontSize: 14, color: "#6b7280" }}>
          Not a member yet?{" "}
          <a
            href="/membership"
            style={{
              color: gold,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Join ABA
          </a>
        </p>
      </form>
    </div>
  );
}
