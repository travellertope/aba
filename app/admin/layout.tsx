// Admin layout — wraps all admin/CRM pages.
// Only accessible to administrator, aba_manager, and aba_staff roles.
// Role check is enforced in middleware.ts.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/portal/login");

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role ?? "administrator"}
    >
      {children}
    </AdminShell>
  );
}
