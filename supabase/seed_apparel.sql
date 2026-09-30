-- Rouge Rabbit — Apparel & accessories seed (TEMPLATE)
-- Run AFTER 007_shop_cart_delivery.sql.
--
-- ⚠ Replace every PLACEHOLDER below with the client's product sheet before
--   running: names, prices, colours, sizes, STOCK COUNTS and image paths.
--
-- Rules the storefront relies on:
--   * category must be exactly 'APPAREL' (tees) or 'ACCESSORIES' (caps).
--   * slug must be unique and URL-safe — it becomes /shop/<slug>.
--   * colourways.id is a short unique text key (it appears in URLs: ?colour=).
--   * inventory.gender = 'U' (unisex). Caps use a single size 'ONE SIZE'.
--   * stock_count MUST be set — a size with null/0 stock can't be bought.
--     It goes down automatically when PayFast confirms a payment.
--   * product_images.view: 'FRONT' is the card/thumbnail image, 'BACK' optional.
--     Put image files in public/assets/apparel/.
--
-- Re-runnable: each block upserts on the natural key. NOTE re-running RESETS
-- stock_count to the numbers below — after launch, edit stock in Supabase instead.

begin;

-- ─── T-SHIRT (repeat this block per tee style) ───────────────────────────────
insert into products (name, slug, category, drop_label, price, badge, media_bg, image_contain, image_fit)
values ('RR TEE PLACEHOLDER', 'rr-tee-placeholder', 'APPAREL', 'DROP 004', 499.00, 'NEW', '#1E1E20', 0.9, 'contain')
on conflict (slug) do update
  set name = excluded.name, category = excluded.category, drop_label = excluded.drop_label,
      price = excluded.price, badge = excluded.badge, media_bg = excluded.media_bg,
      is_active = true;

insert into colourways (id, product_id, name, hex, sort_order) values
  ('tee-blk', (select id from products where slug = 'rr-tee-placeholder'), 'BLACK', '#0F0F10', 1),
  ('tee-wht', (select id from products where slug = 'rr-tee-placeholder'), 'WHITE', '#F2F2F2', 2)
on conflict (id) do update set name = excluded.name, hex = excluded.hex, sort_order = excluded.sort_order;

delete from product_images where colourway_id in ('tee-blk', 'tee-wht');
insert into product_images (colourway_id, view, url) values
  ('tee-blk', 'FRONT', '/assets/apparel/tee-black-front.png'),
  ('tee-blk', 'BACK',  '/assets/apparel/tee-black-back.png'),
  ('tee-wht', 'FRONT', '/assets/apparel/tee-white-front.png'),
  ('tee-wht', 'BACK',  '/assets/apparel/tee-white-back.png');

-- Stock per colour + size (PLACEHOLDER counts)
insert into inventory (colourway_id, gender, size_value, in_stock, stock_count, sort_order) values
  ('tee-blk', 'U', 'S',   true, 10, 1),
  ('tee-blk', 'U', 'M',   true, 10, 2),
  ('tee-blk', 'U', 'L',   true, 10, 3),
  ('tee-blk', 'U', 'XL',  true, 10, 4),
  ('tee-blk', 'U', 'XXL', true,  5, 5),
  ('tee-wht', 'U', 'S',   true, 10, 1),
  ('tee-wht', 'U', 'M',   true, 10, 2),
  ('tee-wht', 'U', 'L',   true, 10, 3),
  ('tee-wht', 'U', 'XL',  true, 10, 4),
  ('tee-wht', 'U', 'XXL', true,  5, 5)
on conflict (colourway_id, gender, size_value) do update
  set stock_count = excluded.stock_count,
      in_stock    = excluded.stock_count > 0,
      sort_order  = excluded.sort_order;

-- ─── CAP (repeat this block per cap style) ───────────────────────────────────
insert into products (name, slug, category, drop_label, price, badge, media_bg, image_contain, image_fit)
values ('RR CAP PLACEHOLDER', 'rr-cap-placeholder', 'ACCESSORIES', 'DROP 004', 349.00, 'NEW', '#1E1E20', 0.8, 'contain')
on conflict (slug) do update
  set name = excluded.name, category = excluded.category, drop_label = excluded.drop_label,
      price = excluded.price, badge = excluded.badge, media_bg = excluded.media_bg,
      is_active = true;

insert into colourways (id, product_id, name, hex, sort_order) values
  ('cap-blk', (select id from products where slug = 'rr-cap-placeholder'), 'BLACK', '#0F0F10', 1),
  ('cap-red', (select id from products where slug = 'rr-cap-placeholder'), 'CARDINAL', '#D90017', 2)
on conflict (id) do update set name = excluded.name, hex = excluded.hex, sort_order = excluded.sort_order;

delete from product_images where colourway_id in ('cap-blk', 'cap-red');
insert into product_images (colourway_id, view, url) values
  ('cap-blk', 'FRONT', '/assets/apparel/cap-black-front.png'),
  ('cap-red', 'FRONT', '/assets/apparel/cap-red-front.png');

insert into inventory (colourway_id, gender, size_value, in_stock, stock_count, sort_order) values
  ('cap-blk', 'U', 'ONE SIZE', true, 20, 1),
  ('cap-red', 'U', 'ONE SIZE', true, 20, 1)
on conflict (colourway_id, gender, size_value) do update
  set stock_count = excluded.stock_count,
      in_stock    = excluded.stock_count > 0,
      sort_order  = excluded.sort_order;

commit;

-- Check what the storefront will see:
-- select p.slug, p.category, p.price, c.id, c.name, i.size_value, i.stock_count, i.in_stock
--   from products p join colourways c on c.product_id = p.id join inventory i on i.colourway_id = c.id
--  where p.category in ('APPAREL', 'ACCESSORIES') order by p.slug, c.sort_order, i.sort_order;
