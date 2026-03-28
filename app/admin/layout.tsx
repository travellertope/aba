// Admin layout — wraps all admin/CRM pages.
// Only accessible to administrator, aba_manager, and aba_staff roles.
//
// When unauthenticated, renders children directly (the login page
// provides its own full-page layout). Authenticated admin users get
// the AdminShell wrapper (header + nav).
// Authenticated non-admin users are redirected to the member portal.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

const ADMIN_ROLES = new Set(["administrator", "aba_manager", "aba_staff"]);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // No session — render children bare (login page handles its own layout)
  if (!session) {
    return <>{children}</>;
  }

  // Authenticated but not an admin — redirect to member portal
  if (!ADMIN_ROLES.has(session.user.role)) {
    redirect("/portal/dashboard");
  }

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role ?? "administrator"}
    >
      {children}
    </AdminShell>
  );
}
