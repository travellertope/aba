# Security & Privacy Architecture

This document outlines the strict security and privacy architecture rules for the ABA Headless WordPress + Next.js platform. Any human developer or LLM AI Agent modifying this codebase **MUST** adhere to these principles to prevent system vulnerabilities, data leaks, and "infinite charge" (Denial of Wallet) exploits.

## 1. Environment Variable Hygiene
**Rule:** Never expose backend engine URLs, Database URIs, API keys, or GraphQL endpoints to the client bundle unless strictly required for a client SDK (e.g., Stripe Elements).
- **Prohibited:** `NEXT_PUBLIC_WP_GRAPHQL_URL` (This leaks the WordPress backend to malicious scrapers, permitting infinite Introspection Queries that burn host bandwidth).
- **Required:** `WP_GRAPHQL_URL` (Server-only). All requests to WordPress must be proxied through Next.js Server Components, Server Actions, or Route Handlers (`app/api/*`).

## 2. Preventing "Infinite API Charges" (Denial of Wallet)
**Rule:** Assume every public-facing form, Server Action, and API endpoint is a vector for a volumetric attack.
- Vercel bills per Serverless execution. A script hitting an unprotected API endpoint 10,000 times a minute will generate massive, unbounded cloud invoices.
- **Required:** 
  1. All public forms (Login, Password Reset, Registration) must eventually implement Edge-level rate limiting (e.g., Upstash Redis `@upstash/ratelimit`) or a CAPTCHA solution (e.g., Cloudflare Turnstile).
  2. Never place API calls inside an un-memoized React `useEffect` without strict dependency arrays. Client-side infinite loops will incur infinite charges.

## 3. String Input Length Limits (Bcrypt CPU Exhaustion)
**Rule:** All text inputs must be strictly bounded.
- **Prohibited:** Processing un-bounded strings in Server Actions.
- **Required:** HTML forms must specify `maxLength` (e.g., `maxLength={64}` for passwords). Server Actions must explicitly validate data schemas (using Zod) and reject strings exceeding 64 characters before hashing or sending to WordPress. This prevents "Bcrypt DoS" where an attacker submits a 1,000,000 character password to lock up CPU resources.

## 4. Authorization vs Authentication
**Rule:** Admin endpoints must structurally verify roles server-side.
- The `proxy.ts` edge middleware protects routing (`/admin/*`), but the Route Handlers themselves (`app/api/admin/*`) *MUST* also independently verify `session.user.role === 'administrator'` before executing mutations.

---
**LLM AGENT INSTRUCTION:** By reading this file, you agree that any code you write in this repository will enforce these four principles. You will proactively look for length limits, environment var leakage, and unbounded loops.
