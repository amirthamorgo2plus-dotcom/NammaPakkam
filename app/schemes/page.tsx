import { SCHEMES } from '@/lib/content';
import SchemesClient from '@/components/SchemesClient';

export default function SchemesPage() {
  return <SchemesClient schemes={SCHEMES} />;
}
