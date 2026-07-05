import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBusiness } from '@/lib/data';
import BusinessDetail from '@/components/BusinessDetail';

export const dynamic = 'force-dynamic';

export default async function CommunityBusiness({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const b = await getBusiness(id);
  if (!b) notFound();
  return (
    <div className="px-4 pt-4">
      <Link href={`/c/${slug}/directory`} className="text-sm text-brand-600">← Back</Link>
      <BusinessDetail b={b} />
    </div>
  );
}
