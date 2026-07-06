'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/mock';

// All actions are RLS-guarded: only an approved admin's session passes the
// `is_admin()` policy checks. In demo (no Supabase) mode they no-op.

// Best-effort audit entry (via log_audit RPC). Never breaks the action if the
// audit_log table / RPC isn't present yet (migration 0004 not run) — swallow.
async function audit(
  sb: any,
  action: string,
  entityType: string,
  entityId: string | null,
  communityId: string | null,
  meta: Record<string, unknown> = {}
) {
  try {
    await sb.rpc('log_audit', {
      p_action: action,
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_community_id: communityId,
      p_meta: meta,
    });
  } catch {
    /* audit is best-effort */
  }
}

export async function setResidentStatus(id: string, status: 'approved' | 'rejected' | 'blocked') {
  if (!isSupabaseConfigured) return;
  const sb = await createClient();
  const { data } = await sb
    .from('residents')
    .update({ status, approved_at: new Date().toISOString() })
    .eq('id', id)
    .select('community_id')
    .single();
  await audit(sb, `resident.${status}`, 'resident', id, data?.community_id ?? null, { status });
  revalidatePath('/admin/residents');
  revalidatePath('/admin');
}

export async function setListingStatus(id: string, status: 'approved' | 'rejected' | 'hidden') {
  if (!isSupabaseConfigured) return;
  const sb = await createClient();
  const { data } = await sb
    .from('businesses')
    .update({ status })
    .eq('id', id)
    .select('community_id')
    .single();
  await audit(sb, `listing.${status}`, 'business', id, data?.community_id ?? null, { status });
  revalidatePath('/admin/listings');
  revalidatePath('/admin');
}

export async function toggleVerified(id: string, value: boolean) {
  if (!isSupabaseConfigured) return;
  const sb = await createClient();
  const { data } = await sb
    .from('businesses')
    .update({ is_verified: value })
    .eq('id', id)
    .select('community_id')
    .single();
  await audit(sb, value ? 'listing.verify' : 'listing.unverify', 'business', id, data?.community_id ?? null, {
    is_verified: value,
  });
  revalidatePath('/admin/listings');
}

// Featured = create/activate a promotion. Admin override (manual toggle).
export async function toggleFeatured(businessId: string, on: boolean, communityId: string) {
  if (!isSupabaseConfigured) return;
  const sb = await createClient();
  if (on) {
    await sb.from('promotions').insert({
      business_id: businessId,
      community_id: communityId,
      status: 'active',
      amount: 0,
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 30 * 864e5).toISOString(),
    });
  } else {
    await sb.from('promotions').update({ status: 'cancelled' }).eq('business_id', businessId).eq('status', 'active');
  }
  await audit(sb, on ? 'listing.feature' : 'listing.unfeature', 'business', businessId, communityId, { featured: on });
  revalidatePath('/admin/listings');
  revalidatePath('/');
}

export async function postNotice(formData: FormData) {
  if (!isSupabaseConfigured) return;
  const sb = await createClient();
  const { data: comm } = await sb.from('communities').select('id').limit(1).single();
  const title = String(formData.get('title') ?? '');
  const { data: notice } = await sb
    .from('notices')
    .insert({
      community_id: comm?.id,
      title,
      body: String(formData.get('body') ?? ''),
      is_pinned: formData.get('pinned') === 'on',
    })
    .select('id')
    .single();
  await audit(sb, 'notice.create', 'notice', notice?.id ?? null, comm?.id ?? null, { title });
  revalidatePath('/admin/notices');
  revalidatePath('/notices');
}
