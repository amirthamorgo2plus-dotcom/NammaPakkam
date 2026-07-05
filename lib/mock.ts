import type { Business, Category, Community, Notice } from './types';

// Demo data so the app renders before Supabase is connected (free, offline).
export const MOCK_BLOCKS = ['A', 'B', 'C', 'D', 'E', 'F'];

// Multiple communities so the generic landing page can showcase expansion.
export const MOCK_COMMUNITIES: Community[] = [
  { id: 'm', slug: 'pakkam', name: 'Pakkam Residency', city: 'Coimbatore', blocks: MOCK_BLOCKS, image_url: null, homes: 1000, status: 'active', theme: 'from-brand-400 to-brand-600', emoji: '🏡' },
  { id: 'm2', slug: 'green-meadows', name: 'Green Meadows', city: 'Coimbatore', blocks: ['A', 'B', 'C'], image_url: null, homes: 480, status: 'coming_soon', theme: 'from-emerald-400 to-emerald-600', emoji: '🌿' },
  { id: 'm3', slug: 'lake-view', name: 'Lake View Residency', city: 'Chennai', blocks: ['1', '2', '3', '4'], image_url: null, homes: 720, status: 'coming_soon', theme: 'from-sky-400 to-indigo-500', emoji: '🌊' },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', community_id: 'm', slug: 'tuition', name_en: 'Home Tuition', name_ta: 'வீட்டுப் பயிற்சி', name_hi: 'गृह ट्यूशन', icon: '📚', sort_order: 10, is_active: true },
  { id: 'c2', community_id: 'm', slug: 'tiffin', name_en: 'Tiffin / Food', name_ta: 'டிபன் / உணவு', name_hi: 'टिफिन / खाना', icon: '🍱', sort_order: 20, is_active: true },
  { id: 'c3', community_id: 'm', slug: 'clothing', name_en: 'Clothing & Sarees', name_ta: 'ஆடை & சேலை', name_hi: 'कपड़े और साड़ी', icon: '🥻', sort_order: 30, is_active: true },
  { id: 'c4', community_id: 'm', slug: 'doctor', name_en: 'Doctor / Clinic', name_ta: 'மருத்துவர்', name_hi: 'डॉक्टर / क्लिनिक', icon: '🩺', sort_order: 40, is_active: true },
  { id: 'c5', community_id: 'm', slug: 'plumber', name_en: 'Plumber', name_ta: 'குழாய் பணியாளர்', name_hi: 'प्लंबर', icon: '🔧', sort_order: 50, is_active: true },
  { id: 'c6', community_id: 'm', slug: 'electrician', name_en: 'Electrician', name_ta: 'மின் பணியாளர்', name_hi: 'इलेक्ट्रीशियन', icon: '💡', sort_order: 60, is_active: true },
  { id: 'c7', community_id: 'm', slug: 'grocery', name_en: 'Grocery', name_ta: 'மளிகை', name_hi: 'किराना', icon: '🛒', sort_order: 70, is_active: true },
  { id: 'c8', community_id: 'm', slug: 'beautician', name_en: 'Beautician / Salon', name_ta: 'அழகுக்கலை', name_hi: 'ब्यूटीशियन / सैलून', icon: '💇', sort_order: 80, is_active: true },
];

const cat = (id: string) => MOCK_CATEGORIES.find((c) => c.id === id) ?? null;

const allDay = (o: string, c: string) => ({ mon: [o, c], tue: [o, c], wed: [o, c], thu: [o, c], fri: [o, c], sat: [o, c], sun: null } as any);

export const MOCK_BUSINESSES: Business[] = [
  { id: 'b1', community_id: 'm', owner_id: null, category_id: 'c1', name: 'Lakshmi Maths Tuition', owner_name: 'Lakshmi R', description: 'CBSE & State board, classes 6–12. Small batches.', photos: [], whatsapp: '9876543210', phone: '9876543210', block: 'B', flat_no: 'B-204', timings: allDay('16:00', '20:00'), is_verified: true, status: 'approved', rating_avg: 4.8, rating_count: 24, view_count: 320, click_count: 88, created_at: '2026-06-01', category: cat('c1'), is_featured: true },
  { id: 'b2', community_id: 'm', owner_id: null, category_id: 'c2', name: 'Amma Kitchen Tiffin', owner_name: 'Saroja', description: 'Daily home-cooked South Indian tiffin & lunch boxes.', photos: [], whatsapp: '9876500011', phone: '9876500011', block: 'A', flat_no: 'A-101', timings: allDay('07:00', '21:00'), is_verified: true, status: 'approved', rating_avg: 4.6, rating_count: 41, view_count: 510, click_count: 132, created_at: '2026-06-03', category: cat('c2'), is_featured: true },
  { id: 'b3', community_id: 'm', owner_id: null, category_id: 'c5', name: 'Quick Fix Plumbing', owner_name: 'Ramesh', description: 'Taps, leaks, motor & tank cleaning. Same-day.', photos: [], whatsapp: '9123456780', phone: '9123456780', block: 'D', flat_no: 'D-12', timings: allDay('08:00', '20:00'), is_verified: false, status: 'approved', rating_avg: 4.3, rating_count: 17, view_count: 210, click_count: 65, created_at: '2026-06-05', category: cat('c5'), is_featured: false },
  { id: 'b4', community_id: 'm', owner_id: null, category_id: 'c8', name: 'Glow Home Salon', owner_name: 'Priya', description: 'Ladies salon at home — facial, threading, bridal.', photos: [], whatsapp: '9988776655', phone: '9988776655', block: 'C', flat_no: 'C-307', timings: allDay('10:00', '19:00'), is_verified: true, status: 'approved', rating_avg: 4.9, rating_count: 33, view_count: 410, click_count: 120, created_at: '2026-06-07', category: cat('c8'), is_featured: false },
  { id: 'b5', community_id: 'm', owner_id: null, category_id: 'c4', name: 'Dr. Anand (GP)', owner_name: 'Dr. Anand', description: 'General physician, teleconsult + home visit on call.', photos: [], whatsapp: null, phone: '9000011122', block: 'E', flat_no: 'E-401', timings: allDay('18:00', '21:00'), is_verified: true, status: 'approved', rating_avg: 4.7, rating_count: 12, view_count: 180, click_count: 40, created_at: '2026-06-08', category: cat('c4'), is_featured: false },
  { id: 'b6', community_id: 'm', owner_id: null, category_id: 'c7', name: 'Daily Fresh Grocery', owner_name: 'Kumar', description: 'Doorstep grocery & vegetables. WhatsApp your list.', photos: [], whatsapp: '9555544433', phone: '9555544433', block: 'A', flat_no: 'A-005', timings: allDay('07:00', '22:00'), is_verified: false, status: 'approved', rating_avg: 4.1, rating_count: 28, view_count: 290, click_count: 95, created_at: '2026-06-09', category: cat('c7'), is_featured: false },
];

export const MOCK_NOTICES: Notice[] = [
  { id: 'n1', title: 'Water tanker schedule changed', body: 'From July, tankers arrive at 6 AM & 5 PM. Please store accordingly.', is_pinned: true, published_at: '2026-06-28', expires_at: null },
  { id: 'n2', title: 'Independence Day cultural event 🇮🇳', body: 'Aug 15, 6 PM at the clubhouse. Register your kids for events by Aug 10.', is_pinned: false, published_at: '2026-06-25', expires_at: null },
];

export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT');
