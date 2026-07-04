import Link from 'next/link';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// Printable poster + QR for residents to scan and join.
export default async function JoinPage() {
  const host = (await headers()).get('host') ?? 'pakkam.app';
  const url = `https://${host}/signup`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}`;

  return (
    <div className="px-4 pt-6">
      <div className="card p-6 text-center space-y-4 max-w-sm mx-auto">
        <div className="text-3xl">🧡 Pakkam</div>
        <h1 className="text-xl font-bold">Join your community directory</h1>
        <p className="text-stone-600 text-sm">
          Find tuition, tiffin, plumbers, doctors & more — all from neighbours you trust.
          No more scrolling endless WhatsApp groups.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="Join QR" className="mx-auto rounded-xl border border-sand-200" width={240} height={240} />
        <div className="text-sm text-stone-500">Scan to sign up · or visit</div>
        <div className="font-mono text-brand-600 text-sm break-all">{url}</div>
        <Link href="/signup" className="btn-primary w-full">Sign up now</Link>
        <p className="text-xs text-stone-400">
          Tip: print this page (Ctrl/Cmd+P) and stick it on notice boards & lift lobbies.
        </p>
      </div>
    </div>
  );
}
