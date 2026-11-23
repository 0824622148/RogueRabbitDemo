-- SUPERSEDED by 021_frequency_short_set_live.sql (23 Nov 2026) — do not run.
-- Rouge Rabbit — ROUGE TRACK SET November markdown.
-- Run on Mon 23 Nov 2026, when the ads go live: R3,200 → R2,500, with R3,200
-- shown crossed out. Pages refresh within about a minute.

update products
   set price = 2500.00, compare_at_price = 3200.00, badge = 'SALE'
 where slug = 'rouge-track-set';

-- To END the markdown (e.g. 1 Dec), run instead:
-- update products set price = 3200.00, compare_at_price = null, badge = 'NEW'
--  where slug = 'rouge-track-set';

select slug, price, compare_at_price, badge from products where slug = 'rouge-track-set';
