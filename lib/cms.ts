import { createClient } from './supabase/server';
import { isSupabaseConfigured } from './mock';
import { SCHEMES as FALLBACK_SCHEMES } from './content';

// ── Types ───────────────────────────────────────────────────────────────────
export interface CmsScheme {
  id: string;
  name: string;
  scope: string | null;
  who: string | null;
  description: string | null;
  link: string | null;
  emoji: string;
}

export interface Place {
  id: string;
  name: string;
  kind: string | null;
  area: string | null;
  description: string | null;
  image_url: string | null;
  map_url: string | null;
  tags: string[] | null;
}

export interface Story {
  id: string;
  name: string;
  business: string | null;
  category: string | null;
  area: string | null;
  photo_url: string | null;
  summary: string | null;
  story: string | null;
  is_featured: boolean;
}

export interface CmsPage {
  slug: string;
  title: string;
  body: string | null;
  hero_image: string | null;
}

const schemeEmoji = (scope: string | null) => (scope === 'Tamil Nadu' ? '📍' : '🏛️');

// ── Schemes (DB published, else the curated fallback) ───────────────────────
export async function getSchemes(): Promise<CmsScheme[]> {
  const fallback: CmsScheme[] = FALLBACK_SCHEMES.map((s) => ({
    id: s.id, name: s.name, scope: s.scope, who: s.who, description: s.desc, link: null, emoji: s.emoji,
  }));
  if (!isSupabaseConfigured) return fallback;
  const sb = await createClient();
  const { data } = await sb.from('schemes').select('*').eq('is_published', true).order('sort_order');
  if (!data || data.length === 0) return fallback;
  return (data as any[]).map((s) => ({
    id: s.id, name: s.name, scope: s.scope, who: s.who, description: s.description, link: s.link, emoji: schemeEmoji(s.scope),
  }));
}

// ── Places (city guide) ─────────────────────────────────────────────────────
export async function getPlaces(): Promise<Place[]> {
  if (!isSupabaseConfigured) return [];
  const sb = await createClient();
  const { data } = await sb.from('places').select('*').eq('is_published', true).order('sort_order');
  return (data as Place[]) ?? [];
}

// ── Stories (women entrepreneurs) ───────────────────────────────────────────
export async function getStories(): Promise<Story[]> {
  if (!isSupabaseConfigured) return [];
  const sb = await createClient();
  const { data } = await sb
    .from('stories')
    .select('*')
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('sort_order');
  return (data as Story[]) ?? [];
}

// ── Static pages ────────────────────────────────────────────────────────────
export async function getPage(slug: string): Promise<CmsPage | null> {
  if (!isSupabaseConfigured) return null;
  const sb = await createClient();
  const { data } = await sb.from('pages').select('slug,title,body,hero_image').eq('slug', slug).eq('is_published', true).single();
  return (data as CmsPage) ?? null;
}
