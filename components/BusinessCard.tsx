'use client';

import Link from 'next/link';
import type { Business } from '@/lib/types';
import { useI18n } from '@/lib/i18n';
import { isOpenNow, timingLabel } from '@/lib/openNow';
import Stars from './Stars';
import { createClient } from '@/lib/supabase/client';

export default function BusinessCard({ b }: { b: Business }) {
  const { t } = useI18n();
  const open = isOpenNow(b.timings);

  // Fire-and-forget click tracking, then open the channel.
  const track = (e: React.MouseEvent, kind: 'wa' | 'call') => {
    e.stopPropagation();
    createClient().rpc('bump_business_click', { bid: b.id });
    const num = (kind === 'wa' ? b.whatsapp : b.phone)?.replace(/\D/g, '');
    if (!num) return;
    window.location.href = kind === 'wa' ? `https://wa.me/91${num}` : `tel:+91${num}`;
  };

  return (
    <div className={`card overflow-hidden ${b.is_featured ? 'ring-2 ring-amber-300' : ''}`}>
      <Link href={`/business/${b.id}`} className="flex gap-3 p-3">
        <div className="h-20 w-20 shrink-0 rounded-xl bg-sand-100 overflow-hidden grid place-items-center text-3xl">
          {b.photos?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.photos[0]} alt={b.name} className="h-full w-full object-cover" />
          ) : (
            <span>{b.category?.icon ?? '🏪'}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-stone-800 truncate">{b.name}</h3>
            {b.is_verified && <span title={t.verified} className="text-brand-500 text-sm">✔</span>}
            {b.is_featured && (
              <span className="chip-on !px-2 !py-0 text-[10px] bg-amber-400">{t.featured}</span>
            )}
          </div>
          <div className="text-xs text-stone-500 mt-0.5">
            {b.category?.icon} {b.category?.name_en} {b.block && `· ${b.block}`}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Stars value={b.rating_avg} count={b.rating_count} />
            <span className={`text-xs font-medium ${open ? 'text-green-600' : 'text-stone-400'}`}>
              {open ? `● ${t.openNow}` : timingLabel(b.timings)}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex gap-2 px-3 pb-3">
        {b.whatsapp && (
          <button onClick={(e) => track(e, 'wa')} className="btn-wa flex-1 !py-1.5 text-sm">
            🟢 {t.whatsapp}
          </button>
        )}
        {b.phone && (
          <button onClick={(e) => track(e, 'call')} className="btn-ghost flex-1 !py-1.5 text-sm">
            📞 {t.call}
          </button>
        )}
      </div>
    </div>
  );
}
