'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';

const BLOCKS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [block, setBlock] = useState('A');
  const [flat, setFlat] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!configured) {
      setMsg('Connect Supabase (.env.local) to enable real accounts. UI is in demo mode.');
      return;
    }
    setBusy(true);
    const sb = createClient();
    try {
      if (mode === 'login') {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/account');
      } else {
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        const uid = data.user?.id;
        if (uid) {
          // Create the pending resident profile (RLS: insert own row).
          const { data: comm } = await sb.from('communities').select('id').limit(1).single();
          await sb.from('residents').insert({
            id: uid,
            community_id: comm?.id,
            full_name: name,
            phone,
            block,
            flat_no: flat,
            status: 'pending',
          });
        }
        setMsg('✅ Account created! An admin will verify your flat and approve you shortly.');
      }
    } catch (err: any) {
      setMsg(err.message ?? 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-4 pt-6 max-w-md mx-auto">
      <div className="card p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">
          {mode === 'login' ? `${t.login} — ${t.appName}` : `${t.signup} — ${t.appName}`}
        </h1>
        {mode === 'signup' && (
          <p className="text-sm text-stone-500 text-center">
            Sign up with your flat number. An admin verifies you before you can post.
          </p>
        )}

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
              <div className="flex gap-2">
                <select className="input" value={block} onChange={(e) => setBlock(e.target.value)}>
                  {BLOCKS.map((b) => <option key={b}>{b}</option>)}
                </select>
                <input className="input" placeholder="Flat no (e.g. 204)" value={flat} onChange={(e) => setFlat(e.target.value)} required />
              </div>
              <input className="input" placeholder="Phone / WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </>
          )}
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button disabled={busy} className="btn-primary w-full">
            {busy ? '…' : mode === 'login' ? t.login : t.signup}
          </button>
        </form>

        {msg && <p className="text-sm text-center text-brand-700 bg-brand-50 rounded-lg p-2">{msg}</p>}

        <div className="text-center text-sm text-stone-500">
          {mode === 'login' ? (
            <>New here? <Link href="/signup" className="text-brand-600 font-semibold">{t.signup}</Link></>
          ) : (
            <>Have an account? <Link href="/login" className="text-brand-600 font-semibold">{t.login}</Link></>
          )}
        </div>
      </div>
    </div>
  );
}
