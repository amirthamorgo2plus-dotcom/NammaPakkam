import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Pakkam — Community Directory',
  description: 'Your apartment community directory, classifieds & noticeboard.',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#ff5a1f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <div className="mx-auto max-w-screen-sm min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pb-20">{children}</main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
