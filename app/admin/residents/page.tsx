import { getPendingResidents } from '@/lib/admin';
import { setResidentStatus } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminResidents() {
  const residents = await getPendingResidents();

  return (
    <div className="space-y-3">
      <h2 className="font-bold">Pending resident approvals</h2>
      <p className="text-sm text-stone-500">Verify the flat number against the society register before approving.</p>

      {residents.length === 0 && <div className="card p-8 text-center text-stone-500">No one waiting. 🎉</div>}

      {residents.map((r) => (
        <div key={r.id} className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{r.full_name}</div>
              <div className="text-sm text-stone-500">
                Block {r.block} · Flat {r.flat_no} · {r.phone}
              </div>
            </div>
            <span className="chip-off text-xs">⏳ {r.status}</span>
          </div>
          <div className="flex gap-2 mt-3">
            <form action={async () => { 'use server'; await setResidentStatus(r.id, 'approved'); }} className="flex-1">
              <button className="btn-primary w-full !py-1.5 text-sm">✓ Approve</button>
            </form>
            <form action={async () => { 'use server'; await setResidentStatus(r.id, 'rejected'); }}>
              <button className="btn-ghost !py-1.5 text-sm">Reject</button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
