// Public-facing layout — wraps all marketing/public pages.
// Add shared Nav and Footer components here once they exist in
// components/public/

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <PublicNav /> */}
      <main className="flex-1">{children}</main>
      {/* <PublicFooter /> */}
    </div>
  );
}
