import { stripe } from '@/lib/stripe/server';
import LoginForm from '@/components/pay/LoginForm';

const navy = '#1a2340';

export default async function RegisterSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let email: string | undefined;
  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      email = session.customer_details?.email ?? undefined;
    } catch {
      // Invalid/expired session id — fall through to the generic message.
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 style={{ color: navy }} className="text-2xl font-bold">
        Payment received
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Thank you for registering with the African Business Association. Your account is being set up now — enter
        your email below to get your login link.
      </p>
      <div className="mt-6 text-left">
        <LoginForm defaultEmail={email} />
      </div>
    </div>
  );
}
