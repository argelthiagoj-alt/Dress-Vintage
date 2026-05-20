-- ============================================
-- 002 — ORDERS, ORDER_ITEMS, ORDER_STATUS_HISTORY
-- ============================================
-- Run after 001. References auth.users(id) which Supabase provides automatically.
-- ============================================

-- ---- updated_at trigger helper ----
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---- orders ----
create table if not exists public.orders (
  id                      uuid          primary key default gen_random_uuid(),
  order_number            text          not null unique,           -- e.g. DV-ORD-20260519-0001
  user_id                 uuid          references auth.users(id) on delete set null,
  customer_email          text          not null,
  customer_name           text          not null,
  customer_phone          text,
  shipping_method         text          not null,                  -- 'domicilio' | 'sucursal' | 'taller'
  shipping_address        text,
  shipping_city           text,
  shipping_postal_code    text,
  shipping_tracking_code  text,
  payment_method          text          not null,                  -- 'mercado_pago' | 'transferencia' | 'efectivo'
  payment_status          text          not null default 'pending_payment'
                                        check (payment_status in
                                          ('pending_payment', 'paid', 'rejected', 'refunded')),
  order_status            text          not null default 'pending'
                                        check (order_status in
                                          ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
  subtotal                numeric(12,2) not null,
  discount                numeric(12,2) not null default 0,
  shipping_cost           numeric(12,2) not null,
  total                   numeric(12,2) not null,
  notes                   text,
  created_at              timestamptz   not null default now(),
  updated_at              timestamptz   not null default now()
);

create index if not exists orders_user_id_idx          on public.orders (user_id);
create index if not exists orders_customer_email_idx   on public.orders (customer_email);
create index if not exists orders_created_at_idx       on public.orders (created_at desc);
create index if not exists orders_payment_status_idx   on public.orders (payment_status);
create index if not exists orders_order_status_idx     on public.orders (order_status);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- ---- order_items ----
create table if not exists public.order_items (
  id            uuid          primary key default gen_random_uuid(),
  order_id      uuid          not null references public.orders(id) on delete cascade,
  product_id    text          not null,
  product_name  text          not null,
  size          text,
  color         text,
  qty           integer       not null check (qty > 0),
  unit_price    numeric(12,2) not null,
  subtotal      numeric(12,2) not null,
  image         text,
  created_at    timestamptz   not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ---- order_status_history ----
create table if not exists public.order_status_history (
  id           uuid        primary key default gen_random_uuid(),
  order_id     uuid        not null references public.orders(id) on delete cascade,
  status       text        not null,
  note         text,
  changed_by   uuid        references auth.users(id) on delete set null,
  changed_at   timestamptz not null default now()
);

create index if not exists order_status_history_order_id_idx
  on public.order_status_history (order_id);
