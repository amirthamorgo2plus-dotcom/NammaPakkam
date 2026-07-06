import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/mock';

// Bulk-import businesses. Admin-only (verified via RLS on the user session),
// then inserts with the service role so listings land pre-approved.
export async function POST(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ message: 'Demo mode — connect Supabase to import.' }, { status: 200 });
  }

  const { rows } = await req.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ message: 'No rows' }, { status: 400 });
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const { data: me } = await sb.from('residents').select('role, community_id').eq('id', user?.id ?? '').single();
  if (!me || !['admin', 'super_admin'].includes(me.role)) {
    return NextResponse.json({ message: 'Admin only' }, { status: 403 });
  }

  const { data: cats } = await sb.from('categories').select('id, slug, name_en');
  const findCat = (s: string) => {
    const t = s.toLowerCase().trim();
    return cats?.find((c) => c.slug === t || c.name_en.toLowerCase().includes(t))?.id ?? null;
  };

  const admin = createAdminClient();
  const payload = rows.map((r: any) => ({
    community_id: me.community_id,
    name: r.name,
    owner_name: r.owner || null,
    category_id: findCat(r.category || ''),
    phone: r.phone || null,
    whatsapp: r.phone || null,
    block: r.block || null,
    description: r.description || null,
    status: 'approved',
  }));

  const { error } = await admin.from('businesses').insert(payload);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  // Best-effort audit (as the importing admin, via their session client).
  try {
    await sb.rpc('log_audit', {
      p_action: 'listing.bulk_import',
      p_entity_type: 'business',
      p_entity_id: null,
      p_community_id: me.community_id,
      p_meta: { count: payload.length },
    });
  } catch {
    /* audit is best-effort */
  }

  return NextResponse.json({ message: `✅ Imported ${payload.length} businesses` });
}
