'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';
import ImageUpload from './ImageUpload';

export default function NewBusinessForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.currentTarget);

    if (!configured) {
      setMsg('Demo mode — connect Supabase to save listings.');
      return;
    }
    setBusy(true);
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      setBusy(false);
      setMsg('Please log in first.');
      return;
    }
    const { data: me } = await sb.from('residents').select('community_id, status').eq('id', user.id).single();
    if (me?.status !== 'approved') {
      setBusy(false);
      setMsg('Your account is pending admin approval.');
      return;
    }
    const { error } = await sb.from('businesses').insert({
      community_id: me.community_id,
      owner_id: user.id,
      category_id: fd.get('category') || null,
      name: fd.get('name'),
      owner_name: fd.get('owner_name'),
      description: fd.get('description'),
      whatsapp: fd.get('whatsapp'),
      phone: fd.get('phone'),
      block: fd.get('block'),
      flat_no: fd.get('flat_no'),
      photos,
      status: 'pending',
    });
    setBusy(false);
    if (error) setMsg(error.message);
    else {
      setMsg('✅ Submitted! Pending admin approval.');
      setTimeout(() => router.push('/'), 1500);
    }
  }

  return (
    <form onSubmit={submit} className="card p-4 space-y-3">
      <input name="name" required placeholder="Business name" className="input" />
      <select name="category" className="input" defaultValue="">
        <option value="" disabled>Choose category…</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.icon} {c.name_en}</option>
        ))}
      </select>
      <input name="owner_name" placeholder="Owner name" className="input" />
      <textarea name="description" rows={3} placeholder="What do you offer?" className="input" />
      <ImageUpload value={photos} onChange={setPhotos} folder="listings" />
      <div className="flex gap-2">
        <input name="whatsapp" placeholder="WhatsApp number" className="input" />
        <input name="phone" placeholder="Call number" className="input" />
      </div>
      <div className="flex gap-2">
        <input name="block" placeholder="Block" className="input" />
        <input name="flat_no" placeholder="Flat no" className="input" />
      </div>
      <button disabled={busy} className="btn-primary w-full">{busy ? '…' : 'Submit for review'}</button>
      {msg && <p className="text-sm text-center bg-brand-50 text-brand-700 rounded-lg p-2">{msg}</p>}
      <p className="text-xs text-stone-400 text-center">
        Not a resident yet? <Link href="/signup" className="text-brand-600">Join first</Link>
      </p>
    </form>
  );
}
