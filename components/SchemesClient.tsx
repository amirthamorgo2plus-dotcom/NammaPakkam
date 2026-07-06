'use client';

import { useI18n } from '@/lib/i18n';
import type { Scheme } from '@/lib/content';

export default function SchemesClient({ schemes }: { schemes: Scheme[] }) {
  const { t } = useI18n();
  const national = schemes.filter((s) => s.scope === 'National');
  const tn = schemes.filter((s) => s.scope === 'Tamil Nadu');

  const Card = (s: Scheme) => (
    <div key={s.id} className="card p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-100 text-xl">{s.emoji}</span>
        <div>
          <div className="font-semibold text-stone-800">{s.name}</div>
          <div className="text-[11px] font-medium text-brand-600 mt-0.5">For: {s.who}</div>
          <p className="text-sm text-stone-600 mt-1">{s.desc}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 pt-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold">🏛️ {t.schemes}</h1>
        <p className="text-sm text-stone-500 mt-1">
          Funding & support to help the women of our community start and grow their business.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-bold text-stone-700">🇮🇳 National</h2>
        {national.map(Card)}
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-stone-700">📍 Tamil Nadu</h2>
        {tn.map(Card)}
      </section>

      <div className="card p-3 bg-brand-50 border-brand-100 text-xs text-stone-500">
        ⚠️ Scheme names, amounts and eligibility change over time. Please confirm current details
        on the official government portal (or ask an admin) before applying.
      </div>
    </div>
  );
}
