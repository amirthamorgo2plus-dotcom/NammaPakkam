// Shared domain types (mirror the Supabase schema; hand-maintained for MVP).

export type ResidentStatus = 'pending' | 'approved' | 'rejected' | 'blocked';
export type ResidentRole = 'resident' | 'admin' | 'super_admin';
export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'hidden';
export type ClassifiedKind = 'sell' | 'rent' | 'wanted' | 'lost' | 'found' | 'free';

export type DayHours = [string, string] | null; // ["09:00","21:00"] or null = closed
export type Timings = Partial<Record<'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun', DayHours>>;

export interface Category {
  id: string;
  community_id: string;
  slug: string;
  name_en: string;
  name_ta: string | null;
  name_hi: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Business {
  id: string;
  community_id: string;
  owner_id: string | null;
  category_id: string | null;
  name: string;
  owner_name: string | null;
  description: string | null;
  photos: string[];
  whatsapp: string | null;
  phone: string | null;
  block: string | null;
  flat_no: string | null;
  timings: Timings;
  is_verified: boolean;
  status: ListingStatus;
  rating_avg: number;
  rating_count: number;
  view_count: number;
  click_count: number;
  created_at: string;
  // joined / computed
  category?: Category | null;
  is_featured?: boolean;
}

export interface Resident {
  id: string;
  community_id: string;
  full_name: string;
  phone: string | null;
  block: string | null;
  flat_no: string | null;
  status: ResidentStatus;
  role: ResidentRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Notice {
  id: string;
  title: string;
  body: string | null;
  is_pinned: boolean;
  published_at: string;
  expires_at: string | null;
}

export interface Classified {
  id: string;
  resident_id: string;
  kind: ClassifiedKind;
  title: string;
  description: string | null;
  price: number | null;
  photos: string[];
  contact_phone: string | null;
  status: ListingStatus;
  expires_at: string | null;
  created_at: string;
}
