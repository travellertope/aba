import Image from 'next/image';
import Link from 'next/link';

const navy = '#1a2340';

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header style={{ backgroundColor: navy }} className="sticky top-0 z-50 w-full">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/register" className="flex items-center gap-3">
            <Image src="/aba-emblem.png" alt="African Business Association, UK" width={40} height={31} priority />
            <div>
              <p className="text-sm font-bold leading-tight text-white">ABA Membership</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Register &amp; Pay</p>
            </div>
          </Link>
          <Link
            href="/login"
            className="text-xs uppercase tracking-wide text-slate-300 hover:text-white"
          >
            Member Login
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-slate-50">{children}</main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} African Business Association
      </footer>
    </div>
  );
}
