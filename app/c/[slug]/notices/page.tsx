import { getNotices } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function CommunityNotices({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const notices = await getNotices(slug);
  return (
    <div className="px-4 pt-4 space-y-3">
      <h1 className="text-lg font-bold">📢 Notices</h1>
      {notices.map((n) => (
        <div key={n.id} className={`card p-4 ${n.is_pinned ? 'border-l-4 border-l-brand-500' : ''}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{n.title}</h3>
            {n.is_pinned && <span className="chip-on !py-0.5 text-[10px]">📌 Pinned</span>}
          </div>
          <p className="text-sm text-stone-600 mt-1">{n.body}</p>
          <div className="text-xs text-stone-400 mt-2">
            {new Date(n.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      ))}
      {notices.length === 0 && <div className="card p-8 text-center text-stone-500">No notices yet.</div>}
    </div>
  );
}
