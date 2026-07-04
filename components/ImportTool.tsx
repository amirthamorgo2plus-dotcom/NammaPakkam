'use client';

import { useState } from 'react';

interface Row {
  name: string;
  category: string;
  owner: string;
  phone: string;
  block: string;
  description: string;
}

// Parse pasted WhatsApp/CSV text into preview rows before committing.
function parse(text: string): Row[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = '', category = '', owner = '', phone = '', block = '', ...rest] = line.split(/[,\t]/).map((s) => s.trim());
      return { name, category, owner, phone, block, description: rest.join(', ') };
    })
    .filter((r) => r.name);
}

export default function ImportTool() {
  const [text, setText] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function commit() {
    setMsg(null);
    const res = await fetch('/api/admin/import', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ rows }),
    });
    const json = await res.json();
    setMsg(json.message ?? (res.ok ? `Imported ${rows.length}` : 'Failed'));
  }

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder={'Lakshmi Tuition, tuition, Lakshmi, 9876543210, B, Maths classes 6-12\nAmma Tiffin, tiffin, Saroja, 9876500011, A, Daily lunch boxes'}
        className="input font-mono text-sm"
      />
      <div className="flex gap-2">
        <button onClick={() => setRows(parse(text))} className="btn-ghost flex-1">Preview</button>
        <button onClick={commit} disabled={!rows.length} className="btn-primary flex-1">
          Import {rows.length || ''}
        </button>
      </div>

      {rows.length > 0 && (
        <div className="card divide-y divide-sand-100 text-sm">
          {rows.map((r, i) => (
            <div key={i} className="p-2">
              <span className="font-medium">{r.name}</span>
              <span className="text-stone-500"> · {r.category} · {r.owner} · {r.phone} · {r.block}</span>
            </div>
          ))}
        </div>
      )}

      {msg && <p className="text-sm text-center bg-brand-50 text-brand-700 rounded-lg p-2">{msg}</p>}
    </div>
  );
}
