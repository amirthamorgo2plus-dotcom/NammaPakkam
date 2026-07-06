-- ============================================================================
-- Pakkam — Migration 0004: admin surface for Xeltrix Command
--   (a) community meta columns  → real status/onboarding, not code-defaults
--   (b) audit_log               → cross-community activity trail
-- Run in the Supabase SQL editor (project rskpqlswmnyydltjsfbr) after 0001–0003.
-- Safe to re-run (idempotent).
-- ============================================================================

-- ── (a) Community meta ──────────────────────────────────────────────────────
alter table communities
  add column if not exists status    text not null default 'active',
  add column if not exists homes     integer,
  add column if not exists image_url text,
  add column if not exists theme     text,
  add column if not exists emoji     text default '🏡';

-- status ∈ active | coming_soon | paused
do $$ begin
  alter table communities
    add constraint communities_status_chk check (status in ('active', 'coming_soon', 'paused'));
exception when duplicate_object then null; end $$;

-- backfill the existing community with friendly values
update communities
  set homes = coalesce(homes, 1000),
      emoji = coalesce(emoji, '🏡'),
      status = coalesce(status, 'active')
  where slug = 'pakkam';

-- ── (b) Audit log ───────────────────────────────────────────────────────────
create table if not exists audit_log (
  id           bigint generated always as identity primary key,
  actor        uuid references auth.users(id) on delete set null,
  actor_name   text,                 -- denormalised for easy display
  community_id uuid references communities(id) on delete set null,
  action       text not null,        -- e.g. 'resident.approve', 'listing.hide', 'community.create'
  entity_type  text,                 -- 'resident' | 'business' | 'classified' | 'notice' | 'community' | ...
  entity_id    uuid,
  meta         jsonb default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists audit_log_community_idx on audit_log(community_id, created_at desc);
create index if not exists audit_log_created_idx    on audit_log(created_at desc);

alter table audit_log enable row level security;

-- Admins (and the service role, which bypasses RLS) can read; admins can write.
drop policy if exists audit_read on audit_log;
create policy audit_read on audit_log for select using (is_admin());

drop policy if exists audit_insert on audit_log;
create policy audit_insert on audit_log for insert with check (is_admin());

-- Convenience writer so the app / Command can log in one call.
create or replace function log_audit(
  p_action text, p_entity_type text, p_entity_id uuid,
  p_community_id uuid default null, p_meta jsonb default '{}'::jsonb
) returns void as $$
  insert into audit_log (actor, actor_name, community_id, action, entity_type, entity_id, meta)
  select auth.uid(),
         (select full_name from residents where id = auth.uid()),
         p_community_id, p_action, p_entity_type, p_entity_id, coalesce(p_meta, '{}'::jsonb);
$$ language sql security definer set search_path = public;

grant execute on function log_audit(text, text, uuid, uuid, jsonb) to authenticated;
