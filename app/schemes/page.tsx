import { getSchemes } from '@/lib/cms';
import SchemesClient from '@/components/SchemesClient';

export const dynamic = 'force-dynamic';

export default async function SchemesPage() {
  const schemes = await getSchemes();
  return <SchemesClient schemes={schemes} />;
}
