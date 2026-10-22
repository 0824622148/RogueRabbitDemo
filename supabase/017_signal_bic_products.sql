-- Rouge Rabbit — Signal + Beauty in Contrast tees (22 Oct 2026, drop day 23 Oct).
-- Run AFTER 015_upcoming_drops.sql, and only once the release-date gate is
-- deployed (isReleased in src/lib/drop-dates.ts): products dated 2026-10-23
-- stay hidden and unbuyable until 00:00 SA time that day, then appear on their
-- own. The two collections go live at the same moment (releaseDue in
-- src/lib/queries/collections.ts), so nothing needs flipping at midnight.
--
-- R350 each, unisex S–XL, 25 units per size (confirmed by the client 22 Oct).
-- Images live in public/assets/apparel/ (from the client's 22 Oct packshots).
--
-- Re-runnable, but NOTE re-running RESETS stock to 25 — after launch, edit
-- stock from /admin/inventory instead.

begin;

insert into products (name, slug, category, drop_label, price, badge, media_bg, image_contain, image_fit,
                      collection_id, release_date)
values
  ('SIGNAL TEE',             'rr-signal-tee',             'APPAREL', 'SIGNAL',             350.00, 'NEW', '#fff', 0.9, 'contain',
   (select id from collections where slug = 'signal'), '2026-10-23'),
  ('BEAUTY IN CONTRAST TEE', 'rr-beauty-in-contrast-tee', 'APPAREL', 'BEAUTY IN CONTRAST', 350.00, 'NEW', '#fff', 0.9, 'contain',
   (select id from collections where slug = 'beauty-in-contrast'), '2026-10-23')
on conflict (slug) do update
  set name = excluded.name, category = excluded.category, drop_label = excluded.drop_label,
      price = excluded.price, badge = excluded.badge, media_bg = excluded.media_bg,
      image_contain = excluded.image_contain, image_fit = excluded.image_fit,
      collection_id = excluded.collection_id, release_date = excluded.release_date,
      is_active = true;

insert into colourways (id, product_id, name, hex, sort_order) values
  ('signal-blk', (select id from products where slug = 'rr-signal-tee'),             'BLACK', '#0F0F10', 1),
  ('bic-wht',    (select id from products where slug = 'rr-beauty-in-contrast-tee'), 'WHITE', '#F2F2F2', 1)
on conflict (id) do update
  set product_id = excluded.product_id, name = excluded.name, hex = excluded.hex, sort_order = excluded.sort_order;

delete from product_images where colourway_id in ('signal-blk', 'bic-wht');
insert into product_images (colourway_id, view, url) values
  ('signal-blk', 'FRONT', '/assets/apparel/signal-front.jpg'),
  ('signal-blk', 'BACK',  '/assets/apparel/signal-back.jpg'),
  ('bic-wht',    'FRONT', '/assets/apparel/beauty-in-contrast-front.jpg'),
  ('bic-wht',    'BACK',  '/assets/apparel/beauty-in-contrast-back.jpg');

insert into inventory (colourway_id, gender, size_value, in_stock, stock_count, sort_order)
select cw, 'U', sz, true, 25, ord
  from (values ('signal-blk'), ('bic-wht')) as c(cw)
 cross join (values ('S', 1), ('M', 2), ('L', 3), ('XL', 4)) as s(sz, ord)
on conflict (colourway_id, gender, size_value) do update
  set stock_count = excluded.stock_count,
      in_stock    = excluded.stock_count > 0,
      sort_order  = excluded.sort_order;

commit;

-- Check: both rows should show release_date 2026-10-23 and 4 sizes each.
select p.slug, p.price, p.release_date, c.slug as collection, cw.id as colourway, count(i.id) as sizes
  from products p
  join collections c on c.id = p.collection_id
  join colourways cw on cw.product_id = p.id
  left join inventory i on i.colourway_id = cw.id
 where p.slug in ('rr-signal-tee', 'rr-beauty-in-contrast-tee')
 group by p.slug, p.price, p.release_date, c.slug, cw.id;
