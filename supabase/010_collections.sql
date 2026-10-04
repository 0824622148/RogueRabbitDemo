-- Rouge Rabbit — Collections + release dates (4 Oct 2026).
-- Run AFTER 009_air_down_white.sql. Additive only: no product, stock or price
-- data is changed beyond the new collection_id / release_date columns.
--
-- Collections drive the FEATURED and DROPS menus and the /drops/[slug] pages.
-- One level of nesting: a collection (Bagged League) can have sub-collections
-- (Air Down, Paint Shop). Products link to the most specific one.
--
-- status:   live        — shown, products listed
--           coming_soon — shown as a teaser (no products needed yet)
--           hidden      — not shown anywhere
-- kind:     collab | drop | sub
--
-- To publish Caesar / Signal once their content is in:
--   update collections set story = '…', hero_image = '/assets/drops/caesar/hero.jpg',
--     release_date = '2026-10-xx', status = 'live' where slug = 'caesar';
--
-- Re-runnable.

begin;

create table if not exists collections (
  id           serial primary key,
  slug         text unique not null,
  name         text not null,
  parent_id    int references collections(id) on delete set null,
  kind         text not null default 'drop' check (kind in ('collab', 'drop', 'sub')),
  tagline      text,
  story        text,
  hero_image   text,
  logo_image   text,
  release_date date,
  status       text not null default 'coming_soon' check (status in ('live', 'coming_soon', 'hidden')),
  is_featured  boolean not null default false,
  sort_order   int not null default 0,
  created_at   timestamptz default now()
);

alter table collections enable row level security;
drop policy if exists "public read" on collections;
create policy "public read" on collections for select using (true);
-- This project doesn't auto-grant new tables to the API roles — without this
-- the storefront (anon key) gets "permission denied" despite the policy.
grant select on collections to anon, authenticated;
grant all on collections to service_role;

alter table products add column if not exists collection_id int references collections(id) on delete set null;
alter table products add column if not exists release_date  date;

-- ── Seed ────────────────────────────────────────────────────────────────────
insert into collections (slug, name, kind, tagline, hero_image, release_date, status, is_featured, sort_order) values
  ('bagged-league', 'BAGGED LEAGUE', 'collab', 'Bagged League × Rouge Rabbit',
   '/assets/hero-air-down.jpg', '2026-10-01', 'live', true, 1),
  ('caesar', 'CAESAR', 'drop', null, null, null, 'coming_soon', false, 2),
  ('signal', 'SIGNAL', 'drop', null, null, null, 'coming_soon', false, 3)
on conflict (slug) do update
  set name = excluded.name, kind = excluded.kind, is_featured = excluded.is_featured,
      sort_order = excluded.sort_order;

insert into collections (slug, name, parent_id, kind, tagline, hero_image, release_date, status, is_featured, sort_order) values
  ('air-down', 'AIR DOWN', (select id from collections where slug = 'bagged-league'), 'sub',
   'Bagged League × Rouge Rabbit', '/assets/hero-air-down.jpg', '2026-10-01', 'live', true, 1),
  ('paint-shop', 'PAINT SHOP', (select id from collections where slug = 'bagged-league'), 'sub',
   'Bagged League × Rouge Rabbit', '/assets/paint-shop-campaign.jpg', '2026-10-01', 'live', true, 2)
on conflict (slug) do update
  set name = excluded.name, parent_id = excluded.parent_id, kind = excluded.kind,
      is_featured = excluded.is_featured, sort_order = excluded.sort_order;

-- ── Link products ───────────────────────────────────────────────────────────
update products set collection_id = (select id from collections where slug = 'air-down')
  where slug = 'bl-air-down-tee';
update products set collection_id = (select id from collections where slug = 'paint-shop')
  where slug in ('bl-paint-shop-splash-tee', 'bl-paint-shop-overspray-tee');
update products set collection_id = (select id from collections where slug = 'bagged-league')
  where slug = 'rr-5-panel-cap';

-- ── Release dates (drive "All Items — latest release first") ────────────────
update products set release_date = '2026-06-10' where slug = 'rouge-01' and release_date is null;
update products set release_date = '2026-10-01'
  where slug in ('bl-air-down-tee', 'bl-paint-shop-splash-tee', 'bl-paint-shop-overspray-tee', 'rr-5-panel-cap')
    and release_date is null;

commit;
