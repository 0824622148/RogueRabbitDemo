-- Migration: allow members.source = 'banner' (the "dropping soon" announcement
-- bar above the nav) and 'drop' (the sign-up form on a drop's teaser page).
--
-- Keeps every source already in use, including 'shop' (paid shop customers,
-- added by 007_shop_cart_delivery.sql via the PayFast notify webhook).
--
-- Safe to deploy the code first: until this runs, /api/members saves those
-- signups with a null source instead of failing.

alter table members drop constraint if exists members_source_check;

alter table members
  add constraint members_source_check
  check (source in ('homepage', 'preorder', 'navbar', 'footer', 'wishlist', 'shop', 'popup', 'banner', 'drop'));
