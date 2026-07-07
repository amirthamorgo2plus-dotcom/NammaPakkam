import { getPlaces } from '@/lib/cms';
import ExploreClient from '@/components/ExploreClient';

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const places = await getPlaces();
  return <ExploreClient places={places} />;
}
