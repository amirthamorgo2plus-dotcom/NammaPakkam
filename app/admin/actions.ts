'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/mock';

// All actions are RLS-guarded: only an approved admin's session passes the
// `is_admin()` policy checks. In demo (no Supabase) mode they no-op.

export async function setResidentStatus(id: string, status: 'approved' | 'rejected' | 'blocked') {
  if (!isSupabaseConfigured) return;
  const sb = await createClient();
  await sb.from('residents').update({ status, approved_at: new Date().toISOString() }).eq('id', id);
  revalidatePath('/admin/residents');
  revalidatePath('/admin');
}

export async function setListingStatus(id: string, status: 'approved' | 'rejected' | 'hidden') {
  if (!isSupabaseConfigured) return;
  const sb = await createClient();
  await sb.from('businesses').update({ status }).eq('id', id);
  revalidatePath('/admin/listings');
  revalidatePath('/admin');
}

export async function toggleVerified(id: string, value: boolean) {
  if (!isSupabaseConfigured) return;
  const sb = await createClient();
  await sb.from('businesses').update({ is_verified: value }).eq('id', id);
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
  revalidatePath('/admin/listings');
  revalidatePath('/');
}

export async function postNotice(formData: FormData) {
  if (!isSupabaseConfigured) return;
  const sb = await createClient();
  const { data: comm } = await sb.from('communities').select('id').limit(1).single();
  await sb.from('notices').insert({
    community_id: comm?.id,
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body') ?? ''),
    is_pinned: formData.get('pinned') === 'on',
  });
  revalidatePath('/admin/notices');
  revalidatePath('/notices');
}
