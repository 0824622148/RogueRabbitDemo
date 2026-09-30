-- Cleanup: retire 4 test orders placed during development.
--
-- NOT a schema migration — do not add this to the numbered sequence and do not
-- run it against a fresh database. It targets four specific rows that exist
-- only in the live DB as of 2026-08-27.
--
--   RR-XVZG5T · RR-XW05JV · RR-B14Q6S · RR-B2OJQH
--
-- These were inflating the admin PAYMENTS TO CONFIRM queue and PIPELINE
-- revenue. They are marked 'cancelled' rather than deleted: same result in the
-- admin, but the rows survive, order ids stay contiguous, the audit trail is
-- kept, and a mistake is reversible.
--
-- The checkout also auto-enrols every buyer into `members` (source='preorder',
-- see src/app/api/preorder/route.ts), so section 4/5 clears the member rows
-- that exist only because of these test checkouts.
--
-- 'cancelled' is valid under both the old and new orders_status_check
-- constraint, so this is independent of whether the checkout lifecycle code
-- has been deployed.
--
-- RUN EACH SECTION SEPARATELY IN THE SUPABASE SQL EDITOR AND READ THE RESULT
-- BEFORE MOVING ON. Sections 3 and 5 are the only ones that change data.


-- ===========================================================================
-- 1. VERIFY — read only. Confirm these are the rows you mean.
-- ===========================================================================
-- Expect exactly 4 rows, every one status='pending', names/emails your own.
-- STOP if you get fewer than 4, or if anything is not 'pending'.

select id, reference, name, email, colourway, size_value,
       amount_due, status, created_at
from orders
where reference in ('RR-XVZG5T', 'RR-XW05JV', 'RR-B14Q6S', 'RR-B2OJQH')
order by created_at;


-- ===========================================================================
-- 2. SNAPSHOT — read only. This is what makes section 3 reversible.
-- ===========================================================================
-- Copy the result and save it as:
--   supabase/backups/orders-testcancel-20260827.json
-- (matches the existing dated-JSON convention in supabase/backups/)

select json_agg(o) from orders o
where reference in ('RR-XVZG5T', 'RR-XW05JV', 'RR-B14Q6S', 'RR-B2OJQH');


-- ===========================================================================
-- 3. CANCEL THE ORDERS — CHANGES DATA.
-- ===========================================================================
-- Preferred alternative: click CANCEL on each of the four rows in
-- /admin/payments (PENDING tab). Same outcome, no hand-written SQL against
-- production. Use this only if the admin route isn't available to you.
--
-- The `and status = 'pending'` guard means a row that somehow reached 'paid'
-- or 'shipped' is left alone. Expect exactly 4 rows returned.

update orders
set status = 'cancelled'
where reference in ('RR-XVZG5T', 'RR-XW05JV', 'RR-B14Q6S', 'RR-B2OJQH')
  and status = 'pending'
returning id, reference, status;


-- ===========================================================================
-- 4. INSPECT MEMBERS — read only. LOOK BEFORE YOU DELETE.
-- ===========================================================================
-- /admin/members is read-only (no delete button, no member-delete API), so
-- this half has to be SQL.
--
-- Check the `source` column on every row returned. Anything that is NOT
-- 'preorder' was a genuine signup via navbar/homepage/footer/wishlist and must
-- be kept. Section 5 guards against those automatically, but confirm by eye.
--
-- SAVE THIS RESULT — it is the only way to restore a member row afterwards.

select id, email, name, source, created_at, unsubscribed
from members
where email in (
  select email from orders
  where reference in ('RR-XVZG5T', 'RR-XW05JV', 'RR-B14Q6S', 'RR-B2OJQH')
);


-- ===========================================================================
-- 5. REMOVE THOSE MEMBER ROWS — CHANGES DATA, NOT REVERSIBLE.
-- ===========================================================================
-- Three guards, all deliberate:
--   1. source = 'preorder'      — never removes someone who joined via the
--                                 navbar/homepage/footer/wishlist. The members
--                                 upsert uses ignoreDuplicates:true, so an
--                                 existing subscriber who later test-ordered
--                                 kept their original source and is protected.
--   2. email in (test orders)   — scope.
--   3. email not in (others)    — an address that also placed a REAL order is
--                                 kept. orders.email is NOT NULL, so this
--                                 subquery can't be poisoned by a NULL.
--
-- Expect 0-4 rows. ZERO IS A NORMAL RESULT — it means those addresses were
-- already members from another source, or the same address was reused for all
-- four tests and is protected by guard 3.

delete from members
where source = 'preorder'
  and email in (
    select email from orders
    where reference in ('RR-XVZG5T', 'RR-XW05JV', 'RR-B14Q6S', 'RR-B2OJQH')
  )
  and email not in (
    select email from orders
    where reference not in ('RR-XVZG5T', 'RR-XW05JV', 'RR-B14Q6S', 'RR-B2OJQH')
  )
returning id, email, source;


-- ===========================================================================
-- 6. VERIFY — read only.
-- ===========================================================================

-- Expect: pending = 7, cancelled = 4. Nothing else should have moved.
select status, count(*), sum(amount_due) from orders group by status order by status;

-- The four still exist, now cancelled.
select reference, status from orders
where reference in ('RR-XVZG5T', 'RR-XW05JV', 'RR-B14Q6S', 'RR-B2OJQH');

-- No 'preorder' member left without a matching order. Expect 0 rows.
select m.email from members m
where m.source = 'preorder'
  and m.email not in (select email from orders);


-- ===========================================================================
-- ROLLBACK
-- ===========================================================================
-- Orders (safe, the rows are still there):
--   update orders set status = 'pending'
--   where reference in ('RR-XVZG5T', 'RR-XW05JV', 'RR-B14Q6S', 'RR-B2OJQH');
--
-- Members: re-insert by hand from the section 4 output. There is no other copy.
