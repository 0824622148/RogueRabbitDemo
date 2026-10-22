-- Rouge Rabbit — Signal + Beauty in Contrast tees go up to 3XL (22 Oct 2026).
-- Run AFTER 017_signal_bic_products.sql. Adds 2XL and 3XL (25 units each) to
-- both colourways; S–XL are untouched.
--
-- Safe to re-run: existing size rows are left as they are (do nothing on
-- conflict), so stock already edited in /admin/inventory is never reset.

begin;

insert into inventory (colourway_id, gender, size_value, in_stock, stock_count, sort_order)
select cw, 'U', sz, true, 25, ord
  from (values ('signal-blk'), ('bic-wht')) as c(cw)
 cross join (values ('2XL', 5), ('3XL', 6)) as s(sz, ord)
on conflict (colourway_id, gender, size_value) do nothing;

commit;

-- Check: 6 rows per colourway, S → 3XL.
select colourway_id, size_value, stock_count, sort_order
  from inventory
 where colourway_id in ('signal-blk', 'bic-wht')
 order by colourway_id, sort_order;
