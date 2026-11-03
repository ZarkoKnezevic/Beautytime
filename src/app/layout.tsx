import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';
import StoryblokProvider from '@/components/StoryblokProvider';
import StoryblokBridgeListener from '@/components/StoryblokBridgeListener';
import Reveal from '@/components/Reveal';
import Header from '@/components/storyblok/Header';
import Footer from '@/components/storyblok/Footer';
import { getGlobalSettings } from '@/lib/storyblok';
import '@/lib/storyblok-init'; // server-side Storyblok init
import { APP_CONFIG } from '@/constants';
import { cn, isLocale, DEFAULT_LOCALE, type Locale } from '@/utils';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.domain),
  title: {
    default: 'Beautytime Traun — Beauty Studio',
    template: '%s | Beautytime Traun',
  },
  description:
    'Dein Beauty Studio in Traun – Kosmetik, Nägel, Haare, Laser, Waxing, Fußpflege und Wimpern unter einem Dach.',
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    siteName: 'Beautytime Traun',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerValue = (await headers()).get('x-locale') || DEFAULT_LOCALE;
  const locale: Locale = isLocale(headerValue) ? headerValue : DEFAULT_LOCALE;

  const { header, footer, links } = await getGlobalSettings(locale);

  return (
    <html lang={locale} className={cn(inter.variable, cormorant.variable, 'font-sans')}>
      <body className="min-h-screen bg-sand text-ink antialiased">
        <StoryblokProvider>
          <div className="relative flex min-h-screen flex-col">
            {header ? (
              <Header blok={header} footer={footer} allResolvedLinks={links} locale={locale} />
            ) : null}
            <main className="flex-1">{children}</main>
            {footer ? <Footer blok={footer} allResolvedLinks={links} locale={locale} /> : null}
          </div>
          <Reveal />
          <StoryblokBridgeListener />
        </StoryblokProvider>
      </body>
    </html>
  );
}
