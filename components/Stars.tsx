export default function Stars({ value, count }: { value: number; count?: number }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500 text-sm">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= full ? '' : 'text-stone-300'}>★</span>
      ))}
      {count != null && <span className="ml-1 text-stone-400 text-xs">({count})</span>}
    </span>
  );
}
