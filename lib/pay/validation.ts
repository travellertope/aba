// ============================================================
// Registration form validation.
// Per SECURITY.md §3: every text input is length-bounded and
// validated server-side before it touches Supabase or Stripe.
// ============================================================
import { z } from 'zod';

export const registrationSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(1).max(32),
  email: z.string().trim().email().max(254),
  businessName: z.string().trim().max(200).optional().default(''),
  businessStreetAddress: z.string().trim().min(1).max(200),
  businessTownCity: z.string().trim().max(100).optional().default(''),
  businessStateCounty: z.string().trim().max(100).optional().default(''),
  websiteAddress: z
    .string()
    .trim()
    .max(200)
    .optional()
    .default('')
    .refine((v) => !v || /^https?:\/\//i.test(v) || !v.includes(' '), 'Invalid website address'),
  tier: z.enum(['individual', 'sme', 'corporate']),
  interval: z.enum(['monthly', 'yearly']),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
