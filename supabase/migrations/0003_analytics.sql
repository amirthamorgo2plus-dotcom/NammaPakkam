-- ============================================================================
-- Pakkam — Migration 0003: lightweight visitor analytics (own your data, free)
-- A tiny append-only page-view log + rollup functions for the admin dashboard.
-- ============================================================================

create table if not exists page_views (
  id           bigint generated always as identity primary key,
  community_id uuid references communities(id) on delete cascade,
  path         text,
  visitor      text,          -- anonymous client id (hashed, not personal)
  created_at   timestamptz not null default now()
);
create index if not exists page_views_created_idx on page_views(created_at);
create index if not exists page_views_visitor_idx on page_views(visitor);

alter table page_views enable row level security;

-- Anyone may log a view; nobody may read rows directly (admins read via RPC).
drop policy if exists page_views_insert on page_views;
create policy page_views_insert on page_views for insert with check (true);

-- Log a view (called from the client on route change).
create or replace function log_page_view(p_path text, p_visitor text) returns void as $$
  insert into page_views (community_id, path, visitor)
  select id, p_path, p_visitor from communities order by created_at limit 1;
$$ language sql security definer set search_path = public;

grant execute on function log_page_view(text, text) to anon, authenticated;

-- Rollup for the admin dashboard: total views, unique visitors, today, 7-day.
create or replace function visitor_stats()
returns table (total_views bigint, unique_visitors bigint, today_views bigint, week_visitors bigint)
as $$
  select
    count(*)::bigint,
    count(distinct visitor)::bigint,
    count(*) filter (where created_at >= date_trunc('day', now()))::bigint,
    count(distinct visitor) filter (where created_at >= now() - interval '7 days')::bigint
  from page_views;
$$ language sql security definer set search_path = public;

grant execute on function visitor_stats() to authenticated;
