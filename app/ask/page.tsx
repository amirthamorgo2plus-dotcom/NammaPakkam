import Link from 'next/link';

export default function AskPage() {
  return (
    <div className="px-4 pt-4 space-y-4">
      <h1 className="text-lg font-bold">💬 Ask the Community</h1>
      <div className="card p-5 space-y-3">
        <p className="text-stone-600 text-sm">
          Need a maths tutor? A reliable plumber? Post a request and neighbours recommend —
          plus an AI search that answers from the directory first.
        </p>
        <div className="rounded-xl bg-sand-100 p-3 text-sm text-stone-500">
          <strong>Phase 2.</strong> The data model (<code>requests</code> + <code>request_replies</code>)
          is already in the migration. The board UI + AI directory-search land in the next module.
        </div>
        <Link href="/directory" className="btn-primary w-full">Browse the directory meanwhile</Link>
      </div>
    </div>
  );
}
