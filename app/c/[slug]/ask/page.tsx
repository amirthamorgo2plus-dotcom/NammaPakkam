import Link from 'next/link';

export default async function CommunityAsk({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="px-4 pt-4 space-y-4">
      <h1 className="text-lg font-bold">💬 Ask the Community</h1>
      <div className="card p-5 space-y-3">
        <p className="text-stone-600 text-sm">
          Need a maths tutor? A reliable plumber? Post a request and neighbours recommend —
          the directory shows matching listings first.
        </p>
        <div className="rounded-xl bg-sand-100 p-3 text-sm text-stone-500">
          <strong>Phase 2.</strong> The data model (<code>requests</code> + <code>request_replies</code>)
          is already in the migration. The board UI lands in the next module.
        </div>
        <Link href={`/c/${slug}/directory`} className="btn-primary w-full">Browse the directory meanwhile</Link>
      </div>
    </div>
  );
}
