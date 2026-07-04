'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { compressImage } from '@/lib/compressImage';
import { useI18n } from '@/lib/i18n';

const MAX_PHOTOS = 3;
const BUCKET = 'public-media';

const isConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT');

// Derive the storage object path from a public URL so we can delete it.
function pathFromUrl(url: string): string | null {
  const m = url.match(/\/public-media\/(.+)$/);
  return m ? m[1] : null;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'listings',
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setNote(null);
    let next = [...value];

    for (const file of Array.from(files)) {
      const blob = await compressImage(file);

      // Enforce the cap: if already at 3, drop (and delete) the oldest first.
      if (next.length >= MAX_PHOTOS) {
        const oldest = next.shift()!;
        if (isConfigured) {
          const p = pathFromUrl(oldest);
          if (p) await createClient().storage.from(BUCKET).remove([p]);
        }
      }

      if (!isConfigured) {
        // Demo mode — show a local preview so the UX is visible without Supabase.
        next.push(URL.createObjectURL(blob));
        setNote('Demo preview — photos save for real once Supabase is connected.');
        continue;
      }

      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      const name = `${folder}/${user?.id ?? 'anon'}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const { error } = await sb.storage.from(BUCKET).upload(name, blob, {
        contentType: 'image/jpeg',
        upsert: false,
      });
      if (error) {
        setNote(error.message);
        continue;
      }
      const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(name);
      next.push(pub.publicUrl);
    }

    onChange(next.slice(-MAX_PHOTOS));
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function remove(url: string) {
    onChange(value.filter((u) => u !== url));
    if (isConfigured) {
      const p = pathFromUrl(url);
      if (p) await createClient().storage.from(BUCKET).remove([p]);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((url) => (
          <div key={url} className="relative h-20 w-20 rounded-xl overflow-hidden border border-sand-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute top-0.5 right-0.5 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white text-xs"
              aria-label="Remove photo"
            >
              ✕
            </button>
          </div>
        ))}
        {value.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="h-20 w-20 rounded-xl border-2 border-dashed border-sand-200 grid place-items-center text-stone-400 hover:border-brand-300"
          >
            {busy ? '…' : <span className="text-center text-xl leading-none">＋<br /><span className="text-[10px]">{t.addPhotos}</span></span>}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <p className="text-xs text-stone-400">{t.photosOptional}</p>
      {note && <p className="text-xs text-brand-600">{note}</p>}
    </div>
  );
}
