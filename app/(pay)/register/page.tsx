import RegisterForm from '@/components/pay/RegisterForm';
import { TIER_CONFIG } from '@/lib/stripe/plans';

export default function RegisterPage() {
  return <RegisterForm tiers={TIER_CONFIG} />;
}
