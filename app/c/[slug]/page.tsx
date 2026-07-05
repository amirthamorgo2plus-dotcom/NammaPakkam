import { getBlocks, getCategories, getFeatured, getNotices } from '@/lib/data';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function CommunityHome({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [blocks, categories, featured, notices] = await Promise.all([
    getBlocks(slug),
    getCategories(slug),
    getFeatured(slug),
    getNotices(slug),
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
