'use client';

import type { Business } from '@/lib/types';
import { useI18n } from '@/lib/i18n';
import { isOpenNow, timingLabel } from '@/lib/openNow';
import Stars from './Stars';
import { createClient } from '@/lib/supabase/client';

const DAYS: { key: keyof NonNullable<Business['timings']>; label: string }[] = [
  { key: 'mon', label: 'Mon' }, { key: 'tue', label: 'Tue' }, { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' }, { key: 'fri', label: 'Fri' }, { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

export default function BusinessDetail({ b }: { b: Business }) {
  const { t } = useI18n();
  const open = isOpenNow(b.timings);

  const contact = (kind: 'wa' | 'call') => {
    createClient().rpc('bump_business_click', { bid: b.id });
    const num = (kind === 'wa' ? b.whatsapp : b.phone)?.replace(/\D/g, '');
    if (!num) return;
    window.location.href = kind === 'wa' ? `https://wa.me/91${num}` : `tel:+91${num}`;
  };

  return (
    <div className="space-y-4 pt-3">
      <div className="aspect-video w-full rounded-2xl bg-sand-100 overflow-hidden grid place-items-center text-6xl">
        {b.photos?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.photos[0]} alt={b.name} className="h-full w-full object-cover" />
        ) : (
          <span>{b.category?.icon ?? '🏪'}</span>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">{b.name}</h1>
          {b.is_verified && <span className="chip-on !py-0.5">✔ {t.verified}</span>}
        </div>
        <div className="text-sm text-stone-500 mt-1">
          {b.category?.icon} {b.category?.name_en}
          {b.owner_name && ` · ${b.owner_name}`}
          {b.block && ` · ${b.block}${b.flat_no ? ` (${b.flat_no})` : ''}`}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <Stars value={b.rating_avg} count={b.rating_count} />
          <span className={`text-sm font-medium ${open ? 'text-green-600' : 'text-stone-400'}`}>
            {open ? `● ${t.openNow}` : timingLabel(b.timings)}
          </span>
        </div>
      </div>

      {b.description && <p className="text-stone-700">{b.description}</p>}

      {/* Timings table */}
      <div className="card p-4">
        <h3 className="font-semibold mb-2">🕒 Timings</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          {DAYS.map((d) => {
            const h = b.timings?.[d.key];
            return (
              <div key={d.key} className="flex justify-between">
                <span className="text-stone-500">{d.label}</span>
                <span>{h ? `${h[0]}–${h[1]}` : 'Closed'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky contact bar */}
      <div className="sticky bottom-16 flex gap-2">
        {b.whatsapp && (
          <button onClick={() => contact('wa')} className="btn-wa flex-1">🟢 {t.whatsapp}</button>
        )}
        {b.phone && (
          <button onClick={() => contact('call')} className="btn-primary flex-1">📞 {t.call}</button>
        )}
      </div>
    </div>
  );
}
