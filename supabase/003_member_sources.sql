-- Migration: widen members.source to cover the new subscribe touchpoints.
--
-- The original CHECK only allowed ('homepage', 'preorder'). The unified
-- subscribe system also tags signups from the navbar JOIN button, the footer
-- newsletter block, and the wishlist email capture. Without this, inserts from
-- those sources fail the CHECK constraint.
--
-- Run this once against the live database (Supabase SQL editor).

alter table members drop constraint if exists members_source_check;

alter table members
  add constraint members_source_check
  check (source in ('homepage', 'preorder', 'navbar', 'footer', 'wishlist'));
