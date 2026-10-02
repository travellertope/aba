import RegisterForm from '@/components/pay/RegisterForm';
import { TIER_CONFIG } from '@/lib/stripe/plans';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return <RegisterForm tiers={TIER_CONFIG} />;
}
