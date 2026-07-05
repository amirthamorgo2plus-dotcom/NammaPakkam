import { getBusinesses, getCategories } from '@/lib/data';
import DirectoryClient from '@/components/DirectoryClient';

export const dynamic = 'force-dynamic';

export default async function CommunityDirectory({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; category?: string; block?: string; open?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const filter = {
    slug,
    q: sp.q,
    category: sp.category,
    block: sp.block,
    openNow: sp.open === '1',
    sort: (sp.sort as 'rating' | 'newest') ?? 'rating',
  };
  const [businesses, categories] = await Promise.all([
    getBusinesses(filter),
    getCategories(slug),
  ]);

  return <DirectoryClient businesses={businesses} categories={categories} initial={filter} />;
}
