// Portal layout — authenticated member shell.
// Middleware guarantees only logged-in users reach child routes.

import { auth, signOut } from '@/auth';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  async function handleSignOut() {
    'use server';
    await signOut({ redirectTo: '/portal/login' });
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar — replace with components/portal/PortalSidebar.tsx in Step 3 */}
      <aside className="hidden md:flex w-56 flex-col bg-white border-r border-slate-200">
        <div className="px-4 py-5 border-b border-slate-100">
          <span className="text-lg font-bold text-slate-900">ABA</span>
          <span className="ml-1 text-xs text-slate-400">Member Portal</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          {[
            { href: '/portal/dashboard', label: 'Dashboard' },
            { href: '/events', label: 'Events' },
            { href: '/portal/courses', label: 'Courses' },
            { href: '/portal/directory', label: 'Directory' },
            { href: '/portal/profile', label: 'My Profile' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-700 truncate">{session?.user.name}</p>
          <p className="text-xs text-slate-400 capitalize truncate">
            {session?.user.membershipTier ?? 'Member'}
          </p>
          <form action={handleSignOut} className="mt-2">
            <button
              type="submit"
              className="text-xs text-red-500 hover:text-red-700 hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
