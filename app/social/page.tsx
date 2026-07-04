import { INITIATIVES } from '@/lib/content';
import SocialClient from '@/components/SocialClient';

export default function SocialPage() {
  return <SocialClient initiatives={INITIATIVES} />;
}
