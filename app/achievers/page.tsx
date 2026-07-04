import { ACHIEVERS } from '@/lib/content';
import AchieversClient from '@/components/AchieversClient';

export default function AchieversPage() {
  return <AchieversClient achievers={ACHIEVERS} />;
}
