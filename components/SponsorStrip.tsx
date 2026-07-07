'use client';

import { useI18n } from '@/lib/i18n';

// Mild, site-wide sponsor acknowledgement — real logos, kept small.
const SPONSORS = [
  { name: 'Xeltrix Chemicals', href: 'https://xeltrixchem.com', logo: '/sponsors/xeltrix-chemicals.png' },
  { name: 'Xeltrix AI', href: 'https://ai.xeltrixchem.com', logo: '/sponsors/xeltrix-ai.png' },
];

export default function SponsorStrip() {
  const { t } = useI18n();
  return (
    <div className="mt-6 border-t border-sand-200 px-4 py-4">
      <div className="text-center text-[11px] uppercase tracking-wide text-stone-400 mb-2">
        {t.sponsoredBy}
      </div>
      <div className="flex items-center justify-center gap-3">
        {SPONSORS.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            title={s.name}
            aria-label={s.name}
            className="sponsor-chip flex items-center justify-center rounded-xl border border-sand-200 px-3 py-2 shadow-sm hover:shadow transition"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.logo} alt={s.name} className="h-7 w-auto object-contain" />
          </a>
        ))}
      </div>
    </div>
  );
}
