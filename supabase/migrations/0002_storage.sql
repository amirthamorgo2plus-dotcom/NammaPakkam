-- ============================================================================
-- Pakkam — Migration 0002: Storage buckets + policies
-- Free-tier friendly: a single public bucket for images. (Audio/video feeds
-- come in a later phase; keep them out of free tier or cap size hard.)
-- ============================================================================

-- Public bucket for business photos, classifieds, avatars (images only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public-media', 'public-media', true,
  5242880,  -- 5 MB/file cap to protect the free 1 GB quota
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do nothing;

-- Anyone can read (public directory). Only approved residents can upload.
drop policy if exists media_read on storage.objects;
create policy media_read on storage.objects for select
  using (bucket_id = 'public-media');

drop policy if exists media_insert on storage.objects;
create policy media_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'public-media' and public.is_approved_resident());

drop policy if exists media_update on storage.objects;
create policy media_update on storage.objects for update to authenticated
  using (bucket_id = 'public-media' and owner = auth.uid());

drop policy if exists media_delete on storage.objects;
create policy media_delete on storage.objects for delete to authenticated
  using (bucket_id = 'public-media' and (owner = auth.uid() or public.is_admin()));
