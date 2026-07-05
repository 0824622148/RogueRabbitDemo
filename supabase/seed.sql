-- Rouge Rabbit Store — Seed Data
-- Run AFTER schema.sql

-- ROUGE 01
insert into products (name, slug, category, drop_label, price, badge, media_bg, image_contain, image_fit)
values ('ROUGE 01', 'rouge-01', 'FOOTWEAR', 'DROP 003', 1399, 'NEW', '#fff', 1, 'contain');

-- 5 colourways
insert into colourways (id, product_id, name, hex, sort_order) values
('obs', 1, 'OBSIDIAN', '#0F0F10', 1),
('car', 1, 'CARDINAL', '#D90017', 2),
('ice', 1, 'ICE',      '#9DC9E7', 3),
('ros', 1, 'ROSE',     '#F3B0B9', 4),
('brn', 1, 'BEIGE',    '#C4A882', 5);

-- 20 product images (4 views × 5 colourways)
insert into product_images (colourway_id, view, url) values
('obs', 'FRONT', '/assets/shoe-black-front.png'),
('obs', 'SIDE',  '/assets/shoe-black-side.png'),
('obs', 'BACK',  '/assets/shoe-black-rear.png'),
('obs', 'TOP',   '/assets/shoe-black-top.png'),
('car', 'FRONT', '/assets/shoe-red-front.png'),
('car', 'SIDE',  '/assets/shoe-red-side.png'),
('car', 'BACK',  '/assets/shoe-red-rear.png'),
('car', 'TOP',   '/assets/shoe-red-top.png'),
('ice', 'FRONT', '/assets/shoe-blue-front.png'),
('ice', 'SIDE',  '/assets/shoe-blue-side.png'),
('ice', 'BACK',  '/assets/shoe-blue-rear.png'),
('ice', 'TOP',   '/assets/shoe-blue-top.png'),
('ros', 'FRONT', '/assets/shoe-pink-front.png'),
('ros', 'SIDE',  '/assets/shoe-pink-side.png'),
('ros', 'BACK',  '/assets/shoe-pink-rear.png'),
('ros', 'TOP',   '/assets/shoe-pink-top.png'),
('brn', 'FRONT', '/assets/shoe-brown-front.png'),
('brn', 'SIDE',  '/assets/shoe-brown-side.png'),
('brn', 'BACK',  '/assets/shoe-brown-rear.png'),
('brn', 'TOP',   '/assets/shoe-brown-top.png');

-- 80 inventory rows (5 colourways × 2 genders × 8 sizes)
insert into inventory (colourway_id, gender, size_value, in_stock, sort_order)
select c.id, 'M', s.size, true, s.ord
from colourways c
cross join (values
  ('US 6', 1), ('US 7', 2), ('US 8', 3), ('US 9', 4),
  ('US 10', 5), ('US 11', 6), ('US 12', 7), ('US 13', 8)
) as s(size, ord);

insert into inventory (colourway_id, gender, size_value, in_stock, sort_order)
select c.id, 'F', s.size, true, s.ord
from colourways c
cross join (values
  ('US 4', 1), ('US 5', 2), ('US 6', 3), ('US 7', 4),
  ('US 8', 5), ('US 9', 6), ('US 10', 7), ('US 11', 8)
) as s(size, ord);
