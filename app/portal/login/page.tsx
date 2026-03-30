// Member Login Page
// Uses Auth.js v5 Server Action pattern — no client-side signIn() call needed.
// The <form action={loginAction}> posts credentials to the server action,
// which calls signIn() and redirects on success.

import { redirect } from 'next/navigation';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';

// If the user is already logged in, send them to the dashboard
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; reset?: string }>;
}) {
  const session = await auth();
  if (session) redirect('/portal/dashboard');

  const { callbackUrl, error, reset } = await searchParams;

  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Invalid email or password. Please try again.',
    Default: 'Something went wrong. Please try again.',
  };

  const errorMessage = error ? (errorMessages[error] ?? errorMessages.Default) : null;

  async function loginAction(formData: FormData) {
    'use server';
    try {
      await signIn('credentials', {
        username: formData.get('username') as string,
        password: formData.get('password') as string,
        redirectTo: callbackUrl ?? '/portal/dashboard',
      });
    } catch (err) {
      // Auth.js throws a redirect on success — only catch real errors
      if (err instanceof AuthError) {
        redirect(`/portal/login?error=${err.type}`);
      }
      throw err; // Re-throw redirect signals
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Replace with components/portal/LoginForm.tsx from v0.dev in Step 3 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Member Login</h1>
            <p className="mt-1 text-sm text-slate-500">Access your ABA member dashboard</p>
          </div>

          <form action={loginAction} className="space-y-4">
            {errorMessage && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
            
            {reset === 'success' && (
              <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                Password updated successfully. You may now log in.
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <input
                id="username"
                name="username"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <a href="/portal/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 text-white py-2.5 text-sm font-semibold hover:bg-slate-700 transition"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Not a member?{' '}
            <a href="/membership" className="text-blue-600 hover:underline font-medium">
              Join the ABA
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
