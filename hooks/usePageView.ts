import { useEffect } from 'react';

// Fire-and-forget page-view ping. Records one view per path change.
export function usePageView(path: string) {
  useEffect(() => {
    if (!path) return;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path }),
    }).catch(() => {
      // swallow — tracking must never break the page
    });
  }, [path]);
}
