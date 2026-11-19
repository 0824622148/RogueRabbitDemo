-- Rouge Rabbit — ROUGE TRACK set (19 Nov 2026).
-- Client (Clayton, 19 Nov): new "Track Sets" category; on sale now at R3,200,
-- marked down to R2,500 from Mon 23 Nov when the ads go live
-- (see 020_rouge_track_markdown.sql). It takes the top FEATURED / DROPS slot.
--
-- Sold as one product: hooded half-zip top + cargo shorts together.
-- Category 'TRACK SETS' → /shop/track-sets (deploy that code first).
--
-- STOCK IS A PLACEHOLDER: S–XL, 10 each, until the client confirms sizes and
-- quantities. Correct it in /admin/inventory (or edit the size list below
-- BEFORE running). Re-running RESETS stock to 10 — after launch, edit stock
-- from /admin/inventory instead.

begin;

-- Collection: first in FEATURED and DROPS.
insert into collections (slug, name, kind, tagline, hero_title, hero_image, hero_panels,
                         release_date, status, is_featured, sort_order)
values (
  'rouge-track', 'ROUGE TRACK', 'drop',
  'Same destination. Different routes.',
  'ROUGE TRACK',
  '/assets/drops/rouge-track/top-front.jpg',
  '[
    {"src": "/assets/drops/rouge-track/top-front.jpg", "alt": "Rouge Track hooded half-zip top — front, MOVE DIFFERENT.", "pos": "center 45%"},
    {"src": "/assets/drops/rouge-track/top-back.jpg", "alt": "Rouge Track top — back, SAME DESTINATION. DIFFERENT ROUTES.", "pos": "center 45%"}
  ]'::jsonb,
  '2026-11-19', 'live', true, 0
)
on conflict (slug) do update
  set name = excluded.name, kind = excluded.kind, tagline = excluded.tagline,
      hero_title = excluded.hero_title, hero_image = excluded.hero_image,
      hero_panels = excluded.hero_panels, release_date = excluded.release_date,
      status = excluded.status, is_featured = excluded.is_featured, sort_order = excluded.sort_order;

-- "Move the Bagged League one": clear the leftover featured flags on its
-- sub-collections (Bagged League itself is already unfeatured).
update collections set is_featured = false where slug in ('air-down', 'paint-shop');

-- Product: R3,200 now.
insert into products (name, slug, category, drop_label, price, compare_at_price, badge, media_bg,
                      image_contain, image_fit, collection_id, release_date)
values ('ROUGE TRACK SET', 'rouge-track-set', 'TRACK SETS', 'ROUGE TRACK', 3200.00, null, 'NEW', '#fff',
        0.9, 'contain', (select id from collections where slug = 'rouge-track'), '2026-11-19')
on conflict (slug) do update
  set name = excluded.name, category = excluded.category, drop_label = excluded.drop_label,
      price = excluded.price, compare_at_price = excluded.compare_at_price, badge = excluded.badge,
      media_bg = excluded.media_bg, image_contain = excluded.image_contain, image_fit = excluded.image_fit,
      collection_id = excluded.collection_id, release_date = excluded.release_date, is_active = true;

insert into colourways (id, product_id, name, hex, sort_order) values
  ('rouge-track-ybr', (select id from products where slug = 'rouge-track-set'), 'YELLOW / BLUE / RED', '#FFE500', 1)
on conflict (id) do update
  set product_id = excluded.product_id, name = excluded.name, hex = excluded.hex, sort_order = excluded.sort_order;

-- FRONT / BACK = top, SIDE / TOP slots = shorts front / back (gallery order).
delete from product_images where colourway_id = 'rouge-track-ybr';
insert into product_images (colourway_id, view, url) values
  ('rouge-track-ybr', 'FRONT', '/assets/apparel/rouge-track-top-front.jpg'),
  ('rouge-track-ybr', 'BACK',  '/assets/apparel/rouge-track-top-back.jpg'),
  ('rouge-track-ybr', 'SIDE',  '/assets/apparel/rouge-track-shorts-front.jpg'),
  ('rouge-track-ybr', 'TOP',   '/assets/apparel/rouge-track-shorts-back.jpg');

insert into inventory (colourway_id, gender, size_value, in_stock, stock_count, sort_order)
select 'rouge-track-ybr', 'U', sz, true, 10, ord
  from (values ('S', 1), ('M', 2), ('L', 3), ('XL', 4)) as s(sz, ord)
on conflict (colourway_id, gender, size_value) do update
  set stock_count = excluded.stock_count,
      in_stock    = excluded.stock_count > 0,
      sort_order  = excluded.sort_order;

commit;

-- Check: one row, price 3200, collection rouge-track, 4 images, 4 sizes.
select p.slug, p.category, p.price, p.compare_at_price, c.slug as collection, c.is_featured,
       (select count(*) from product_images where colourway_id = 'rouge-track-ybr') as images,
       (select count(*) from inventory where colourway_id = 'rouge-track-ybr') as sizes
  from products p join collections c on c.id = p.collection_id
 where p.slug = 'rouge-track-set';
