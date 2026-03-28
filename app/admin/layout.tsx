// Admin layout — wraps all admin/CRM pages.
// Only accessible to administrator, aba_manager, and aba_staff roles.
// Role check is enforced in middleware.ts (Step 4).

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* <AdminSidebar /> — add from components/admin/ in Step 3 */}
      <div className="flex-1 flex flex-col">
        {/* <AdminHeader /> */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
