-- Migration: update the pre-order price to the official R1,399.
--
-- Product-card prices across the storefront (home grid, shop grid, PDP) are
-- read live from products.price. The code constants (src/lib/preorder.ts) were
-- set to 1399; run this once against the live database so the cards match.
--
-- Run in the Supabase SQL editor.

update products
set price = 1399
where slug = 'rouge-01';

-- If any compare-at ("was") price was previously set to the old value, clear or
-- adjust it so cards don't show a misleading strike-through. (No-op if null.)
update products
set compare_at_price = null
where slug = 'rouge-01' and compare_at_price = 1800;
