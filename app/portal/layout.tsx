// Portal layout — wraps all authenticated member pages.
// Auth protection is handled by middleware.ts (to be added in Step 4).

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* <PortalSidebar /> — add from components/portal/ in Step 3 */}
      <div className="flex-1 flex flex-col">
        {/* <PortalHeader /> */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
