'use client';

import Link from 'next/link';
import { useI18n, catName } from '@/lib/i18n';
import type { Business, Category, Notice } from '@/lib/types';
import BusinessCard from './BusinessCard';

export default function HomeClient({
  blocks,
  categories,
  featured,
  pinnedNotice,
}: {
  blocks: string[];
  categories: Category[];
  featured: Business[];
  pinnedNotice: Notice | null;
}) {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-6 px-4 pt-4">
      {/* Search shortcut */}
      <Link href="/directory" className="block">
        <div className="input flex items-center gap-2 text-stone-400 cursor-text">
          🔍 <span>{t.search}</span>
        </div>
      </Link>

      {/* Pinned notice strip */}
      {pinnedNotice && (
        <Link href="/notices" className="block">
          <div className="card flex items-start gap-3 p-3 border-l-4 border-l-brand-500">
            <span className="text-xl">📢</span>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-brand-600">{t.pinned}</div>
              <div className="font-medium truncate">{pinnedNotice.title}</div>
              <div className="text-sm text-stone-500 line-clamp-1">{pinnedNotice.body}</div>
            </div>
          </div>
        </Link>
      )}

      {/* Community blocks */}
      <section>
        <h2 className="mb-2 font-bold text-stone-700">{t.blocks}</h2>
        <p className="text-xs text-stone-500 mb-2">{t.facilities}</p>
        <div className="grid grid-cols-3 gap-3">
          {blocks.map((blk) => (
            <Link
              key={blk}
              href={`/directory?block=${encodeURIComponent(blk)}`}
              className="card grid place-items-center gap-1 py-5 hover:border-brand-300 transition"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-brand-700 text-xl font-bold">
                {blk}
              </span>
              <span className="text-xs text-stone-500">{t.seeListings}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-bold text-stone-700">{t.categories}</h2>
          <Link href="/directory" className="text-sm text-brand-600">{t.viewAll}</Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/directory?category=${c.slug}`}
              className="flex flex-col items-center gap-1 text-center"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white border border-sand-200 text-2xl shadow-sm">
                {c.icon}
              </span>
              <span className="text-[11px] leading-tight text-stone-600">{catName(c, lang)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section>
          <h2 className="mb-2 font-bold text-stone-700">⭐ {t.featured}</h2>
          <div className="space-y-3">
            {featured.map((b) => (
              <BusinessCard key={b.id} b={b} />
            ))}
          </div>
        </section>
      )}

      {/* Add business CTA */}
      <Link href="/business/new" className="btn-primary w-full">
        ➕ {t.addListing}
      </Link>
    </div>
  );
}
