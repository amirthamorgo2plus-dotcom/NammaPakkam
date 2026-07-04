import { getCategories } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminCategories() {
  const categories = await getCategories();
  return (
    <div className="space-y-3">
      <h2 className="font-bold">Categories</h2>
      <p className="text-sm text-stone-500">
        Manage the directory categories. (Add/edit/reorder UI ships with the admin module —
        the <code>categories</code> table and seed are already in the migration.)
      </p>
      <div className="card divide-y divide-sand-100">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 p-3">
            <span className="text-xl">{c.icon}</span>
            <div className="flex-1">
              <div className="font-medium">{c.name_en}</div>
              <div className="text-xs text-stone-500">{c.name_ta} · /{c.slug}</div>
            </div>
            <span className="text-xs text-stone-400">#{c.sort_order}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
