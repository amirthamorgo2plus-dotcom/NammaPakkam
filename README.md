# 🧡 Pakkam — Hyperlocal Community Directory

A mobile-first PWA that replaces a chaotic resident WhatsApp group with a clean
directory, classifieds, noticeboard and "ask the community" board — Tamil + English.

**Stack:** Next.js 14 (App Router) · Supabase (Postgres + Auth + Storage, Mumbai) · Tailwind · Vercel.

## Why it runs free today
- **Demo mode:** with no `.env.local`, the app serves seeded mock data so you can
  click through the whole UI offline. Connect Supabase to go live.
- **Storage:** a single public `public-media` bucket, **5 MB/file** cap to protect
  the free 1 GB quota. Resident audio/video feeds are gated behind login and
  deferred to a later phase (free tier can't host video cheaply).

## Quick start
```bash
npm install
npm run dev          # http://localhost:3005  (works in demo mode immediately)
```

## Going live with Supabase
1. Create a Supabase project in the **Mumbai (ap-south-1)** region.
2. SQL editor → run `supabase/migrations/0001_init.sql` then `0002_storage.sql`.
3. Copy `.env.local.example` → `.env.local` and fill the URL + keys.
4. Make yourself admin:
   ```sql
   update residents set role='super_admin', status='approved' where id='<your-auth-uid>';
   ```

## What's built (this pass)
| Module | Status |
|---|---|
| Data model + RLS migration | ✅ `supabase/migrations/` |
| Front page: community blocks, categories, featured, pinned notice | ✅ |
| Directory + search (category / keyword / open-now / sort / block) | ✅ |
| Business detail + one-tap WhatsApp/Call (click tracking) | ✅ |
| Resident signup (flat no) → admin approval | ✅ |
| Admin: dashboard, residents, listings (approve/verify/feature), notices, categories, bulk import | ✅ |
| Onboarding: join/QR poster, "add business" | ✅ |
| Notices | ✅ |
| Ask-the-community board + AI directory search | 🔜 Phase 2 (schema ready) |
| Classifieds posting UI | 🔜 Phase 2 (schema ready) |
| Razorpay promote-listing checkout | 🔜 Phase 2 (schema + admin toggle ready) |
| Multi-community SaaS | 🔜 Phase 3 (`community_id` everywhere) |

## Roadmap
- **Phase 1** directory + search + notices + admin ← *here*
- **Phase 2** ask-board + classifieds + featured listings (revenue)
- **Phase 3** reviews, events, RWA/maintenance, multi-community SaaS
