// NextAuth.js v5 route handler
// Handles all /api/auth/* routes: signIn, signOut, session, csrf, callback, etc.
// Do not add any logic here — all config lives in /auth.ts

import { handlers } from '@/auth';

export const { GET, POST } = handlers;
