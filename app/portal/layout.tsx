// Portal layout — authenticated shell.
// DashboardUI (and future portal pages) provide their own full-page layout,
// so this layout is intentionally a passthrough.

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
