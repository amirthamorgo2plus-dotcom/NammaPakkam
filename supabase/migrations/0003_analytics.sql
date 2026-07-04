-- ============================================================================
-- Pakkam — Migration 0003: simple page-view tracking
-- Aggregate counts per (path, day). Written only by the service role via
-- /api/track; read by an external admin dashboard (and the in-app admin card
-- through the admin-gated page_view_totals() RPC).
-- ============================================================================

create table if not exists page_views (
  path       text not null,
  viewed_at  date not null default current_date,
  count      integer not null default 1,
  primary key (path, viewed_at)
);

alter table page_views enable row level security;

-- Lock the table down: no anon/authenticated access at all. The service-role
-- key (used server-side in /api/track) bypasses RLS; everyone else is denied.
drop policy if exists "service role only" on page_views;
create policy "service role only" on page_views using (false);

-- Atomic upsert-increment. Called by the service role from the API route.
-- (supabase-js .upsert() can only SET count, not increment it, so we do the
--  "on conflict do count = count + 1" in SQL here.)
create or replace function bump_page_view(p_path text) returns void as $$
  insert into page_views (path, viewed_at, count)
  values (p_path, current_date, 1)
  on conflict (path, viewed_at) do update set count = page_views.count + 1;
$$ language sql;

-- Admin-gated aggregate read for the in-app dashboard card (today / 7d / 30d /
-- all-time). SECURITY DEFINER so it can read past the locked-down RLS policy,
-- but it returns nothing unless the caller is an approved admin.
create or replace function page_view_totals()
returns table (today integer, week integer, month integer, total integer)
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then
    return; -- non-admins get zero rows
  end if;
  return query
    select
      coalesce(sum(count) filter (where viewed_at = current_date), 0)::int,
      coalesce(sum(count) filter (where viewed_at >= current_date - 6), 0)::int,
      coalesce(sum(count) filter (where viewed_at >= current_date - 29), 0)::int,
      coalesce(sum(count), 0)::int
    from page_views;
end;
$$;

grant execute on function page_view_totals() to authenticated;
