-- Rouge Rabbit — Air Down drop page: real campaign photos (4 Oct 2026).
-- Replaces the AI-generated hero-air-down.jpg with a two-panel hero.
-- Already applied via the REST API on 4 Oct 2026 — kept here for the record.
-- Run AFTER 011_collection_hero.sql. Re-runnable.

update collections set
  hero_title  = 'AIR DOWN',
  tagline     = 'Small change. Big difference.',
  hero_image  = '/assets/drops/bagged-league/air-down.jpg',
  hero_panels = '[
    {"src": "/assets/drops/bagged-league/air-down.jpg", "alt": "Air Down tee back print — Standard, Low, Lower, Bagged", "pos": "center 62%"},
    {"src": "/assets/drops/bagged-league/golf-pair.jpg", "alt": "Bagged white and red VW Citi Golfs at sunset", "pos": "center 64%"}
  ]'::jsonb
where slug = 'air-down';
