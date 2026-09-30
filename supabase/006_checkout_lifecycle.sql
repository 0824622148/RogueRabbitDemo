-- Migration: give the pre-payment checkout state somewhere to go.
--
-- Clicking SECURE MY PAIR writes the order before redirecting to PayFast. That
-- has to stay — the ITN posts back only m_payment_id, so the row must already
-- exist for src/lib/payfast.ts validateITN to have an amount to check against,
-- and for fulfilment to have an address. The problem was that 'pending' had no
-- exit: a customer who cancelled at PayFast, or closed the tab, left a row that
-- looked identical to one genuinely awaiting payment. The admin "PAYMENTS TO
-- CONFIRM" queue and "PIPELINE" revenue counted both.
--
-- New checkouts now start at 'awaiting_payment' and are flipped to 'cancelled'
-- by /api/preorder/cancel when PayFast returns the customer to the cancel page.
--
-- IMPORTANT: this migration is purely additive. It updates and deletes NOTHING.
-- Every existing 'pending' row keeps status 'pending' and stays visible in the
-- admin under its own PENDING tab. Those are the legacy rows of unknown state —
-- they are reconciled by hand, never by this migration or by the cancel route
-- (which only ever matches status = 'awaiting_payment').
--
-- Run in the Supabase SQL editor.

-- 1. Widen the status constraint. 'pending' is retained for the legacy rows.
alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('awaiting_payment', 'pending', 'paid', 'shipped', 'delivered', 'cancelled'));

-- 2. When the customer was sent to PayFast. Null on every legacy row — that
--    absence is itself the marker for "created before this migration".
alter table orders add column if not exists payment_started_at timestamptz;

-- 3. Every admin queue filters on status; there was no index on it.
create index if not exists orders_status_idx on orders (status);

-- The column default stays 'pending' deliberately: only the checkout route sets
-- 'awaiting_payment', and it does so explicitly. Anything that lands here by
-- another path still shows up in the queue that gets looked at by hand.
