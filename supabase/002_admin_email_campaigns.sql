-- Rouge Rabbit — Admin Dashboard v2 migration
-- Run this ON ITS OWN in Supabase → SQL Editor.
-- Do NOT re-run schema.sql (its create-table statements collide with your
-- existing tables). Every statement below is safe to run more than once.

-- Opt-out flag so "email all members" respects unsubscribes (POPIA compliance).
alter table members add column if not exists unsubscribed boolean default false;

-- Log of member email campaigns sent from the admin dashboard.
create table if not exists campaigns (
  id              serial primary key,
  subject         text not null,
  body            text not null,
  recipient_count int  not null default 0,
  sent_at         timestamptz default now()
);

alter table campaigns enable row level security;
grant all on campaigns to service_role;
grant usage, select on sequence campaigns_id_seq to service_role;
