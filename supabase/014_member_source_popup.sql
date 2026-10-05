-- Migration: allow members.source = 'popup' (the welcome "become a member"
-- popup that opens a few seconds after a first visit).
--
-- Keeps every source already in use, including 'shop' (paid shop customers,
-- added by 007_shop_cart_delivery.sql via the PayFast notify webhook).
--
-- Run this once in the Supabase SQL editor BEFORE deploying the popup code,
-- otherwise popup signups fail the CHECK constraint.

alter table members drop constraint if exists members_source_check;

alter table members
  add constraint members_source_check
  check (source in ('homepage', 'preorder', 'navbar', 'footer', 'wishlist', 'shop', 'popup'));
