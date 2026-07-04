'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useI18n, type Lang } from '@/lib/i18n';

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { href: '/', label: t.appName, icon: '🏠' },
    { href: '/directory', label: t.directory, icon: '📒' },
    { href: '/ask', label: t.ask, icon: '💬' },
    { href: '/classifieds', label: t.classifieds, icon: '🏷️' },
    { href: '/notices', label: t.notices, icon: '📢' },
  ];

  const menuLinks = [
    { href: '/achievers', label: t.achievers, icon: '🌟' },
    { href: '/blog', label: t.blog, icon: '✍️' },
    { href: '/social', label: t.social, icon: '🤝' },
    { href: '/business/new', label: t.addListing, icon: '➕' },
    { href: '/join', label: t.signup, icon: '📣' },
    { href: '/admin', label: t.admin, icon: '🛠️' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-brand-500 text-white">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧡</span>
            <div className="leading-tight">
              <div className="font-bold text-lg">{t.appName}</div>
              <div className="text-[11px] text-brand-100">{t.tagline}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-brand-600/60 p-0.5 text-xs font-semibold" role="group" aria-label="Language">
              {(['en', 'ta', 'hi'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-md px-2 py-0.5 transition ${
                    lang === l ? 'bg-white text-brand-600' : 'text-white/90'
                  }`}
                  aria-pressed={lang === l}
                >
                  {l === 'en' ? 'EN' : l === 'ta' ? 'த' : 'हि'}
                </button>
              ))}
            </div>
            <Link href="/login" className="rounded-lg bg-white/15 px-3 py-1 text-sm font-semibold">
              {t.login}
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-lg bg-white/15 px-2.5 py-1 text-lg leading-none"
              aria-label={t.menu}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute right-0 top-0 h-full w-72 max-w-[80%] bg-white shadow-xl p-4 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-stone-700">{t.menu}</span>
              <button onClick={() => setMenuOpen(false)} className="text-stone-400 text-xl" aria-label="Close">✕</button>
            </div>
            {menuLinks.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-sand-100 text-stone-700"
              >
                <span className="text-lg">{m.icon}</span>
                {m.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav (mobile-first) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 w-full max-w-screen-sm md:max-w-2xl border-t border-sand-200 bg-white">
        <div className="grid grid-cols-5">
          {tabs.map((tab) => {
            const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${
                  active ? 'text-brand-600 font-semibold' : 'text-stone-500'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
