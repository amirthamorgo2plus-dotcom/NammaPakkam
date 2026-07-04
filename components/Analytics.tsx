'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { createClient } from '@/lib/supabase/client';

const isConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT');

// Stable-per-browser anonymous id (no personal data) for unique-visitor counts.
function visitorId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = localStorage.getItem('pakkam-vid');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('pakkam-vid', id);
  }
  return id;
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isConfigured || pathname?.startsWith('/admin')) return;
    createClient().rpc('log_page_view', { p_path: pathname, p_visitor: visitorId() });
  }, [pathname]);

  // Vercel Web Analytics (free on Hobby) for the quick dashboard view.
  return <VercelAnalytics />;
}
