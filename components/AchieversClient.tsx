'use client';

import { useI18n } from '@/lib/i18n';
import type { Achiever } from '@/lib/content';

export default function AchieversClient({ achievers }: { achievers: Achiever[] }) {
  const { t } = useI18n();
  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="text-center">
        <h1 className="text-xl font-bold">🌟 {t.achievers}</h1>
        <p className="text-sm text-stone-500 mt-1">
          Celebrating the women whose small enterprises make our community stronger.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {achievers.map((a) => (
          <div key={a.id} className="card p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-2xl">{a.emoji}</span>
              <div>
                <div className="font-semibold text-stone-800">{a.name}</div>
                <div className="text-xs text-stone-500">Block {a.block} · {a.title}</div>
              </div>
            </div>
            <p className="text-sm text-stone-600 mt-3">{a.story}</p>
          </div>
        ))}
      </div>

      <div className="card p-4 text-center bg-brand-50 border-brand-100">
        <p className="text-sm text-stone-700">
          Know a woman entrepreneur who deserves a spotlight? Nominate her — we feature one story every month. 💛
        </p>
      </div>
    </div>
  );
}
