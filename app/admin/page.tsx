import Link from 'next/link';
import { getAdminStats, getAllListings } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const listings = await getAllListings();
  const topByViews = [...listings].filter((b) => b.status === 'approved').sort((a, b) => b.view_count - a.view_count).slice(0, 5);

  const cards = [
    { label: 'Pending residents', value: stats.pendingResidents, href: '/admin/residents', accent: 'bg-amber-100 text-amber-700' },
    { label: 'Pending listings', value: stats.pendingListings, href: '/admin/listings', accent: 'bg-rose-100 text-rose-700' },
    { label: 'Live listings', value: stats.totalListings, href: '/admin/listings', accent: 'bg-green-100 text-green-700' },
    { label: 'Total views', value: stats.totalViews, href: '#', accent: 'bg-blue-100 text-blue-700' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-4">
            <div className={`inline-block rounded-lg px-2 py-0.5 text-xs font-semibold ${c.accent}`}>{c.label}</div>
            <div className="text-3xl font-bold mt-2">{c.value}</div>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="font-bold mb-2">📈 Top listings by views</h2>
        <div className="card divide-y divide-sand-100">
          {topByViews.map((b, i) => (
            <div key={b.id} className="flex items-center gap-3 p-3">
              <span className="w-5 text-stone-400 font-bold">{i + 1}</span>
              <span className="text-xl">{b.category?.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{b.name}</div>
                <div className="text-xs text-stone-500">{b.category?.name_en}</div>
              </div>
              <div className="text-right text-sm">
                <div className="font-semibold">{b.view_count} 👁️</div>
                <div className="text-xs text-stone-500">{b.click_count} taps</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
