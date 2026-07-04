import { createClient } from './supabase/server';
import type { Business, Resident } from './types';
import { MOCK_BUSINESSES, isSupabaseConfigured } from './mock';

const MOCK_PENDING_RESIDENTS: Resident[] = [
  { id: 'r1', community_id: 'm', full_name: 'Meena Krishnan', phone: '9876512345', block: 'C', flat_no: 'C-210', status: 'pending', role: 'resident', avatar_url: null, created_at: '2026-06-29' },
  { id: 'r2', community_id: 'm', full_name: 'Arun Prakash', phone: '9876598765', block: 'A', flat_no: 'A-008', status: 'pending', role: 'resident', avatar_url: null, created_at: '2026-06-30' },
];

export async function getPendingResidents(): Promise<Resident[]> {
  if (!isSupabaseConfigured) return MOCK_PENDING_RESIDENTS;
  const sb = await createClient();
  const { data } = await sb.from('residents').select('*').eq('status', 'pending').order('created_at');
  return (data as Resident[]) ?? [];
}

export async function getAllListings(): Promise<Business[]> {
  if (!isSupabaseConfigured) {
    return [
      ...MOCK_BUSINESSES,
      { ...MOCK_BUSINESSES[2], id: 'b-pending', name: 'New Cake Studio', status: 'pending', is_verified: false, is_featured: false, rating_avg: 0, rating_count: 0, view_count: 0, click_count: 0 },
    ];
  }
  const sb = await createClient();
  const { data } = await sb
    .from('businesses')
    .select('*, category:categories(*)')
    .order('status')
    .order('created_at', { ascending: false });
  return (data as Business[]) ?? [];
}

export async function getAdminStats() {
  const [residents, listings] = await Promise.all([getPendingResidents(), getAllListings()]);
  const visitors = await getVisitorStats();

  return {
    pendingResidents: residents.length,
    pendingListings: listings.filter((b) => b.status === 'pending').length,
    totalListings: listings.filter((b) => b.status === 'approved').length,
    totalViews: listings.reduce((s, b) => s + (b.view_count ?? 0), 0),
    totalClicks: listings.reduce((s, b) => s + (b.click_count ?? 0), 0),
    ...visitors,
  };
}

export async function getVisitorStats() {
  if (!isSupabaseConfigured) {
    // Representative demo numbers so the dashboard isn't empty.
    return { today: 87, week: 210, month: 640, total: 1580 };
  }
  const sb = await createClient();
  const { data } = await sb.rpc('page_view_totals').single();
  const s = (data as any) ?? {};
  return {
    today: s.today ?? 0,
    week: s.week ?? 0,
    month: s.month ?? 0,
    total: s.total ?? 0,
  };
}
