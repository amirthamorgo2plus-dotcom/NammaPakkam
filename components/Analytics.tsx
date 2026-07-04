'use client';

import { usePathname } from 'next/navigation';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { usePageView } from '@/hooks/usePageView';

// Top-level tracker mounted once in the root layout. Captures every page
// navigation except admin/API routes, plus Vercel Web Analytics.
export default function Analytics() {
  const pathname = usePathname();
  const trackable = pathname && !pathname.startsWith('/admin') ? pathname : '';
  usePageView(trackable);

  return <VercelAnalytics />;
}
