-- Rouge Rabbit — Bagged League × Rouge Rabbit collab: 3 tees + 5-panel cap
-- Run AFTER 007_shop_cart_delivery.sql (Supabase → SQL editor).
--
-- Tees R399 (S–XL), caps R249 (ONE SIZE). 10 units per size / colour.
-- Images live in public/assets/apparel/.
--
-- Re-runnable: each block upserts on the natural key. NOTE re-running RESETS
-- stock_count to 10 — after launch, edit stock in Supabase instead.

begin;

-- Retire the template placeholders in case seed_apparel.sql was ever run.
update products set is_active = false
 where slug in ('rr-tee-placeholder', 'rr-cap-placeholder');

-- ─── Products ────────────────────────────────────────────────────────────────
insert into products (name, slug, category, drop_label, price, badge, media_bg, image_contain, image_fit)
values
  ('AIR DOWN TEE',             'bl-air-down-tee',             'APPAREL',     'BL × RR', 399.00, 'NEW', '#fff', 0.9, 'contain'),
  ('PAINT SHOP SPLASH TEE',    'bl-paint-shop-splash-tee',    'APPAREL',     'BL × RR', 399.00, 'NEW', '#fff', 0.9, 'contain'),
  ('PAINT SHOP OVERSPRAY TEE', 'bl-paint-shop-overspray-tee', 'APPAREL',     'BL × RR', 399.00, 'NEW', '#fff', 0.9, 'contain'),
  ('ROUGE 5-PANEL CAP',        'rr-5-panel-cap',              'ACCESSORIES', 'BL × RR', 249.00, 'NEW', '#fff', 0.9, 'contain')
on conflict (slug) do update
  set name = excluded.name, category = excluded.category, drop_label = excluded.drop_label,
      price = excluded.price, badge = excluded.badge, media_bg = excluded.media_bg,
      image_contain = excluded.image_contain, image_fit = excluded.image_fit,
      is_active = true;

-- ─── Colourways ──────────────────────────────────────────────────────────────
-- Cap ids are prefixed: 'obs' / 'car' / 'ice' are already the ROUGE 01 colourways.
insert into colourways (id, product_id, name, hex, sort_order) values
  ('airdown-bone',   (select id from products where slug = 'bl-air-down-tee'),             'BONE',     '#EDE6D6', 1),
  ('splash-wht',     (select id from products where slug = 'bl-paint-shop-splash-tee'),    'WHITE',    '#F2F2F2', 1),
  ('overspray-bone', (select id from products where slug = 'bl-paint-shop-overspray-tee'), 'BONE',     '#EDE6D6', 1),
  ('cap-obs',        (select id from products where slug = 'rr-5-panel-cap'),              'OBSIDIAN', '#0F0F10', 1),
  ('cap-car',        (select id from products where slug = 'rr-5-panel-cap'),              'CARDINAL', '#D90017', 2),
  ('cap-ice',        (select id from products where slug = 'rr-5-panel-cap'),              'ICE',      '#1E6FE0', 3),
  ('cap-snow',       (select id from products where slug = 'rr-5-panel-cap'),              'SNOW',     '#F2F2F2', 4)
on conflict (id) do update
  set product_id = excluded.product_id, name = excluded.name, hex = excluded.hex, sort_order = excluded.sort_order;

-- ─── Images ('FRONT' is the card image) ──────────────────────────────────────
delete from product_images where colourway_id in
  ('airdown-bone', 'splash-wht', 'overspray-bone', 'cap-obs', 'cap-car', 'cap-ice', 'cap-snow');
insert into product_images (colourway_id, view, url) values
  ('airdown-bone',   'FRONT', '/assets/apparel/air-down-front.jpg'),
  ('airdown-bone',   'BACK',  '/assets/apparel/air-down-back.jpg'),
  ('splash-wht',     'FRONT', '/assets/apparel/paint-shop-splash-front.jpg'),
  ('splash-wht',     'BACK',  '/assets/apparel/paint-shop-splash-back.jpg'),
  ('overspray-bone', 'FRONT', '/assets/apparel/paint-shop-overspray-front.jpg'),
  ('overspray-bone', 'BACK',  '/assets/apparel/paint-shop-overspray-back.jpg'),
  ('cap-obs',        'FRONT', '/assets/apparel/cap-obsidian.jpg'),
  ('cap-car',        'FRONT', '/assets/apparel/cap-cardinal.jpg'),
  ('cap-ice',        'FRONT', '/assets/apparel/cap-ice.jpg'),
  ('cap-snow',       'FRONT', '/assets/apparel/cap-snow.jpg');

-- ─── Stock: 10 per size ──────────────────────────────────────────────────────
insert into inventory (colourway_id, gender, size_value, in_stock, stock_count, sort_order)
select cw, 'U', sz, true, 10, ord
  from unnest(array['airdown-bone', 'splash-wht', 'overspray-bone']) as cw
 cross join (values ('S', 1), ('M', 2), ('L', 3), ('XL', 4)) as s(sz, ord)
union all
select cw, 'U', 'ONE SIZE', true, 10, 1
  from unnest(array['cap-obs', 'cap-car', 'cap-ice', 'cap-snow']) as cw
on conflict (colourway_id, gender, size_value) do update
  set stock_count = excluded.stock_count,
      in_stock    = excluded.stock_count > 0,
      sort_order  = excluded.sort_order;

commit;

-- Check what the storefront will see:
-- select p.slug, p.category, p.price, c.id, c.name, i.size_value, i.stock_count, i.in_stock
--   from products p join colourways c on c.product_id = p.id join inventory i on i.colourway_id = c.id
--  where p.category in ('APPAREL', 'ACCESSORIES') and p.is_active order by p.slug, c.sort_order, i.sort_order;
