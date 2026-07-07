import React from 'react';

// Minimal markdown → React: paragraphs, **bold**, *italic*. No deps.
function inline(text: string, key: number): React.ReactNode {
  // split on **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <React.Fragment key={key}>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith('*') && p.endsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>;
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </React.Fragment>
  );
}

export function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className="space-y-3 text-stone-700 leading-relaxed">
      {blocks.map((b, i) => (
        <p key={i}>{inline(b, i)}</p>
      ))}
    </div>
  );
}
