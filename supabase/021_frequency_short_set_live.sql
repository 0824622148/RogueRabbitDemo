-- Rouge Rabbit — FREQUENCY SHORT SET goes live (23 Nov 2026).
-- Replaces 019 + 020 (never run). The client confirmed (23 Nov):
--   · name FREQUENCY SHORT SET (the size chart's name), category TRACK SETS;
--     slugs stay rouge-track / rouge-track-set so /shop/rouge-track-set holds
--   · on sale from today: R2,500, R3,200 crossed out
--   · stock stays a PLACEHOLDER: S–XL, 10 each — correct it in /admin/inventory
--   · top of FEATURED / DROPS, and the members popup
-- Re-running RESETS stock to 10 — after launch, edit stock from /admin/inventory.

begin;

-- Collection: first in FEATURED and DROPS (sort_order 0).
insert into collections (slug, name, kind, tagline, hero_title, hero_image, hero_panels,
                         release_date, status, is_featured, sort_order)
values (
  'rouge-track', 'FREQUENCY', 'drop',
  'Same destination. Different routes.',
  'FREQUENCY',
  '/assets/drops/rouge-track/model-front.jpg',
  '[
    {"src": "/assets/drops/rouge-track/model-front.jpg", "alt": "Frequency short set worn — yellow half-zip hooded top, MOVE DIFFERENT., with cargo shorts", "pos": "center 35%"},
    {"src": "/assets/drops/rouge-track/model-back.jpg", "alt": "Frequency top back — SAME DESTINATION. DIFFERENT ROUTES.", "pos": "center 35%"}
  ]'::jsonb,
  '2026-11-23', 'live', true, 0
)
on conflict (slug) do update
  set name = excluded.name, kind = excluded.kind, tagline = excluded.tagline,
      hero_title = excluded.hero_title, hero_image = excluded.hero_image,
      hero_panels = excluded.hero_panels, release_date = excluded.release_date,
      status = excluded.status, is_featured = excluded.is_featured, sort_order = excluded.sort_order;

-- "Move the Bagged League one": clear the leftover featured flags on its
-- sub-collections (Bagged League itself is already unfeatured).
update collections set is_featured = false where slug in ('air-down', 'paint-shop');

-- Product: R2,500 sale, R3,200 crossed out. To END the sale (e.g. 1 Dec):
--   update products set price = 3200.00, compare_at_price = null, badge = 'NEW'
--    where slug = 'rouge-track-set';
insert into products (name, slug, category, drop_label, price, compare_at_price, badge, media_bg,
                      image_contain, image_fit, collection_id, release_date)
values ('FREQUENCY SHORT SET', 'rouge-track-set', 'TRACK SETS', 'FREQUENCY', 2500.00, 3200.00, 'SALE', '#fff',
        0.9, 'contain', (select id from collections where slug = 'rouge-track'), '2026-11-23')
on conflict (slug) do update
  set name = excluded.name, category = excluded.category, drop_label = excluded.drop_label,
      price = excluded.price, compare_at_price = excluded.compare_at_price, badge = excluded.badge,
      media_bg = excluded.media_bg, image_contain = excluded.image_contain, image_fit = excluded.image_fit,
      collection_id = excluded.collection_id, release_date = excluded.release_date, is_active = true;

insert into colourways (id, product_id, name, hex, sort_order) values
  ('rouge-track-ybr', (select id from products where slug = 'rouge-track-set'), 'YELLOW / BLUE / RED', '#FFE500', 1)
on conflict (id) do update
  set product_id = excluded.product_id, name = excluded.name, hex = excluded.hex, sort_order = excluded.sort_order;

-- Gallery order: FRONT / BACK = top packshots, SIDE = shorts front, then the
-- TOP rows in insert order (shorts back, then the model shots).
delete from product_images where colourway_id = 'rouge-track-ybr';
insert into product_images (colourway_id, view, url) values
  ('rouge-track-ybr', 'FRONT', '/assets/apparel/rouge-track-top-front.jpg'),
  ('rouge-track-ybr', 'BACK',  '/assets/apparel/rouge-track-top-back.jpg'),
  ('rouge-track-ybr', 'SIDE',  '/assets/apparel/rouge-track-shorts-front.jpg'),
  ('rouge-track-ybr', 'TOP',   '/assets/apparel/rouge-track-shorts-back.jpg'),
  ('rouge-track-ybr', 'TOP',   '/assets/drops/rouge-track/model-front.jpg'),
  ('rouge-track-ybr', 'TOP',   '/assets/drops/rouge-track/model-back.jpg'),
  ('rouge-track-ybr', 'TOP',   '/assets/drops/rouge-track/model-side.jpg'),
  ('rouge-track-ybr', 'TOP',   '/assets/drops/rouge-track/model-crouch.jpg');

insert into inventory (colourway_id, gender, size_value, in_stock, stock_count, sort_order)
select 'rouge-track-ybr', 'U', sz, true, 10, ord
  from (values ('S', 1), ('M', 2), ('L', 3), ('XL', 4)) as s(sz, ord)
on conflict (colourway_id, gender, size_value) do update
  set stock_count = excluded.stock_count,
      in_stock    = excluded.stock_count > 0,
      sort_order  = excluded.sort_order;

commit;

-- Check: FREQUENCY SHORT SET, 2500 / 3200, SALE, collection rouge-track featured, 8 images, 4 sizes.
select p.name, p.category, p.price, p.compare_at_price, p.badge, c.slug as collection, c.is_featured,
       (select count(*) from product_images where colourway_id = 'rouge-track-ybr') as images,
       (select count(*) from inventory where colourway_id = 'rouge-track-ybr') as sizes
  from products p join collections c on c.id = p.collection_id
 where p.slug = 'rouge-track-set';
