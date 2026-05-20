-- ============================================
-- 003 — PRODUCTS catalog (server-side source of truth for pricing)
-- ============================================
-- The frontend already has a local catalog in data.js. This table mirrors
-- those products so /api/orders/create can re-compute prices server-side
-- (the client cannot be trusted to send the right unit_price).
--
-- Run after 002. See 005_seed_demo.sql for the actual seed rows.
-- ============================================

create table if not exists public.products (
  id              text          primary key,                   -- e.g. 'dv-001'
  slug            text          unique,
  name            text          not null,
  type            text,                                        -- 'hoodie' | 'campera' | etc.
  category        text,                                        -- 'hoodies' | 'camperas' | etc.
  code            text,                                        -- 'DV/HO·001'
  price           numeric(12,2) not null,
  original_price  numeric(12,2),
  short_description  text,
  description     text,
  composition     text,
  care            text,
  primary_image   text,
  active          boolean       not null default true,
  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now()
);

create index if not exists products_active_idx   on public.products (active);
create index if not exists products_category_idx on public.products (category);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- Public can read active products (frontend can list/show via anon key)
alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (active = true);
