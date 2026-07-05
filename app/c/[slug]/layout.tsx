import { notFound } from 'next/navigation';
import { getCommunityBySlug } from '@/lib/data';

// Guards every community route: a bad slug 404s instead of showing empty data.
export default async function CommunityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);
  if (!community || community.status !== 'active') notFound();
  return <>{children}</>;
}
