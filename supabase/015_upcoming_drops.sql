-- Rouge Rabbit — upcoming drops: Beauty in Contrast + Signal (13 Oct 2026).
-- Caesar is renamed Beauty in Contrast. Both stay coming_soon, now with their
-- back-print artwork (hero_image, cropped from the back shot) behind the title,
-- front / back shots and teaser lines. Applied via the REST API on 13 Oct 2026
-- — kept here for the record. Run AFTER 011_collection_hero.sql. Re-runnable.

update collections set
  slug        = 'beauty-in-contrast',
  name        = 'BEAUTY IN CONTRAST',
  hero_title  = 'BEAUTY IN CONTRAST',
  tagline     = 'Beauty lives in the contrast.',
  hero_image  = '/assets/drops/beauty-in-contrast/art.jpg',
  hero_panels = '[
    {"src": "/assets/drops/beauty-in-contrast/front.jpg", "alt": "Beauty in Contrast white tee and cap — front", "pos": "center 40%"},
    {"src": "/assets/drops/beauty-in-contrast/back.jpg", "alt": "Beauty in Contrast tee back print — statue with a red-painted blindfold", "pos": "center 45%"}
  ]'::jsonb,
  status      = 'coming_soon'
where slug in ('caesar', 'beauty-in-contrast');

update collections set
  hero_title  = 'SIGNAL',
  tagline     = 'Not everything needs to be received.',
  hero_image  = '/assets/drops/signal/art.jpg',
  hero_panels = '[
    {"src": "/assets/drops/signal/front.jpg", "alt": "Signal black tee and cap — front", "pos": "center 40%"},
    {"src": "/assets/drops/signal/back.jpg", "alt": "Signal tee back print — diver helmet with a goldfish", "pos": "center 45%"}
  ]'::jsonb,
  status      = 'coming_soon'
where slug = 'signal';
