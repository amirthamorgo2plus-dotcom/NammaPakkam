import { getNotices } from '@/lib/data';
import { postNotice } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminNotices() {
  const notices = await getNotices();
  return (
    <div className="space-y-4">
      <form action={postNotice} className="card p-4 space-y-3">
        <h2 className="font-bold">Post a notice</h2>
        <input name="title" required placeholder="Title" className="input" />
        <textarea name="body" placeholder="Message…" rows={3} className="input" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="pinned" /> 📌 Pin to top
        </label>
        <button className="btn-primary w-full">Publish</button>
      </form>

      <h2 className="font-bold">Published</h2>
      <div className="space-y-2">
        {notices.map((n) => (
          <div key={n.id} className="card p-3">
            <div className="font-medium">{n.is_pinned ? '📌 ' : ''}{n.title}</div>
            <div className="text-sm text-stone-500">{n.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
