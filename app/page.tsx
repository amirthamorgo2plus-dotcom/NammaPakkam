import { getCommunities } from '@/lib/data';
import CommunitiesClient from '@/components/CommunitiesClient';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const communities = await getCommunities();
  return <CommunitiesClient communities={communities} />;
}
