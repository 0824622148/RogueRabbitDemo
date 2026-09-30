-- Migration: in-stock apparel shop (cart checkout), Ennerdale local delivery,
-- stock tracking, and a verified-payment timestamp.
--
-- Prerequisite: 006_checkout_lifecycle.sql has been run.
-- Take a backup first (see supabase/backups/).
--
-- IMPORTANT: additive only. No existing order changes status. The single
-- UPDATE below only back-fills paid_at on orders that were already paid.
--
-- Run in the Supabase SQL editor.

-- ─── 0. Helper: drop a CHECK constraint by what it checks ─────────────────────
-- Constraint names can differ between environments (inline checks get
-- auto-generated names), so find them by definition rather than by name.
create or replace function pg_temp.drop_checks_on(p_table regclass, p_column text)
returns void language plpgsql as $$
declare c record;
begin
  for c in
    select conname from pg_constraint
     where conrelid = p_table and contype = 'c'
       and pg_get_constraintdef(oid) ilike '%' || p_column || '%'
  loop
    execute format('alter table %s drop constraint %I', p_table, c.conname);
  end loop;
end;
$$;

-- ─── 1. Orders: multi-item shop orders ───────────────────────────────────────
-- Pre-orders keep their flat single-item columns. Shop orders carry their
-- lines in order_items, so those columns become optional.
alter table orders alter column colourway  drop not null;
alter table orders alter column gender     drop not null;  -- check (M/F) still applies when set
alter table orders alter column size_value drop not null;

alter table orders add column if not exists order_type text not null default 'preorder';
select pg_temp.drop_checks_on('orders', 'order_type');
alter table orders add constraint orders_order_type_check
  check (order_type in ('preorder', 'shop'));

-- Product total before delivery (amount_due = subtotal + shipping_cost).
alter table orders add column if not exists subtotal numeric(10,2);

-- 'local_delivery' = Ennerdale orders the Rouge Rabbit team delivers by hand
-- (never booked with The Courier Guy).
update orders set fulfilment_type = 'delivery' where fulfilment_type is null;
select pg_temp.drop_checks_on('orders', 'fulfilment_type');
alter table orders add constraint orders_fulfilment_type_check
  check (fulfilment_type in ('delivery', 'local_delivery'));

-- ─── 2. Verified payment timestamp ───────────────────────────────────────────
-- Set only by the PayFast ITN handler once a payment is fully verified. The
-- admin dashboard lists orders by this, and the ITN refuses to "re-pay" any
-- order that already has it — so a replayed notification can never pull a
-- shipped/delivered/refunded order back to 'paid'.
alter table orders add column if not exists paid_at timestamptz;

-- Back-fill: anything that has ever been paid. created_at is the best
-- available approximation for legacy rows.
update orders
   set paid_at = created_at
 where paid_at is null
   and (status in ('paid', 'shipped', 'delivered') or pf_payment_id is not null);

create index if not exists orders_paid_at_idx on orders (paid_at);

-- ─── 3. Order lines ──────────────────────────────────────────────────────────
-- Names and prices are snapshotted so later catalogue edits never rewrite
-- what a customer actually bought.
create table if not exists order_items (
  id             serial primary key,
  order_id       int  not null references orders(id) on delete cascade,
  product_id     int  references products(id) on delete set null,
  colourway_id   text references colourways(id) on delete set null,
  inventory_id   int  references inventory(id) on delete set null,
  product_name   text not null,
  colourway_name text,
  size_value     text,
  qty            int  not null check (qty > 0),
  unit_price     numeric(10,2) not null
);

create index if not exists order_items_order_id_idx on order_items (order_id);

-- Server-only via the service role key — no public policies.
alter table order_items enable row level security;
grant all on order_items to service_role;
grant usage, select on sequence order_items_id_seq to service_role;

-- ─── 4. Inventory: unisex sizing ─────────────────────────────────────────────
-- 'U' = unisex (tees, caps). Footwear keeps M/F.
select pg_temp.drop_checks_on('inventory', 'gender');
alter table inventory add constraint inventory_gender_check
  check (gender in ('M', 'F', 'U'));

-- The checkout prices carts server-side with the service role key, which
-- until now only touched orders/members/wishlist. Give it read access to the
-- catalogue (stock updates go through apply_paid_order_stock below).
grant select on products, colourways, product_images, inventory to service_role;

-- ─── 5. Members: shop customers ──────────────────────────────────────────────
select pg_temp.drop_checks_on('members', 'source');
alter table members add constraint members_source_check
  check (source in ('homepage', 'preorder', 'navbar', 'footer', 'wishlist', 'shop'));

-- ─── 6. Stock decrement on verified payment ──────────────────────────────────
-- Called by the ITN handler exactly once per order: only the request whose
-- conditional UPDATE flipped the order to 'paid' gets this far, so a replayed
-- or concurrent notification can never decrement twice.
--
-- Returns the lines that were short (stock below the quantity paid for), so
-- the admin email can flag an oversell — two customers paying for the last
-- unit at the same moment.
create or replace function apply_paid_order_stock(p_order_id int)
returns table (inventory_id int, product_name text, size_value text, qty int, stock_before int)
language plpgsql
security definer
set search_path = public
as $$
declare
  line   record;
  stock_now int;
begin
  for line in
    select oi.inventory_id  as inv_id,
           min(oi.product_name) as pname,
           min(oi.size_value)   as sval,
           sum(oi.qty)::int     as total_qty
      from order_items oi
     where oi.order_id = p_order_id
       and oi.inventory_id is not null
     group by oi.inventory_id
  loop
    -- Row lock so two orders for the same size serialise here.
    select coalesce(i.stock_count, 0) into stock_now
      from inventory i
     where i.id = line.inv_id
       for update;

    if not found then
      continue;
    end if;

    update inventory
       set stock_count = greatest(stock_now - line.total_qty, 0),
           in_stock    = stock_now - line.total_qty > 0
     where id = line.inv_id;

    if stock_now < line.total_qty then
      inventory_id := line.inv_id;
      product_name := line.pname;
      size_value   := line.sval;
      qty          := line.total_qty;
      stock_before := stock_now;
      return next;
    end if;
  end loop;
end;
$$;

revoke all on function apply_paid_order_stock(int) from public, anon, authenticated;
grant execute on function apply_paid_order_stock(int) to service_role;
