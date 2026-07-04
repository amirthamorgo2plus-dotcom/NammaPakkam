import Link from 'next/link';
import { getBlocks, getCategories, getFeatured, getNotices } from '@/lib/data';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [blocks, categories, featured, notices] = await Promise.all([
    getBlocks(),
    getCategories(),
    getFeatured(),
    getNotices(),
  ]);

  return (
    <HomeClient
      blocks={blocks}
      categories={categories}
      featured={featured}
      pinnedNotice={notices.find((n) => n.is_pinned) ?? notices[0] ?? null}
    />
  );
}
