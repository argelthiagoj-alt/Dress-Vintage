-- ============================================
-- 001 — NEWSLETTER SUBSCRIBERS
-- ============================================
-- Paste this into the Supabase SQL editor (Database → SQL Editor → New query)
-- and run. Re-running is idempotent.
-- ============================================

create extension if not exists "pgcrypto";

create table if not exists public.newsletter_subscribers (
  id                  uuid        primary key default gen_random_uuid(),
  email               text        not null unique,
  status              text        not null default 'active'
                                  check (status in ('active', 'unsubscribed')),
  consent_at          timestamptz not null default now(),
  source              text,                                  -- e.g. 'footer', 'checkout'
  unsubscribe_token   text        not null default replace(gen_random_uuid()::text, '-', ''),
  subscribed_at       timestamptz not null default now(),
  unsubscribed_at     timestamptz
);

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status);

create unique index if not exists newsletter_subscribers_token_idx
  on public.newsletter_subscribers (unsubscribe_token);

-- Lock down: all reads/writes must go through the server (service_role bypasses RLS).
alter table public.newsletter_subscribers enable row level security;

-- NO public policies. The anon key cannot read or write this table.
-- If you ever want public unsubscribe by token without going through the API,
-- add a policy here. Otherwise the /api/newsletter/unsubscribe route handles it.
