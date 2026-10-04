-- Rouge Rabbit — panelled collection hero (4 Oct 2026).
-- Run AFTER 010_collections.sql. Additive only.
--
-- hero_title  — big headline on /drops/[slug] (falls back to name)
-- hero_panels — side-by-side campaign photos: [{ "src", "alt", "pos" }]
--               pos is a CSS object-position keeping the subject in frame.
--               When set, /drops/[slug] shows the panelled hero instead of
--               the single hero_image. Stacks vertically on phones.
-- tagline     — the subline under the headline.
--
-- Images live in public/assets/drops/<slug>/ — deploy them before running this.
-- Re-runnable.

begin;

alter table collections add column if not exists hero_title  text;
alter table collections add column if not exists hero_panels jsonb;

update collections set
  hero_title  = 'BAGGED LEAGUE × ROUGE RABBIT',
  tagline     = 'Standard. Low. Lower. Bagged.',
  hero_image  = '/assets/drops/bagged-league/duo.jpg',
  hero_panels = '[
    {"src": "/assets/drops/bagged-league/red-car.jpg",   "alt": "Bagged red VW Golf front wheel at a night meet", "pos": "55% 60%"},
    {"src": "/assets/drops/bagged-league/duo.jpg",       "alt": "Paint Shop and Air Down tees worn on the railway tracks", "pos": "center 45%"},
    {"src": "/assets/drops/bagged-league/air-down.jpg",  "alt": "Air Down tee back print — Standard, Low, Lower, Bagged", "pos": "center 55%"},
    {"src": "/assets/drops/bagged-league/white-car.jpg", "alt": "Bagged white VW Golf rear wheel", "pos": "50% 70%"}
  ]'::jsonb
where slug = 'bagged-league';

commit;
