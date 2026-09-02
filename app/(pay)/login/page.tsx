import LoginForm from '@/components/pay/LoginForm';

const navy = '#1a2340';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 style={{ color: navy }} className="text-xl font-bold">
        Member Login
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter the email address you registered with — we&apos;ll send you a secure login link.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
