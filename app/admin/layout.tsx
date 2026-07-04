import Link from 'next/link';

const tabs = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/residents', label: 'Residents' },
  { href: '/admin/listings', label: 'Listings' },
  { href: '/admin/notices', label: 'Notices' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/import', label: 'Import' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-bold">🛠️ Admin</h1>
        <Link href="/" className="text-sm text-brand-600">← Site</Link>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-3 border-b border-sand-200">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} className="chip-off whitespace-nowrap">
            {t.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
