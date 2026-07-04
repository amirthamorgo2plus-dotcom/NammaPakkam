import type { Timings } from './types';

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

// Is the business open right now? IST assumed (community-local).
export function isOpenNow(timings: Timings | null | undefined, now = new Date()): boolean {
  if (!timings) return false;
  const day = DAYS[now.getDay()];
  const hours = timings[day];
  if (!hours) return false;
  const [open, close] = hours;
  const cur = now.getHours() * 60 + now.getMinutes();
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const o = toMin(open);
  const c = toMin(close);
  // handle overnight (e.g. 18:00–02:00)
  return c >= o ? cur >= o && cur <= c : cur >= o || cur <= c;
}

export function timingLabel(timings: Timings | null | undefined, now = new Date()): string {
  if (!timings) return 'Hours not listed';
  const day = DAYS[now.getDay()];
  const hours = timings[day];
  if (!hours) return 'Closed today';
  return `${hours[0]} – ${hours[1]}`;
}
