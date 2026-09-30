-- Migration: admin inventory — the team sets stock counts from /admin/inventory.
--
-- Prerequisite: 007_shop_cart_delivery.sql has been run.
-- Additive only: one new table + one function. No existing rows change.
--
-- Run in the Supabase SQL editor.

-- ─── 1. Adjustment log ───────────────────────────────────────────────────────
-- One shared admin login, so this records what changed and why (not who).
create table if not exists stock_adjustments (
  id            serial primary key,
  inventory_id  int references inventory(id) on delete set null,
  old_count     int,
  new_count     int not null,
  reason        text not null,
  created_at    timestamptz not null default now()
);

create index if not exists stock_adjustments_created_idx on stock_adjustments (created_at desc);

-- Server-only via the service role key — no public policies.
alter table stock_adjustments enable row level security;
grant select on stock_adjustments to service_role;

-- ─── 2. Set stock (compare-and-set) ──────────────────────────────────────────
-- Updates only if the count is still what the admin saw when the page loaded
-- (p_expected). If a PayFast sale changed it in between, nothing is written
-- and ok = false with the current count, so an edit never erases a sale.
create or replace function admin_set_stock(
  p_inventory_id int,
  p_expected     int,
  p_new          int,
  p_reason       text
)
returns table (ok boolean, current_count int)
language plpgsql
security definer
set search_path = public
as $$
declare
  stock_now int;
begin
  if p_new is null or p_new < 0 or p_new > 999 then
    raise exception 'stock must be between 0 and 999';
  end if;

  select coalesce(i.stock_count, 0) into stock_now
    from inventory i
   where i.id = p_inventory_id
     for update;

  if not found then
    raise exception 'inventory row % not found', p_inventory_id;
  end if;

  if stock_now is distinct from coalesce(p_expected, 0) then
    ok := false;
    current_count := stock_now;
    return next;
    return;
  end if;

  update inventory
     set stock_count = p_new,
         in_stock    = p_new > 0
   where id = p_inventory_id;

  insert into stock_adjustments (inventory_id, old_count, new_count, reason)
  values (p_inventory_id, stock_now, p_new, coalesce(nullif(trim(p_reason), ''), 'Other'));

  ok := true;
  current_count := p_new;
  return next;
end;
$$;

revoke all on function admin_set_stock(int, int, int, text) from public, anon, authenticated;
grant execute on function admin_set_stock(int, int, int, text) to service_role;
