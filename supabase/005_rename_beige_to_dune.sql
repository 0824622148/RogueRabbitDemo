-- Migration: rename the BEIGE colourway to DUNE.
--
-- Colourway names are read live from the colourways table (see
-- src/lib/queries/products.ts), so editing seed.sql alone does not change the
-- storefront. Run this once against the live database.
--
-- The colourway id stays 'brn' and its product_images rows keep pointing at
-- /assets/shoe-brown-*.png — those are internal identifiers, not customer-facing.
--
-- Run in the Supabase SQL editor.

update colourways
set name = 'DUNE'
where id = 'brn' and product_id = 1;
