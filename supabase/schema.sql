-- Rouge Rabbit Store — Database Schema
-- Run this in Supabase → SQL Editor

-- Products
create table products (
  id               serial primary key,
  name             text not null,
  slug             text unique not null,
  category         text,
  drop_label       text,
  price            numeric not null,
  compare_at_price numeric,
  badge            text,
  media_bg         text,
  image_contain    numeric default 1,
  image_fit        text default 'contain',
  image_object_pos text default 'center',
  is_active        boolean default true,
  created_at       timestamptz default now()
);

-- Colourways (variants per product)
create table colourways (
  id         text primary key,
  product_id int references products(id) on delete cascade,
  name       text not null,
  hex        text,
  sort_order int default 0
);

-- Product images (4 views per colourway: FRONT, SIDE, BACK, TOP)
create table product_images (
  id           serial primary key,
  colourway_id text references colourways(id) on delete cascade,
  view         text not null check (view in ('FRONT', 'SIDE', 'BACK', 'TOP')),
  url          text not null
);

-- Inventory (per colourway + gender + size)
create table inventory (
  id           serial primary key,
  colourway_id text references colourways(id) on delete cascade,
  gender       text not null check (gender in ('M', 'F')),
  size_value   text not null,
  in_stock     boolean default true,
  stock_count  int,
  sort_order   int default 0,
  constraint   inventory_unique unique (colourway_id, gender, size_value)
);

-- Row Level Security — public read on all tables
alter table products       enable row level security;
alter table colourways     enable row level security;
alter table product_images enable row level security;
alter table inventory      enable row level security;

create policy "public read" on products       for select using (true);
create policy "public read" on colourways     for select using (true);
create policy "public read" on product_images for select using (true);
create policy "public read" on inventory      for select using (true);

-- Pre-orders (server-only via service role key — no public read policy)
create table orders (
  id           serial primary key,
  reference    text unique not null,
  colourway    text not null,
  gender       text not null check (gender in ('M', 'F')),
  size_value   text not null,
  city         text not null,
  name         text not null,
  email        text not null,
  phone        text,
  early_access boolean default false,
  discount_pct int default 0,
  amount_due   int not null,
  status       text default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  created_at   timestamptz default now()
);

alter table orders enable row level security;
grant all on orders to service_role;
grant usage, select on sequence orders_id_seq to service_role;

-- Members / early access list (server-only via service role key)
create table members (
  id         serial primary key,
  name       text,
  email      text unique not null,
  phone      text,
  source     text default 'homepage' check (source in ('homepage', 'preorder')),
  created_at timestamptz default now()
);

alter table members enable row level security;
grant all on members to service_role;
grant usage, select on sequence members_id_seq to service_role;

-- Wishlist (email-gated, server-only via service role key)
create table wishlist (
  id           serial primary key,
  email        text not null,
  product_id   int  not null references products(id) on delete cascade,
  colourway_id text references colourways(id) on delete set null,
  created_at   timestamptz default now(),
  constraint   wishlist_unique unique (email, product_id, colourway_id)
);

alter table wishlist enable row level security;
grant all on wishlist to service_role;
grant usage, select on sequence wishlist_id_seq to service_role;
