export default function CommunityClassifieds() {
  return (
    <div className="px-4 pt-4 space-y-4">
      <h1 className="text-lg font-bold">🏷️ Classifieds</h1>
      <div className="card p-5 space-y-3">
        <p className="text-stone-600 text-sm">
          Buy / sell, rent, and lost &amp; found — with photo and auto-expiry.
        </p>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          {['🛒 Sell', '🏠 Rent', '🔍 Lost & Found'].map((x) => (
            <div key={x} className="card py-4">{x}</div>
          ))}
        </div>
        <div className="rounded-xl bg-sand-100 p-3 text-sm text-stone-500">
          <strong>Phase 2.</strong> The <code>classifieds</code> table (with <code>expires_at</code>)
          is in the migration. Posting UI + image upload land in the next module.
        </div>
      </div>
    </div>
  );
}
