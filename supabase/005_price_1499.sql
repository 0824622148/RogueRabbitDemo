-- Migration: pre-order price R1,399 -> R1,499.99.
--
-- This is the first price with cents, so the order money columns have to move
-- off int first. Left as int, an insert of 1499.99 rounds to 1500 while PayFast
-- is charged 1499.99, and the ITN amount check (0.01 tolerance in
-- src/lib/payfast.ts) then rejects every notification — paid orders would never
-- leave 'pending'.
--
-- Product-card prices across the storefront (home grid, shop grid, wishlist) are
-- read live from products.price. The code constant (src/lib/preorder.ts) is set
-- to 1499.99; run this once against the live database so the cards match.
--
-- Run in the Supabase SQL editor.

-- 1. Money columns must hold cents. Existing integer rows convert cleanly.
alter table orders alter column amount_due    type numeric(10,2);
alter table orders alter column shipping_cost type numeric(10,2);

-- 2. New price across all footwear.
update products
set price = 1499.99
where category = 'FOOTWEAR';

-- 3. Clear any compare-at ("was") price still pointing at the old value so cards
--    don't show a misleading strike-through. (No-op if null.)
update products
set compare_at_price = null
where category = 'FOOTWEAR' and compare_at_price = 1399;

-- Note: existing 'pending' orders keep their original amounts — those customers
-- were quoted R1,399 and are deliberately not repriced.
