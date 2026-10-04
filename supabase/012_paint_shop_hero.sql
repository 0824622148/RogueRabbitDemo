-- Rouge Rabbit — Paint Shop drop page: real campaign photos (4 Oct 2026).
-- Replaces the AI-generated paint-shop-campaign.jpg with a two-panel hero.
-- Already applied via the REST API on 4 Oct 2026 — kept here for the record.
-- Run AFTER 011_collection_hero.sql. Re-runnable.

update collections set
  hero_title  = 'PAINT SHOP',
  tagline     = 'Colour outside the lines.',
  hero_image  = '/assets/drops/bagged-league/paint-shop-model.jpg',
  hero_panels = '[
    {"src": "/assets/drops/bagged-league/paint-shop-model.jpg", "alt": "Paint Shop tee worn arms-out on a hilltop", "pos": "center 40%"},
    {"src": "/assets/drops/bagged-league/duo.jpg", "alt": "Paint Shop tee back print — Colour outside the lines — worn on the railway tracks", "pos": "center 50%"}
  ]'::jsonb
where slug = 'paint-shop';
