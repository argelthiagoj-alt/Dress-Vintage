-- ============================================
-- 004 — Row Level Security policies for orders
-- ============================================
-- Run after 002.
--
-- Strategy:
--   - Writes to orders/order_items/order_status_history happen ONLY through
--     server-side service_role (bypasses RLS) in /api/orders/*.
--   - Logged-in users can READ their own orders (auth.uid() = user_id).
--   - Admin reads (via dashboard / future admin panel) should use service_role
--     OR a custom claim 'role' = 'admin' on the JWT. For now, plain user RLS.
-- ============================================

alter table public.orders                enable row level security;
alter table public.order_items           enable row level security;
alter table public.order_status_history  enable row level security;

drop policy if exists "orders_owner_read" on public.orders;
create policy "orders_owner_read" on public.orders
  for select
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "order_items_owner_read" on public.order_items;
create policy "order_items_owner_read" on public.order_items
  for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_status_history_owner_read" on public.order_status_history;
create policy "order_status_history_owner_read" on public.order_status_history
  for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_status_history.order_id
        and o.user_id = auth.uid()
    )
  );

-- No insert/update/delete policies. All writes go through service_role.
