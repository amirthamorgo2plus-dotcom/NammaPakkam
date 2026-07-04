// Editorial content for Achievers / Blog / Social pages.
// Mock now; move to Supabase tables (achievers, posts) in a later phase.

export interface Achiever {
  id: string;
  name: string;
  block: string;
  title: string;      // what she's celebrated for
  story: string;
  emoji: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  emoji: string;
  tag: string;
}

export interface Initiative {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  status: 'ongoing' | 'done' | 'upcoming';
}

export const ACHIEVERS: Achiever[] = [
  { id: 'a1', name: 'Saroja Devi', block: 'A', title: 'Amma Kitchen · 40+ daily tiffins', story: 'Started with 5 lunch boxes for neighbours during lockdown, now feeds 40 families every day — all from her home kitchen.', emoji: '🍱' },
  { id: 'a2', name: 'Lakshmi R', block: 'B', title: 'Maths tutor · 100+ students', story: 'Guided over 100 kids through board exams in 6 years. Several of her students now study engineering and medicine.', emoji: '📚' },
  { id: 'a3', name: 'Priya S', block: 'C', title: 'Glow Home Salon', story: 'Left a salon job to start her own home service. Trained two other women from the community who now earn independently.', emoji: '💇' },
  { id: 'a4', name: 'Meena K', block: 'C', title: 'Handmade sarees & boutique', story: 'Turned a tailoring hobby into a boutique serving the whole apartment — and employs three tailors from nearby.', emoji: '🥻' },
];

export const POSTS: Post[] = [
  { slug: 'start-home-business', title: 'How 5 women started a home business this year', excerpt: 'From tiffins to tailoring — small steps, real income, and the neighbours who backed them.', author: 'Pakkam Team', date: '2026-06-20', emoji: '🌱', tag: 'Enterprise' },
  { slug: 'monsoon-ready', title: 'Getting your flat monsoon-ready', excerpt: 'Waterproofing, the right plumber, and mosquito-net vendors trusted by residents.', author: 'Pakkam Team', date: '2026-06-12', emoji: '🌧️', tag: 'Home' },
  { slug: 'safe-help', title: 'Finding safe, verified household help', excerpt: 'Why neighbour references beat random listings — and how to check them.', author: 'Pakkam Team', date: '2026-06-01', emoji: '🤝', tag: 'Community' },
];

export const INITIATIVES: Initiative[] = [
  { id: 's1', title: 'Skill-up Saturdays for women', desc: 'Free monthly workshops — basic accounting, WhatsApp marketing, and food-safety for home businesses.', emoji: '🎓', status: 'ongoing' },
  { id: 's2', title: 'Community food drive', desc: 'Surplus home-cooked meals shared with security & housekeeping staff every festival.', emoji: '🍲', status: 'ongoing' },
  { id: 's3', title: 'Plastic-free block challenge', desc: 'Blocks compete to cut single-use plastic; winners get a community garden corner.', emoji: '♻️', status: 'upcoming' },
  { id: 's4', title: 'Blood donation camp', desc: 'Organised with a nearby hospital — 60+ residents donated last drive.', emoji: '🩸', status: 'done' },
];
