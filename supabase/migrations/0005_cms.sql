-- ============================================================================
-- Pakkam — Migration 0005: content CMS (pages / stories / places / schemes)
-- Platform/city-level editorial content managed from Xeltrix Command, rendered
-- by the NammaPakkam site. Public reads only `is_published`; service_role writes.
-- Run in the Supabase SQL editor (project rskpqlswmnyydltjsfbr) after 0001–0004.
-- Idempotent / safe to re-run.
-- ============================================================================

-- Shared updated_at trigger
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

-- ── pages (About / FAQ / static rich pages) ─────────────────────────────────
create table if not exists pages (
  id           uuid primary key default gen_random_uuid(),
  city         text default 'Coimbatore',
  slug         text unique not null,
  title        text not null,
  body         text,
  hero_image   text,
  is_published boolean default false,
  sort_order   int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── stories (women entrepreneur features) ───────────────────────────────────
create table if not exists stories (
  id           uuid primary key default gen_random_uuid(),
  city         text default 'Coimbatore',
  name         text not null,
  business     text,
  category     text,
  area         text,
  photo_url    text,
  summary      text,
  story        text,
  is_featured  boolean default false,
  is_published boolean default false,
  sort_order   int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── places (Coimbatore city guide) ──────────────────────────────────────────
create table if not exists places (
  id           uuid primary key default gen_random_uuid(),
  city         text default 'Coimbatore',
  name         text not null,
  kind         text,   -- gated_community | mall | park | temple | landmark | entertainment | hospital | school
  area         text,
  description  text,
  image_url    text,
  map_url      text,
  tags         text[],
  is_published boolean default false,
  sort_order   int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── schemes (govt schemes for women) ────────────────────────────────────────
create table if not exists schemes (
  id           uuid primary key default gen_random_uuid(),
  city         text default 'Coimbatore',
  name         text not null,
  scope        text,   -- National | Tamil Nadu
  who          text,
  description  text,
  link         text,
  is_published boolean default false,
  sort_order   int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Listing indexes (city + published + order)
create index if not exists pages_pub_idx   on pages(city, is_published, sort_order);
create index if not exists stories_pub_idx on stories(city, is_published, is_featured, sort_order);
create index if not exists places_pub_idx  on places(city, kind, is_published, sort_order);
create index if not exists schemes_pub_idx on schemes(city, is_published, sort_order);

-- updated_at triggers
drop trigger if exists pages_updated   on pages;   create trigger pages_updated   before update on pages   for each row execute function set_updated_at();
drop trigger if exists stories_updated on stories; create trigger stories_updated before update on stories for each row execute function set_updated_at();
drop trigger if exists places_updated  on places;  create trigger places_updated  before update on places  for each row execute function set_updated_at();
drop trigger if exists schemes_updated on schemes; create trigger schemes_updated before update on schemes for each row execute function set_updated_at();

-- ── RLS: public reads published rows; service_role bypasses RLS for writes ───
alter table pages   enable row level security;
alter table stories enable row level security;
alter table places  enable row level security;
alter table schemes enable row level security;

drop policy if exists "public read published" on pages;
create policy "public read published" on pages   for select using (is_published = true);
drop policy if exists "public read published" on stories;
create policy "public read published" on stories for select using (is_published = true);
drop policy if exists "public read published" on places;
create policy "public read published" on places  for select using (is_published = true);
drop policy if exists "public read published" on schemes;
create policy "public read published" on schemes for select using (is_published = true);
