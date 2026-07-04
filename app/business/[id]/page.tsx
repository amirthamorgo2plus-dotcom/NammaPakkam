import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBusiness } from '@/lib/data';
import BusinessDetail from '@/components/BusinessDetail';

export const dynamic = 'force-dynamic';

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await getBusiness(id);
  if (!b) notFound();
  return (
    <div className="px-4 pt-4">
      <Link href="/directory" className="text-sm text-brand-600">← Back</Link>
      <BusinessDetail b={b} />
    </div>
  );
}
