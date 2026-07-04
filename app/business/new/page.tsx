import { getCategories } from '@/lib/data';
import NewBusinessForm from '@/components/NewBusinessForm';

export const dynamic = 'force-dynamic';

export default async function NewBusinessPage() {
  const categories = await getCategories();
  return (
    <div className="px-4 pt-4">
      <h1 className="text-lg font-bold mb-1">➕ List your business</h1>
      <p className="text-sm text-stone-500 mb-4">
        Approved residents only. Your listing goes live after admin review.
      </p>
      <NewBusinessForm categories={categories} />
    </div>
  );
}
