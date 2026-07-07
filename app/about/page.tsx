import { getPage } from '@/lib/cms';
import { Markdown } from '@/lib/md';

export const dynamic = 'force-dynamic';

const FALLBACK = `**Namma Pakkam** means *"our neighbourhood."* We put the women entrepreneurs of every apartment community first — the tiffin makers, tutors, tailors and home businesses run by the women next door.

When you hire the tutor two blocks away or order tiffin from the aunty upstairs, money, skills and trust stay within your own community. Every listing is a livelihood; every hire is a small act of support.`;

export default async function AboutPage() {
  const page = await getPage('about');
  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      <h1 className="text-2xl font-bold text-stone-800">{page?.title ?? 'About Namma Pakkam'}</h1>
      <Markdown text={page?.body ?? FALLBACK} />
    </div>
  );
}
