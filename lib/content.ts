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

export interface Scheme {
  id: string;
  name: string;
  scope: 'National' | 'Tamil Nadu';
  who: string;
  desc: string;
  emoji: string;
}

// Real government schemes that help women entrepreneurs. Details change — always
// verify on the official portal before applying (disclaimer shown on the page).
export const SCHEMES: Scheme[] = [
  { id: 's1', name: 'PM MUDRA Yojana', scope: 'National', who: 'Micro & small businesses', emoji: '💳', desc: 'Collateral-free loans up to ₹10 lakh (Shishu/Kishore/Tarun). Women borrowers get priority and often lower interest.' },
  { id: 's2', name: 'Stand-Up India', scope: 'National', who: 'Women / SC / ST founders', emoji: '🚀', desc: 'Bank loans of ₹10 lakh–₹1 crore for at least one woman entrepreneur per branch to set up a new enterprise.' },
  { id: 's3', name: 'Stree Shakti / Mahila Udyam Nidhi', scope: 'National', who: 'Women-owned enterprises', emoji: '🌸', desc: 'Bank packages with interest concessions and margin-money support for businesses majority-owned by women.' },
  { id: 's4', name: 'Annapurna Scheme', scope: 'National', who: 'Home food & catering', emoji: '🍲', desc: 'Loan for women in the food-catering business — to buy utensils, equipment and working capital.' },
  { id: 's5', name: 'Udyam Registration (MSME)', scope: 'National', who: 'Any small business', emoji: '📝', desc: 'Free online MSME registration — unlocks priority lending, subsidies and government-scheme eligibility. Start here.' },
  { id: 's6', name: 'Magalir Urimai Thogai', scope: 'Tamil Nadu', who: 'Women heads of family', emoji: '👩', desc: 'Monthly financial assistance to eligible women — a support base while building a home enterprise.' },
  { id: 's7', name: 'TNCDW – Mahalir Thittam / SHGs', scope: 'Tamil Nadu', who: 'Self-help group members', emoji: '🤝', desc: 'Tamil Nadu Corporation for Development of Women: SHG bank linkage, low-interest loans and skill training.' },
  { id: 's8', name: 'NEEDS', scope: 'Tamil Nadu', who: 'Educated women entrepreneurs', emoji: '🎓', desc: 'New Entrepreneur-cum-Enterprise Development Scheme — subsidy + soft loan and training to start a first enterprise.' },
];

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
