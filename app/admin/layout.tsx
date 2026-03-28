// Admin layout — wraps all admin/CRM pages.
// Only accessible to administrator, aba_manager, and aba_staff roles.
// Role check is enforced in middleware.ts.
//
// When unauthenticated, renders children directly (the login page
// provides its own full-page layout). Authenticated pages get
// the AdminShell wrapper (header + nav).

import { auth } from "@/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // No session — render children bare (login page handles its own layout)
  if (!session) {
    return <>{children}</>;
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
