'use client';

import { useI18n } from '@/lib/i18n';
import type { Initiative } from '@/lib/content';

const STATUS: Record<Initiative['status'], { label: string; cls: string }> = {
  ongoing: { label: 'Ongoing', cls: 'bg-green-100 text-green-700' },
  upcoming: { label: 'Upcoming', cls: 'bg-amber-100 text-amber-700' },
  done: { label: 'Completed', cls: 'bg-stone-100 text-stone-500' },
};

export default function SocialClient({ initiatives }: { initiatives: Initiative[] }) {
  const { t } = useI18n();
  return (
    <div className="px-4 pt-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold">🤝 {t.social}</h1>
        <p className="text-sm text-stone-500 mt-1">
          How our community gives back — together.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {initiatives.map((i) => {
          const s = STATUS[i.status];
          return (
            <div key={i.id} className="card p-4">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-sand-100 text-2xl">{i.emoji}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${s.cls}`}>{s.label}</span>
              </div>
              <h2 className="font-semibold mt-3">{i.title}</h2>
              <p className="text-sm text-stone-600 mt-1">{i.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="card p-4 text-center bg-brand-50 border-brand-100">
        <p className="text-sm text-stone-700">Have an idea for the community? Bring it to the next residents' meet. 🌍</p>
      </div>
    </div>
  );
}
