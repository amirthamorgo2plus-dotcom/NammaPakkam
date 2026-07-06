import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import { ThemeProvider, themeInitScript } from '@/lib/theme';
import Header from '@/components/Header';
import SponsorStrip from '@/components/SponsorStrip';
import Analytics from '@/components/Analytics';

export const metadata: Metadata = {
  title: 'Namma Pakkam — Community Directory',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <div className="mx-auto max-w-screen-sm md:max-w-2xl min-h-screen flex flex-col md:border-x md:border-sand-200 md:shadow-sm bg-sand-50">
              <Header />
              <main className="flex-1 pb-24">{children}</main>
              <SponsorStrip />
            </div>
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
