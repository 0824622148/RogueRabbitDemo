-- Rouge Rabbit — Air Down Tee: add the WHITE colourway (3 Oct 2026).
-- Run AFTER seed_bl_collab.sql. Additive only: BONE stock is untouched.
--
-- Same product (bl-air-down-tee, R399), S–XL, 10 units per size.
-- Images live in public/assets/apparel/ — deploy them before running this.
--
-- Re-runnable, but NOTE re-running RESETS the white stock to 10 — after launch,
-- edit stock from /admin/inventory instead.

begin;

insert into colourways (id, product_id, name, hex, sort_order) values
  ('airdown-wht', (select id from products where slug = 'bl-air-down-tee'), 'WHITE', '#F2F2F2', 2)
on conflict (id) do update
  set product_id = excluded.product_id, name = excluded.name, hex = excluded.hex, sort_order = excluded.sort_order;

delete from product_images where colourway_id = 'airdown-wht';
insert into product_images (colourway_id, view, url) values
  ('airdown-wht', 'FRONT', '/assets/apparel/air-down-white-front.jpg'),
  ('airdown-wht', 'BACK',  '/assets/apparel/air-down-white-back.jpg');

insert into inventory (colourway_id, gender, size_value, in_stock, stock_count, sort_order)
select 'airdown-wht', 'U', sz, true, 10, ord
  from (values ('S', 1), ('M', 2), ('L', 3), ('XL', 4)) as s(sz, ord)
on conflict (colourway_id, gender, size_value) do update
  set stock_count = excluded.stock_count,
      in_stock    = excluded.stock_count > 0,
      sort_order  = excluded.sort_order;

commit;
