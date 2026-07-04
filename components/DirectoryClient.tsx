'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useI18n, catName } from '@/lib/i18n';
import type { Business, Category } from '@/lib/types';
import BusinessCard from './BusinessCard';

export default function DirectoryClient({
  businesses,
  categories,
  initial,
}: {
  businesses: Business[];
  categories: Category[];
  initial: { q?: string; category?: string; block?: string; openNow?: boolean; sort?: string };
}) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(initial.q ?? '');

  // Update one query param, preserving the rest.
  const setParam = (key: string, val: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (val == null || val === '') next.delete(key);
    else next.set(key, val);
    router.push(`/directory?${next.toString()}`);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParam('q', q);
  };

  return (
    <div className="px-4 pt-4 space-y-3">
      {/* Search */}
      <form onSubmit={submitSearch} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.search}
          className="input"
        />
        <button type="submit" className="btn-primary px-4">🔍</button>
      </form>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setParam('category', null)}
          className={!initial.category ? 'chip-on' : 'chip-off'}
        >
          {t.allCategories}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setParam('category', initial.category === c.slug ? null : c.slug)}
            className={initial.category === c.slug ? 'chip-on' : 'chip-off'}
          >
            {c.icon} {catName(c, lang)}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setParam('open', initial.openNow ? null : '1')}
          className={initial.openNow ? 'chip-on' : 'chip-off'}
        >
          ● {t.openNow}
        </button>
        {initial.block && (
          <button onClick={() => setParam('block', null)} className="chip-on">
            {t.blocks}: {initial.block} ✕
          </button>
        )}
        <div className="ml-auto flex items-center gap-1 text-sm">
          <button
            onClick={() => setParam('sort', 'rating')}
            className={(initial.sort ?? 'rating') === 'rating' ? 'chip-on' : 'chip-off'}
          >
            ★ {t.sortRating}
          </button>
          <button
            onClick={() => setParam('sort', 'newest')}
            className={initial.sort === 'newest' ? 'chip-on' : 'chip-off'}
          >
            {t.sortNewest}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3 pt-1">
        {businesses.length === 0 ? (
          <div className="card p-8 text-center text-stone-500">{t.noResults}</div>
        ) : (
          businesses.map((b) => <BusinessCard key={b.id} b={b} />)
        )}
      </div>
    </div>
  );
}
