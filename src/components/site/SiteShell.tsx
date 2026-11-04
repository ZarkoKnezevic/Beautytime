import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { preconnect } from 'react-dom';
import '@/app/globals.css';
import StoryblokBridgeListener from '@/components/StoryblokBridgeListener';
import Reveal from '@/components/Reveal';
import CookieBanner from '@/components/CookieBanner';
import JsonLd from '@/components/seo/JsonLd';
import Header from '@/components/storyblok/Header';
import Footer from '@/components/storyblok/Footer';
import { getGlobalSettings } from '@/lib/storyblok';
import { setRequestLocale } from '@/lib/locale';
import '@/lib/storyblok-init'; // server-side Storyblok init
import { APP_CONFIG, SITE_META } from '@/constants';
import { cn, type Locale } from '@/utils';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['italic'],
  variable: '--font-serif',
  display: 'swap',
});

const SKIP_LABEL: Record<Locale, string> = { de: 'Zum Inhalt springen', en: 'Skip to content' };

/**
 * Reveal targets start hidden (see globals.css) and are shown by adding `.in`.
 * Without JavaScript nothing would ever add it, so this <noscript> sheet shows
 * everything in its final state.
 */
const NO_JS_CSS =
  '.ln>span,.rv,.clip,.clipl,.imgw img,.rule,.wl,.wr{transform:none!important;opacity:1!important;clip-path:none!important;transition:none!important}' +
  '.gold-word,.gw{clip-path:none!important}';

/**
 * Starts the on-load reveals as soon as the HTML is parsed instead of waiting
 * for hydration, which on a throttled phone can be a second or more. Same
 * classes and timings as Reveal.tsx (which takes over afterwards); the hero
 * waits for its priority image so the clip/scale reveal never plays on an
 * empty box. Content inside the first viewport is treated like Reveal's
 * IntersectionObserver would treat it.
 */
const EARLY_REVEAL_JS =
  '(function(){var d=document,vh=innerHeight;' +
  'function on(e){e.classList.add("in")}' +
  'd.querySelectorAll("[data-load]").forEach(function(e){var i=e.querySelector("img[fetchpriority=high]");' +
  'if(i&&!i.complete){var t=setTimeout(function(){on(e)},1500);i.addEventListener("load",function(){clearTimeout(t);on(e)},{once:true})}else on(e)});' +
  'd.querySelectorAll(".rv,.ln,.clip,.clipl,.imgw,[data-io]").forEach(function(e){if(e.closest("[data-load]"))return;' +
  'var r=e.getBoundingClientRect();if(r.top<vh*.94&&r.bottom>0)on(e)})})();';

/** Site-wide metadata defaults; pages override title/description/canonical per story. */
export function siteMetadata(locale: Locale): Metadata {
  const site = SITE_META[locale];
  return {
    metadataBase: new URL(APP_CONFIG.domain),
    title: { default: site.title, template: `%s | ${site.siteName}` },
    description: site.description,
    openGraph: {
      type: 'website',
      locale: site.ogLocale,
      siteName: site.siteName,
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: site.siteName }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

/**
 * The document shell shared by both locale root layouts (`(de)` and `(en)/en`).
 * Static-render friendly: the locale comes from the route group, not from
 * request headers, so pages can be prerendered and cached.
 */
export default async function SiteShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  setRequestLocale(locale);
  const { header, footer, links } = await getGlobalSettings(locale);
  // Every image comes from Storyblok's CDN: open the connection before the hero <img> is parsed.
  preconnect('https://a.storyblok.com');

  return (
    <html lang={locale} className={cn(inter.variable, cormorant.variable, 'font-sans')}>
      <body className="min-h-screen bg-sand text-ink antialiased">
        <noscript>
          <style>{NO_JS_CSS}</style>
        </noscript>
        <a href="#inhalt" className="skip-link">
          {SKIP_LABEL[locale]}
        </a>
        <div className="relative flex min-h-screen flex-col">
          {header ? (
            <header>
              <Header blok={header} footer={footer} allResolvedLinks={links} locale={locale} />
            </header>
          ) : null}
          <main id="inhalt" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          {footer ? <Footer blok={footer} allResolvedLinks={links} locale={locale} /> : null}
        </div>
        <JsonLd footer={footer} locale={locale} />
        <script dangerouslySetInnerHTML={{ __html: EARLY_REVEAL_JS }} />
        <Reveal />
        <CookieBanner />
        <StoryblokBridgeListener />
      </body>
    </html>
  );
}
