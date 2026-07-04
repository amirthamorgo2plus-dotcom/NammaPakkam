'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n, type Lang } from '@/lib/i18n';

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const pathname = usePathname();

  const tabs = [
    { href: '/', label: t.appName, icon: '🏠' },
    { href: '/directory', label: t.directory, icon: '📒' },
    { href: '/ask', label: t.ask, icon: '💬' },
    { href: '/classifieds', label: t.classifieds, icon: '🏷️' },
    { href: '/notices', label: t.notices, icon: '📢' },
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
            <button
              onClick={() => setLang((lang === 'en' ? 'ta' : 'en') as Lang)}
              className="rounded-lg bg-brand-600/60 px-2.5 py-1 text-xs font-semibold"
              aria-label="Toggle language"
            >
              {lang === 'en' ? 'தமிழ்' : 'EN'}
            </button>
            <Link href="/login" className="rounded-lg bg-white/15 px-3 py-1 text-sm font-semibold">
              {t.login}
            </Link>
          </div>
        </div>
      </header>

      {/* Bottom nav (mobile-first) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 w-full max-w-screen-sm border-t border-sand-200 bg-white">
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
