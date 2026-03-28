@AGENTS.md

# ABA Membership Platform — Architecture Rules

## Data Fetching
- Pages inside `/app` are **Server Components** by default. They handle all data fetching via `wpGraphQL()` from `@/lib/graphql/client.ts`.
- Never call WPGraphQL directly from a Client Component (`'use client'`). Pass data down as props.
- All WPGraphQL query strings live in `/lib/graphql/queries.ts`. All mutations live in `/lib/graphql/mutations.ts`.
- Authenticated requests must pass the NextAuth session `accessToken` as the Bearer token to `wpGraphQL()`.

## Component Architecture
- All visual UI components must be placed in their respective `/components` subdirectory:
  - `components/public/` — marketing site components
  - `components/portal/` — authenticated member portal components
  - `components/admin/` — admin CRM components
  - `components/shared/` — components used across multiple areas
  - `components/ui/` — Shadcn UI primitives (Button, Card, Input, Table, etc.)
- Pages in `/app` are thin orchestration layers: they fetch data and pass it to components. No inline JSX business logic in page files beyond basic layout.

## TypeScript
- TypeScript interfaces for all data models (Member, Event, Course, etc.) live in `/types/index.ts`.
- All WPGraphQL responses must be typed — no `any`.

## Route Groups & Auth
- `app/(public)/` — no auth required. Public marketing site.
- `app/portal/` — requires valid NextAuth session. Role: any ABA member.
- `app/admin/` — requires session with role `administrator`, `aba_manager`, or `aba_staff`.
- Auth protection is enforced in `middleware.ts` at the project root.

## Styling
- Tailwind CSS only. No inline styles. No CSS modules.
- Use Shadcn UI components from `components/ui/` as base primitives.
- When integrating v0.dev components, **never alter Tailwind classes** — only wire live data into the existing props.

## Environment Variables
- `NEXT_PUBLIC_WP_GRAPHQL_URL` — WordPress GraphQL endpoint (e.g. `https://your-wp-site.com/graphql`)
- `NEXTAUTH_SECRET` — random secret for NextAuth JWT signing
- `NEXTAUTH_URL` — base URL of the Next.js app (e.g. `http://localhost:3000`)
- `STRIPE_SECRET_KEY` — Stripe secret key (server only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key

## WordPress Plugin
- The WordPress backend plugin lives in `wordpress-plugin/aba-platform/aba-platform.php`.
- The WP GraphQL endpoint is `/graphql` on the WP domain.
- JWT auth token is obtained via the `login` mutation and stored in the NextAuth session.
