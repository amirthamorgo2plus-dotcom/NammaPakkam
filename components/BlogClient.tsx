'use client';

import { useI18n } from '@/lib/i18n';
import type { Post } from '@/lib/content';

export default function BlogClient({ posts }: { posts: Post[] }) {
  const { t } = useI18n();
  return (
    <div className="px-4 pt-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold">✍️ {t.blog}</h1>
        <p className="text-sm text-stone-500 mt-1">Tips, stories & guides for our neighbourhood.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {posts.map((p) => (
          <article key={p.slug} className="card p-4 flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sand-100 text-2xl">{p.emoji}</span>
            <div className="min-w-0">
              <span className="chip-off !py-0 text-[10px]">{p.tag}</span>
              <h2 className="font-semibold mt-1 leading-snug">{p.title}</h2>
              <p className="text-sm text-stone-600 mt-1">{p.excerpt}</p>
              <div className="text-xs text-stone-400 mt-2">
                {p.author} · {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
