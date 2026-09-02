-- ============================================================
-- Standalone Membership Payments — initial schema
-- Deployment: pay.[domain].co.uk
-- ============================================================

create extension if not exists "pgcrypto";

create type pay_membership_tier as enum ('individual', 'sme', 'corporate');
create type pay_billing_interval as enum ('monthly', 'yearly');
create type pay_membership_status as enum ('pending', 'active', 'past_due', 'cancelled');
create type pay_payment_status as enum ('paid', 'failed', 'refunded');

create table members (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,

  first_name text not null check (char_length(first_name) between 1 and 100),
  last_name text not null check (char_length(last_name) between 1 and 100),
  date_of_birth date,
  phone text not null check (char_length(phone) between 1 and 32),
  email text not null unique check (char_length(email) <= 254),

  business_name text check (char_length(business_name) <= 200),
  business_street_address text not null check (char_length(business_street_address) <= 200),
  business_town_city text check (char_length(business_town_city) <= 100),
  business_state_county text check (char_length(business_state_county) <= 100),
  website_address text check (char_length(website_address) <= 200),

  membership_tier pay_membership_tier not null,
  billing_interval pay_billing_interval not null,
  membership_status pay_membership_status not null default 'pending',
  membership_expires_at timestamptz,

  stripe_customer_id text unique,
  stripe_subscription_id text unique,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Corporate membership is annual-only.
  constraint corporate_is_yearly check (
    membership_tier != 'corporate' or billing_interval = 'yearly'
  )
);

create index members_auth_user_id_idx on members(auth_user_id);
create index members_stripe_customer_id_idx on members(stripe_customer_id);

create table payment_history (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,

  stripe_invoice_id text unique,
  stripe_payment_intent_id text,
  amount_pence integer not null check (amount_pence >= 0),
  currency text not null default 'gbp' check (char_length(currency) = 3),
  status pay_payment_status not null,
  description text check (char_length(description) <= 500),
  paid_at timestamptz,

  created_at timestamptz not null default now()
);

create index payment_history_member_id_idx on payment_history(member_id);

-- ── updated_at trigger ─────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger members_set_updated_at
  before update on members
  for each row execute function set_updated_at();

-- ── Row Level Security ──────────────────────────────────────
-- All writes happen server-side via the service role (Stripe webhook,
-- Server Actions). Authenticated members may only ever READ their own row.
alter table members enable row level security;
alter table payment_history enable row level security;

create policy "members read own row"
  on members for select
  using (auth.uid() = auth_user_id);

create policy "members read own payment history"
  on payment_history for select
  using (
    exists (
      select 1 from members
      where members.id = payment_history.member_id
      and members.auth_user_id = auth.uid()
    )
  );
