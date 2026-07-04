-- ============================================================================
-- Pakkam — hyperlocal community directory + classifieds
-- Migration 0001: core schema, RLS, seed data
-- Run in Supabase SQL editor (Mumbai region project) or via `supabase db push`.
-- ============================================================================

-- Extensions ----------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "pg_trgm";     -- fuzzy search

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
do $$ begin
  create type resident_status as enum ('pending', 'approved', 'rejected', 'blocked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type resident_role as enum ('resident', 'admin', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type listing_status as enum ('pending', 'approved', 'rejected', 'hidden');
exception when duplicate_object then null; end $$;

do $$ begin
  create type classified_kind as enum ('sell', 'rent', 'wanted', 'lost', 'found', 'free');
exception when duplicate_object then null; end $$;

do $$ begin
  create type promotion_status as enum ('pending', 'active', 'expired', 'cancelled');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- COMMUNITIES  (Phase 3 multi-tenant; one row for MVP)
-- ----------------------------------------------------------------------------
create table if not exists communities (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  city         text,
  blocks       text[] default '{}',          -- e.g. {'A','B','C','D'}
  logo_url     text,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- RESIDENTS  (profile row per auth user; flat-number verification)
-- ----------------------------------------------------------------------------
create table if not exists residents (
  id            uuid primary key references auth.users(id) on delete cascade,
  community_id  uuid not null references communities(id) on delete cascade,
  full_name     text not null,
  phone         text,
  block         text,
  flat_no       text,
  status        resident_status not null default 'pending',
  role          resident_role not null default 'resident',
  avatar_url    text,
  created_at    timestamptz not null default now(),
  approved_at   timestamptz,
  approved_by   uuid references residents(id)
);
create index if not exists residents_community_idx on residents(community_id, status);

-- ----------------------------------------------------------------------------
-- CATEGORIES
-- ----------------------------------------------------------------------------
create table if not exists categories (
  id           uuid primary key default gen_random_uuid(),
  community_id uuid not null references communities(id) on delete cascade,
  slug         text not null,
  name_en      text not null,
  name_ta      text,
  name_hi      text,
  icon         text,                          -- emoji or lucide icon name
  sort_order   int default 100,
  is_active    boolean default true,
  unique (community_id, slug)
);
create index if not exists categories_community_idx on categories(community_id, is_active);

-- ----------------------------------------------------------------------------
-- BUSINESSES / LISTINGS
-- ----------------------------------------------------------------------------
create table if not exists businesses (
  id            uuid primary key default gen_random_uuid(),
  community_id  uuid not null references communities(id) on delete cascade,
  owner_id      uuid references residents(id) on delete set null,
  category_id   uuid references categories(id) on delete set null,
  name          text not null,
  owner_name    text,
  description   text,
  photos        text[] default '{}',          -- Supabase Storage public URLs
  whatsapp      text,
  phone         text,
  block         text,
  flat_no       text,
  -- timings stored as jsonb: { "mon": ["09:00","21:00"], "sun": null (closed), ... }
  timings       jsonb default '{}'::jsonb,
  is_verified   boolean default false,        -- admin-verified business badge
  status        listing_status not null default 'pending',
  rating_avg    numeric(2,1) default 0,
  rating_count  int default 0,
  view_count    int default 0,
  click_count   int default 0,                -- WhatsApp/call taps
  search_tsv    tsvector,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists businesses_community_idx on businesses(community_id, status);
create index if not exists businesses_category_idx  on businesses(category_id);
create index if not exists businesses_tsv_idx        on businesses using gin(search_tsv);
create index if not exists businesses_name_trgm_idx  on businesses using gin(name gin_trgm_ops);

-- Keep search_tsv + updated_at fresh
create or replace function businesses_tsv_trigger() returns trigger as $$
begin
  new.search_tsv :=
    setweight(to_tsvector('simple', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.owner_name, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.description, '')), 'C');
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists businesses_tsv on businesses;
create trigger businesses_tsv before insert or update on businesses
  for each row execute function businesses_tsv_trigger();

-- ----------------------------------------------------------------------------
-- RATINGS  (one per resident per business; drives rating_avg)
-- ----------------------------------------------------------------------------
create table if not exists ratings (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references businesses(id) on delete cascade,
  resident_id  uuid not null references residents(id) on delete cascade,
  stars        int not null check (stars between 1 and 5),
  review       text,
  created_at   timestamptz not null default now(),
  unique (business_id, resident_id)
);

create or replace function recalc_business_rating() returns trigger as $$
declare bid uuid;
begin
  bid := coalesce(new.business_id, old.business_id);
  update businesses b set
    rating_avg = coalesce((select round(avg(stars)::numeric, 1) from ratings where business_id = bid), 0),
    rating_count = (select count(*) from ratings where business_id = bid)
  where b.id = bid;
  return null;
end;
$$ language plpgsql;

drop trigger if exists ratings_recalc on ratings;
create trigger ratings_recalc after insert or update or delete on ratings
  for each row execute function recalc_business_rating();

-- ----------------------------------------------------------------------------
-- ASK THE COMMUNITY  (requests + replies)
-- ----------------------------------------------------------------------------
create table if not exists requests (
  id            uuid primary key default gen_random_uuid(),
  community_id  uuid not null references communities(id) on delete cascade,
  resident_id   uuid not null references residents(id) on delete cascade,
  title         text not null,
  body          text,
  category_id   uuid references categories(id) on delete set null,
  is_resolved   boolean default false,
  reply_count   int default 0,
  created_at    timestamptz not null default now()
);
create index if not exists requests_community_idx on requests(community_id, created_at desc);

create table if not exists request_replies (
  id            uuid primary key default gen_random_uuid(),
  request_id    uuid not null references requests(id) on delete cascade,
  resident_id   uuid not null references residents(id) on delete cascade,
  body          text not null,
  business_id   uuid references businesses(id) on delete set null, -- "I recommend this listing"
  created_at    timestamptz not null default now()
);

create or replace function bump_reply_count() returns trigger as $$
begin
  update requests set reply_count = (select count(*) from request_replies where request_id = coalesce(new.request_id, old.request_id))
  where id = coalesce(new.request_id, old.request_id);
  return null;
end;
$$ language plpgsql;

drop trigger if exists replies_count on request_replies;
create trigger replies_count after insert or delete on request_replies
  for each row execute function bump_reply_count();

-- ----------------------------------------------------------------------------
-- NOTICES / ANNOUNCEMENTS  (admin)
-- ----------------------------------------------------------------------------
create table if not exists notices (
  id            uuid primary key default gen_random_uuid(),
  community_id  uuid not null references communities(id) on delete cascade,
  author_id     uuid references residents(id) on delete set null,
  title         text not null,
  body          text,
  is_pinned     boolean default false,
  published_at  timestamptz not null default now(),
  expires_at    timestamptz
);
create index if not exists notices_community_idx on notices(community_id, is_pinned desc, published_at desc);

-- ----------------------------------------------------------------------------
-- CLASSIFIEDS  (buy/sell, rent, lost & found)
-- ----------------------------------------------------------------------------
create table if not exists classifieds (
  id            uuid primary key default gen_random_uuid(),
  community_id  uuid not null references communities(id) on delete cascade,
  resident_id   uuid not null references residents(id) on delete cascade,
  kind          classified_kind not null default 'sell',
  title         text not null,
  description   text,
  price         numeric(12,2),
  photos        text[] default '{}',
  contact_phone text,
  status        listing_status not null default 'approved', -- auto-approve, admin can hide
  expires_at    timestamptz default (now() + interval '30 days'),
  created_at    timestamptz not null default now()
);
create index if not exists classifieds_community_idx on classifieds(community_id, status, created_at desc);

-- ----------------------------------------------------------------------------
-- PROMOTIONS  (monetisation — featured/promoted listings via Razorpay)
-- ----------------------------------------------------------------------------
create table if not exists promotions (
  id            uuid primary key default gen_random_uuid(),
  community_id  uuid not null references communities(id) on delete cascade,
  business_id   uuid not null references businesses(id) on delete cascade,
  status        promotion_status not null default 'pending',
  amount        numeric(10,2),
  razorpay_order_id   text,
  razorpay_payment_id text,
  starts_at     timestamptz default now(),
  ends_at       timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists promotions_active_idx on promotions(community_id, status, ends_at);

-- Convenience: is a business currently featured?
create or replace function is_business_featured(bid uuid) returns boolean as $$
  select exists (
    select 1 from promotions
    where business_id = bid and status = 'active'
      and now() between coalesce(starts_at, now()) and coalesce(ends_at, now() + interval '1 day')
  );
$$ language sql stable;

-- ----------------------------------------------------------------------------
-- HELPER FUNCTIONS for RLS  (avoid recursive policy lookups)
-- ----------------------------------------------------------------------------
create or replace function current_resident_status() returns resident_status as $$
  select status from residents where id = auth.uid();
$$ language sql stable security definer set search_path = public;

create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from residents
    where id = auth.uid() and role in ('admin','super_admin') and status = 'approved'
  );
$$ language sql stable security definer set search_path = public;

create or replace function is_approved_resident() returns boolean as $$
  select exists (
    select 1 from residents where id = auth.uid() and status = 'approved'
  );
$$ language sql stable security definer set search_path = public;

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table communities    enable row level security;
alter table residents      enable row level security;
alter table categories     enable row level security;
alter table businesses     enable row level security;
alter table ratings        enable row level security;
alter table requests       enable row level security;
alter table request_replies enable row level security;
alter table notices        enable row level security;
alter table classifieds    enable row level security;
alter table promotions     enable row level security;

-- communities: world-readable (directory is public to browse), admin writes
drop policy if exists communities_read on communities;
create policy communities_read on communities for select using (true);
drop policy if exists communities_write on communities;
create policy communities_write on communities for all using (is_admin()) with check (is_admin());

-- residents: a user sees + edits own row; admins see/manage all; signup inserts own row
drop policy if exists residents_self_read on residents;
create policy residents_self_read on residents for select
  using (id = auth.uid() or is_admin());
drop policy if exists residents_insert_self on residents;
create policy residents_insert_self on residents for insert
  with check (id = auth.uid());
drop policy if exists residents_update_self on residents;
create policy residents_update_self on residents for update
  using (id = auth.uid() or is_admin()) with check (id = auth.uid() or is_admin());

-- categories: public read; admin write
drop policy if exists categories_read on categories;
create policy categories_read on categories for select using (true);
drop policy if exists categories_write on categories;
create policy categories_write on categories for all using (is_admin()) with check (is_admin());

-- businesses: approved listings world-readable; owners see own; admins all.
drop policy if exists businesses_read on businesses;
create policy businesses_read on businesses for select
  using (status = 'approved' or owner_id = auth.uid() or is_admin());
drop policy if exists businesses_insert on businesses;
create policy businesses_insert on businesses for insert
  with check (is_approved_resident() and owner_id = auth.uid());
drop policy if exists businesses_update on businesses;
create policy businesses_update on businesses for update
  using (owner_id = auth.uid() or is_admin()) with check (owner_id = auth.uid() or is_admin());
drop policy if exists businesses_delete on businesses;
create policy businesses_delete on businesses for delete
  using (owner_id = auth.uid() or is_admin());

-- ratings: public read; approved residents write own
drop policy if exists ratings_read on ratings;
create policy ratings_read on ratings for select using (true);
drop policy if exists ratings_write on ratings;
create policy ratings_write on ratings for all
  using (resident_id = auth.uid()) with check (is_approved_resident() and resident_id = auth.uid());

-- requests / replies: residents-only read+write
drop policy if exists requests_read on requests;
create policy requests_read on requests for select using (is_approved_resident() or is_admin());
drop policy if exists requests_write on requests;
create policy requests_write on requests for insert with check (is_approved_resident() and resident_id = auth.uid());
drop policy if exists requests_update on requests;
create policy requests_update on requests for update using (resident_id = auth.uid() or is_admin());

drop policy if exists replies_read on request_replies;
create policy replies_read on request_replies for select using (is_approved_resident() or is_admin());
drop policy if exists replies_write on request_replies;
create policy replies_write on request_replies for insert with check (is_approved_resident() and resident_id = auth.uid());

-- notices: public read; admin write
drop policy if exists notices_read on notices;
create policy notices_read on notices for select using (true);
drop policy if exists notices_write on notices;
create policy notices_write on notices for all using (is_admin()) with check (is_admin());

-- classifieds: approved ones public read; residents create own; owner/admin edit
drop policy if exists classifieds_read on classifieds;
create policy classifieds_read on classifieds for select
  using (status = 'approved' or resident_id = auth.uid() or is_admin());
drop policy if exists classifieds_write on classifieds;
create policy classifieds_write on classifieds for insert
  with check (is_approved_resident() and resident_id = auth.uid());
drop policy if exists classifieds_update on classifieds;
create policy classifieds_update on classifieds for update
  using (resident_id = auth.uid() or is_admin()) with check (resident_id = auth.uid() or is_admin());

-- promotions: business owner + admin
drop policy if exists promotions_read on promotions;
create policy promotions_read on promotions for select
  using (is_admin() or exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()));
drop policy if exists promotions_write on promotions;
create policy promotions_write on promotions for all
  using (is_admin() or exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()))
  with check (is_admin() or exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- VIEW/CLICK counters (called from app via RPC so anon users can increment)
-- ----------------------------------------------------------------------------
create or replace function bump_business_view(bid uuid) returns void as $$
  update businesses set view_count = view_count + 1 where id = bid and status = 'approved';
$$ language sql security definer set search_path = public;

create or replace function bump_business_click(bid uuid) returns void as $$
  update businesses set click_count = click_count + 1 where id = bid and status = 'approved';
$$ language sql security definer set search_path = public;

grant execute on function bump_business_view(uuid)  to anon, authenticated;
grant execute on function bump_business_click(uuid) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- SEED  (one community + default categories)
-- ----------------------------------------------------------------------------
insert into communities (slug, name, city, blocks)
values ('pakkam', 'Pakkam Community', 'Mumbai', array['A','B','C','D','E','F'])
on conflict (slug) do nothing;

insert into categories (community_id, slug, name_en, name_ta, name_hi, icon, sort_order)
select c.id, x.slug, x.name_en, x.name_ta, x.name_hi, x.icon, x.sort_order
from communities c,
(values
  ('tuition',    'Home Tuition',  'வீட்டுப் பயிற்சி', 'गृह ट्यूशन',       '📚', 10),
  ('tiffin',     'Tiffin / Food', 'டிபன் / உணவு',     'टिफिन / खाना',      '🍱', 20),
  ('clothing',   'Clothing & Sarees', 'ஆடை & சேலை',  'कपड़े और साड़ी',     '🥻', 30),
  ('doctor',     'Doctor / Clinic', 'மருத்துவர்',     'डॉक्टर / क्लिनिक',   '🩺', 40),
  ('plumber',    'Plumber',       'குழாய் பணியாளர்',  'प्लंबर',            '🔧', 50),
  ('electrician','Electrician',   'மின் பணியாளர்',    'इलेक्ट्रीशियन',      '💡', 60),
  ('grocery',    'Grocery',       'மளிகை',            'किराना',            '🛒', 70),
  ('beautician', 'Beautician / Salon', 'அழகுக்கலை',   'ब्यूटीशियन / सैलून', '💇', 80),
  ('carpenter',  'Carpenter',     'தச்சர்',           'बढ़ई',              '🪚', 90),
  ('maid',       'Maid / Cook',   'வேலையாள் / சமையல்', 'मेड / रसोइया',      '🧹', 100),
  ('tailor',     'Tailor',        'தையல்காரர்',       'दर्जी',             '🧵', 110),
  ('cab',        'Cab / Driver',  'கார் / டிரைவர்',    'कैब / ड्राइवर',      '🚗', 120),
  ('pet',        'Pet Care',      'செல்லப்பிராணி',     'पालतू देखभाल',       '🐾', 130),
  ('other',      'Other',         'மற்றவை',           'अन्य',              '📌', 999)
) as x(slug, name_en, name_ta, name_hi, icon, sort_order)
on conflict (community_id, slug) do nothing;
