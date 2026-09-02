import { Fraunces, IBM_Plex_Mono, Work_Sans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
});
const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono-price',
});

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable} flex min-h-full flex-col font-[family-name:var(--font-body)]`}
    >
      <header className="sticky top-0 z-50 w-full bg-[#1a2340]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/register" className="flex items-center gap-3">
            <Image src="/aba-emblem.png" alt="African Business Association, UK" width={34} height={26} priority />
            <div className="leading-tight">
              <p className="text-sm font-bold text-white">African Business Association</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Yorkshire &amp; UK</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              Secure checkout
            </span>
            <Link href="/login" className="text-xs uppercase tracking-wide text-slate-300 hover:text-white">
              Member Login
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-[#faf7f1]">{children}</main>
      <footer className="border-t border-[#e6ddc9] bg-white py-6 text-center text-xs text-[#746b57]">
        African Business Association, Yorkshire — 1 Interchange, Nelson Street, Bradford BD1 5AX
      </footer>
    </div>
  );
}
