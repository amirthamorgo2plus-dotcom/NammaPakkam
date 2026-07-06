'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import type { Community } from '@/lib/types';

export default function CommunitiesClient({ communities }: { communities: Community[] }) {
  const { t } = useI18n();

  return (
    <div className="px-4 pt-6 space-y-6">
      {/* Hero */}
      <div className="text-center space-y-2">
        <div className="text-4xl">🧡</div>
        <h1 className="text-2xl font-bold text-stone-800">{t.appName}</h1>
        <p className="text-stone-600 text-sm max-w-sm mx-auto">
          🌸 {t.womenFocus} — discover the tiffin makers, tutors, tailors &amp; home
          businesses run by the women next door.
        </p>
        <p className="text-stone-400 text-xs">Pick your community to begin.</p>
      </div>

      {/* Community cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {communities.map((c) => {
          const card = (
            <div
              className={`relative overflow-hidden rounded-2xl shadow-sm ${
                c.status === 'coming_soon' ? 'opacity-80' : ''
              }`}
            >
              <div className={`h-32 w-full bg-gradient-to-br ${c.theme} grid place-items-center`}>
                {c.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image_url} alt={c.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-5xl drop-shadow">{c.emoji}</span>
                )}
                {c.status === 'coming_soon' && (
                  <span className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                    Coming soon
                  </span>
                )}
              </div>
              <div className="bg-white p-3">
                <div className="font-bold text-stone-800">{c.name}</div>
                <div className="text-xs text-stone-500">
                  {c.city}
                  {c.homes ? ` · ${c.homes.toLocaleString('en-IN')} homes` : ''}
                </div>
              </div>
            </div>
          );

          return c.status === 'active' ? (
            <Link key={c.id} href={`/c/${c.slug}`} className="block active:scale-[0.98] transition">
              {card}
            </Link>
          ) : (
            <div key={c.id} className="cursor-not-allowed">{card}</div>
          );
        })}
      </div>

      {/* Bring your community CTA */}
      <div className="card p-5 text-center bg-brand-50 border-brand-100">
        <h2 className="font-bold text-stone-800">Want {t.appName} for your community?</h2>
        <p className="text-sm text-stone-600 mt-1">
          Apartment, gated community or RWA — get your own directory, noticeboard & women-entrepreneur collective.
        </p>
        <a href="mailto:hello@xeltrixchem.com?subject=Bring%20Pakkam%20to%20our%20community" className="btn-primary mt-3 inline-flex">
          Request your community
        </a>
      </div>
    </div>
  );
}
