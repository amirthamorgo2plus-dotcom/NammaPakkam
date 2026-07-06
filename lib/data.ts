import { createClient } from './supabase/server';
import type { Business, Category, Community, Notice } from './types';
import {
  MOCK_BUSINESSES,
  MOCK_CATEGORIES,
  MOCK_COMMUNITIES,
  MOCK_NOTICES,
  MOCK_BLOCKS,
  isSupabaseConfigured,
} from './mock';

export interface DirectoryFilter {
  slug?: string; // community slug (multi-tenant scoping)
  q?: string;
  category?: string; // slug
  block?: string;
  openNow?: boolean;
  sort?: 'rating' | 'newest';
}

// ── Communities ─────────────────────────────────────────────────────────────
const CARD_THEMES = [
  'from-brand-400 to-brand-600',
  'from-emerald-400 to-emerald-600',
  'from-sky-400 to-indigo-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
];

// The base `communities` table only has slug/name/city/blocks/logo_url. Fill the
// presentation fields (status/theme/emoji/…) with defaults so the UI works even
// before those optional columns exist. New/active communities default to active.
function normalizeCommunity(row: any, i = 0): Community {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city ?? null,
    blocks: row.blocks ?? [],
    image_url: row.image_url ?? row.logo_url ?? null,
    homes: row.homes ?? null,
    status: (row.status as Community['status']) ?? 'active',
    theme: row.theme ?? CARD_THEMES[i % CARD_THEMES.length],
    emoji: row.emoji ?? '🏡',
  };
}

export async function getCommunities(): Promise<Community[]> {
  if (!isSupabaseConfigured) return MOCK_COMMUNITIES;
  const sb = await createClient();
  const { data } = await sb.from('communities').select('*').order('created_at');
  if (!data) return MOCK_COMMUNITIES;
  return (data as any[]).map((r, i) => normalizeCommunity(r, i));
}

export async function getCommunityBySlug(slug: string): Promise<Community | null> {
  if (!isSupabaseConfigured) return MOCK_COMMUNITIES.find((c) => c.slug === slug) ?? null;
  const sb = await createClient();
  const { data } = await sb.from('communities').select('*').eq('slug', slug).single();
  return data ? normalizeCommunity(data) : null;
}

// Resolve a slug → community id for scoping real queries.
async function communityId(sb: any, slug?: string): Promise<string | null> {
  if (!slug) return null;
  const { data } = await sb.from('communities').select('id').eq('slug', slug).single();
  return data?.id ?? null;
}

// ── Categories ──────────────────────────────────────────────────────────────
export async function getCategories(slug?: string): Promise<Category[]> {
  if (!isSupabaseConfigured) return MOCK_CATEGORIES;
  const sb = await createClient();
  let q = sb.from('categories').select('*').eq('is_active', true).order('sort_order');
  const cid = await communityId(sb, slug);
  if (cid) q = q.eq('community_id', cid);
  const { data } = await q;
  return data ?? MOCK_CATEGORIES;
}

// ── Blocks ──────────────────────────────────────────────────────────────────
export async function getBlocks(slug?: string): Promise<string[]> {
  if (!isSupabaseConfigured) {
    return MOCK_COMMUNITIES.find((c) => c.slug === slug)?.blocks ?? MOCK_BLOCKS;
  }
  const sb = await createClient();
  const q = slug
    ? sb.from('communities').select('blocks').eq('slug', slug).single()
    : sb.from('communities').select('blocks').limit(1).single();
  const { data } = await q;
  return data?.blocks ?? MOCK_BLOCKS;
}

// ── Notices ─────────────────────────────────────────────────────────────────
export async function getNotices(slug?: string): Promise<Notice[]> {
  if (!isSupabaseConfigured) return MOCK_NOTICES;
  const sb = await createClient();
  let q = sb
    .from('notices')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false });
  const cid = await communityId(sb, slug);
  if (cid) q = q.eq('community_id', cid);
  const { data } = await q;
  return data ?? MOCK_NOTICES;
}

// ── Businesses ──────────────────────────────────────────────────────────────
function applyMockFilter(list: Business[], f: DirectoryFilter): Business[] {
  let out = [...list];
  if (f.category) out = out.filter((b) => b.category?.slug === f.category);
  if (f.block) out = out.filter((b) => b.block === f.block);
  if (f.q) {
    const q = f.q.toLowerCase();
    out = out.filter(
      (b) => b.name.toLowerCase().includes(q) || (b.description ?? '').toLowerCase().includes(q) || (b.owner_name ?? '').toLowerCase().includes(q)
    );
  }
  if (f.openNow) {
    const { isOpenNow } = require('./openNow');
    out = out.filter((b) => isOpenNow(b.timings));
  }
  out.sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    if (f.sort === 'newest') return a.created_at < b.created_at ? 1 : -1;
    return b.rating_avg - a.rating_avg;
  });
  return out;
}

export async function getBusinesses(f: DirectoryFilter = {}): Promise<Business[]> {
  if (!isSupabaseConfigured) return applyMockFilter(MOCK_BUSINESSES, f);

  const sb = await createClient();
  let query = sb
    .from('businesses')
    .select('*, category:categories(*)')
    .eq('status', 'approved');

  const cid = await communityId(sb, f.slug);
  if (cid) query = query.eq('community_id', cid);
  if (f.block) query = query.eq('block', f.block);
  if (f.q) query = query.textSearch('search_tsv', f.q, { type: 'websearch', config: 'simple' });
  if (f.sort === 'newest') query = query.order('created_at', { ascending: false });
  else query = query.order('rating_avg', { ascending: false });

  const { data } = await query.limit(100);
  let rows = (data ?? []) as Business[];

  if (f.category) rows = rows.filter((b) => b.category?.slug === f.category);
  if (f.openNow) {
    const { isOpenNow } = require('./openNow');
    rows = rows.filter((b) => isOpenNow(b.timings));
  }
  // featured-first
  rows.sort((a, b) => (a.is_featured === b.is_featured ? 0 : a.is_featured ? -1 : 1));
  return rows;
}

export async function getBusiness(id: string): Promise<Business | null> {
  if (!isSupabaseConfigured) return MOCK_BUSINESSES.find((b) => b.id === id) ?? null;
  const sb = await createClient();
  const { data } = await sb.from('businesses').select('*, category:categories(*)').eq('id', id).single();
  if (data) sb.rpc('bump_business_view', { bid: id });
  return (data as Business) ?? null;
}

export async function getFeatured(slug?: string): Promise<Business[]> {
  const all = await getBusinesses({ slug, sort: 'rating' });
  return all.filter((b) => b.is_featured).slice(0, 5);
}
