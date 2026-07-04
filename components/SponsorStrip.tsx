'use client';

import { useI18n } from '@/lib/i18n';

// Mild, site-wide sponsor acknowledgement. Kept small and non-intrusive.
const SPONSORS = [
  { name: 'Xeltrix Chemicals', tag: 'Molec™ · Atomix™ hygiene', href: 'https://xeltrixchem.com', emoji: '🧪' },
  { name: 'Xeltrix AI', tag: 'AI for local business', href: 'https://ai.xeltrixchem.com', emoji: '🤖' },
];

export default function SponsorStrip() {
  const { t } = useI18n();
  return (
    <div className="mt-6 border-t border-sand-200 px-4 py-4">
      <div className="text-center text-[11px] uppercase tracking-wide text-stone-400 mb-2">
        {t.sponsoredBy}
      </div>
      <div className="flex items-center justify-center gap-2">
        {SPONSORS.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-sand-200 bg-white px-3 py-1.5 text-xs hover:border-brand-300 transition"
          >
            <span className="text-base">{s.emoji}</span>
            <span className="leading-tight">
              <span className="block font-semibold text-stone-700">{s.name}</span>
              <span className="block text-[10px] text-stone-400">{s.tag}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
