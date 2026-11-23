-- Rouge Rabbit — SIGNAL TEE + BEAUTY IN CONTRAST TEE pricing (23 Nov 2026).
-- Regular price R350 → R949; November special R749, with R949 crossed out.
-- Pages refresh within about a minute. Safe to re-run; stock is not touched.
-- Do NOT re-run 017 after this: it resets the price to R350 and stock to 25.

begin;

update products
   set price = 749.00, compare_at_price = 949.00, badge = 'SALE'
 where slug in ('rr-signal-tee', 'rr-beauty-in-contrast-tee');

commit;

-- To END the special (e.g. 1 Dec), run instead:
-- update products set price = 949.00, compare_at_price = null, badge = 'NEW'
--  where slug in ('rr-signal-tee', 'rr-beauty-in-contrast-tee');

-- Check: both rows should show 749.00, 949.00, SALE.
select slug, price, compare_at_price, badge
  from products
 where slug in ('rr-signal-tee', 'rr-beauty-in-contrast-tee');
