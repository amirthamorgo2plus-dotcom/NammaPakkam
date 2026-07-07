'use client';

import { useI18n } from '@/lib/i18n';
import type { Place } from '@/lib/cms';

const GROUPS: { kind: string; label: string; emoji: string }[] = [
  { kind: 'gated_community', label: 'Gated Communities', emoji: '🏡' },
  { kind: 'temple', label: 'Temples & Spiritual', emoji: '🛕' },
  { kind: 'mall', label: 'Malls & Shopping', emoji: '🛍️' },
  { kind: 'park', label: 'Parks & Nature', emoji: '🌳' },
  { kind: 'entertainment', label: 'Entertainment', emoji: '🎡' },
  { kind: 'landmark', label: 'Landmarks & Museums', emoji: '📸' },
];

export default function ExploreClient({ places }: { places: Place[] }) {
  const { t } = useI18n();

  return (
    <div className="px-4 pt-4 space-y-5">
      <div>
        <h1 className="text-xl font-bold">🧭 {t.explore}</h1>
        <p className="text-sm text-stone-500 mt-1">
          A quick guide to Coimbatore — temples, malls, parks and places nearby.
        </p>
      </div>

      {places.length === 0 && (
        <div className="card p-8 text-center text-stone-500">City guide coming soon.</div>
      )}

      {GROUPS.map((g) => {
        const items = places.filter((p) => p.kind === g.kind);
        if (items.length === 0) return null;
        return (
          <section key={g.kind}>
            <h2 className="font-bold text-stone-700 mb-2">{g.emoji} {g.label}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((p) => (
                <div key={p.id} className="card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-stone-800">{p.name}</div>
                      {p.area && <div className="text-xs text-stone-500">📍 {p.area}</div>}
                    </div>
                    {p.map_url && (
                      <a href={p.map_url} target="_blank" rel="noopener noreferrer" className="chip-off text-xs shrink-0">
                        Map
                      </a>
                    )}
                  </div>
                  {p.description && <p className="text-sm text-stone-600 mt-2">{p.description}</p>}
                  {p.tags && p.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.tags.map((tag) => (
                        <span key={tag} className="text-[10px] rounded-full bg-sand-100 px-2 py-0.5 text-stone-500">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
