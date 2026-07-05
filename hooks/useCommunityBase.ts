'use client';

import { usePathname } from 'next/navigation';

// Returns the current community URL base ("/c/<slug>") or "" on global pages.
// Client components use this to build links that stay inside the community.
export function useCommunityBase(): string {
  const p = usePathname() || '';
  const m = p.match(/^\/c\/([^/]+)/);
  return m ? `/c/${m[1]}` : '';
}

export function useCommunitySlug(): string | null {
  const p = usePathname() || '';
  const m = p.match(/^\/c\/([^/]+)/);
  return m ? m[1] : null;
}
