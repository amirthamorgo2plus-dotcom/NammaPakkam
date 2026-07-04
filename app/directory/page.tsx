import { getBusinesses, getCategories } from '@/lib/data';
import DirectoryClient from '@/components/DirectoryClient';

export const dynamic = 'force-dynamic';

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; block?: string; open?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const filter = {
    q: sp.q,
    category: sp.category,
    block: sp.block,
    openNow: sp.open === '1',
    sort: (sp.sort as 'rating' | 'newest') ?? 'rating',
  };
  const [businesses, categories] = await Promise.all([
    getBusinesses(filter),
    getCategories(),
  ]);

  return <DirectoryClient businesses={businesses} categories={categories} initial={filter} />;
}
