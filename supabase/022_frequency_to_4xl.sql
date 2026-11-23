-- Rouge Rabbit — Frequency short set goes up to 4XL (23 Nov 2026).
-- Run AFTER 021_frequency_short_set_live.sql. Adds 2XL, 3XL and 4XL to match
-- the size chart. PLACEHOLDER stock of 10 each, like S–XL — correct it in
-- /admin/inventory.
--
-- Safe to re-run: existing size rows are left as they are (do nothing on
-- conflict), so stock already edited in /admin/inventory is never reset.

begin;

insert into inventory (colourway_id, gender, size_value, in_stock, stock_count, sort_order)
select 'rouge-track-ybr', 'U', sz, true, 10, ord
  from (values ('2XL', 5), ('3XL', 6), ('4XL', 7)) as s(sz, ord)
on conflict (colourway_id, gender, size_value) do nothing;

commit;

-- Check: 7 rows, S → 4XL.
select size_value, stock_count, sort_order
  from inventory
 where colourway_id = 'rouge-track-ybr'
 order by sort_order;
