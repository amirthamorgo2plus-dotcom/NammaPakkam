import { getAllListings } from '@/lib/admin';
import { setListingStatus, toggleVerified, toggleFeatured } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminListings() {
  const listings = await getAllListings();
  const pending = listings.filter((b) => b.status === 'pending');
  const live = listings.filter((b) => b.status === 'approved');

  return (
    <div className="space-y-5">
      {pending.length > 0 && (
        <section>
          <h2 className="font-bold mb-2">⏳ Awaiting approval ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((b) => (
              <div key={b.id} className="card p-4">
                <div className="font-semibold">{b.category?.icon} {b.name}</div>
                <div className="text-sm text-stone-500">{b.owner_name} · {b.block} · {b.category?.name_en}</div>
                {b.description && <p className="text-sm text-stone-600 mt-1">{b.description}</p>}
                <div className="flex gap-2 mt-3">
                  <form action={async () => { 'use server'; await setListingStatus(b.id, 'approved'); }} className="flex-1">
                    <button className="btn-primary w-full !py-1.5 text-sm">✓ Approve</button>
                  </form>
                  <form action={async () => { 'use server'; await setListingStatus(b.id, 'rejected'); }}>
                    <button className="btn-ghost !py-1.5 text-sm">Reject</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-bold mb-2">Live listings — analytics & controls</h2>
        <div className="card divide-y divide-sand-100">
          {live.map((b) => (
            <div key={b.id} className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{b.category?.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate flex items-center gap-1">
                    {b.name}
                    {b.is_verified && <span className="text-brand-500 text-xs">✔</span>}
                    {b.is_featured && <span className="chip-on !px-1.5 !py-0 text-[10px] bg-amber-400">★</span>}
                  </div>
                  <div className="text-xs text-stone-500">
                    👁️ {b.view_count} · 📞 {b.click_count} taps · ★ {b.rating_avg} ({b.rating_count})
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <form action={async () => { 'use server'; await toggleFeatured(b.id, !b.is_featured, b.community_id); }}>
                  <button className={`${b.is_featured ? 'chip-on bg-amber-400' : 'chip-off'} text-xs`}>
                    {b.is_featured ? '★ Featured' : '☆ Feature'}
                  </button>
                </form>
                <form action={async () => { 'use server'; await toggleVerified(b.id, !b.is_verified); }}>
                  <button className={`${b.is_verified ? 'chip-on' : 'chip-off'} text-xs`}>
                    {b.is_verified ? '✔ Verified' : 'Verify'}
                  </button>
                </form>
                <form action={async () => { 'use server'; await setListingStatus(b.id, 'hidden'); }}>
                  <button className="chip-off text-xs">Hide</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
