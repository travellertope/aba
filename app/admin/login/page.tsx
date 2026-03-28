// Admin Login Page — Server Component
// Uses the same Auth.js v5 server action pattern as the portal login,
// but redirects to /admin/dashboard and enforces admin role check.

import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import LoginUI from "@/components/admin/LoginUI";

const ADMIN_ROLES = new Set(["administrator", "aba_manager", "aba_staff"]);

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();

  // Already logged in with an admin role — go straight to dashboard
  if (session && ADMIN_ROLES.has(session.user.role)) {
    redirect("/admin/dashboard");
  }

  const { error } = await searchParams;

  const errorMessages: Record<string, string> = {
    CredentialsSignin: "Invalid email or password. Please try again.",
    AccessDenied: "Your account does not have admin access.",
    Default: "Something went wrong. Please try again.",
  };

  const errorMessage = error
    ? (errorMessages[error] ?? errorMessages.Default)
    : null;

  async function loginAction(formData: FormData) {
    "use server";

    let loginResult;
    try {
      loginResult = await signIn("credentials", {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        redirect: false,
      });
    } catch (err) {
      if (err instanceof AuthError) {
        redirect(`/admin/login?error=${err.type}`);
      }
      throw err;
    }

    // After successful sign-in, verify the user has an admin role
    const session = await auth();
    if (!session || !ADMIN_ROLES.has(session.user.role)) {
      // Sign out the non-admin user silently and show access denied
      redirect("/admin/login?error=AccessDenied");
    }

    redirect("/admin/dashboard");
  }

  return <LoginUI action={loginAction} errorMessage={errorMessage} />;
}
