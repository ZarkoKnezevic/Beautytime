'use client';

import { useId, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getConsent, setConsent, subscribeConsent, type Consent } from '@/utils/consent';

const COPY = {
  de: {
    title: 'Cookies & Datenschutz',
    body: 'Wir verwenden notwendige Cookies, damit die Website funktioniert. Mit Ihrer Zustimmung binden wir auch externe Inhalte (z. B. YouTube, Google Maps) ein, die Daten an Dritte übertragen können.',
    all: 'Alle akzeptieren',
    necessary: 'Nur notwendige',
    link: 'Datenschutzerklärung',
    href: '/datenschutz',
  },
  en: {
    title: 'Cookies & Privacy',
    body: 'We use necessary cookies to make this website work. With your consent we also embed external content (e.g. YouTube, Google Maps) that may transfer data to third parties.',
    all: 'Accept all',
    necessary: 'Only necessary',
    link: 'Privacy policy',
    href: '/en/datenschutz',
  },
};

/**
 * GDPR cookie-consent banner. Shows until a choice is stored; "Accept all"
 * unlocks external embeds (see utils/consent). Locale-aware via the pathname.
 */
export default function CookieBanner() {
  const pathname = usePathname();
  const isEn = pathname === '/en' || pathname.startsWith('/en/');
  const t = isEn ? COPY.en : COPY.de;

  // Server snapshot = "decided" so the banner never flashes before hydration;
  // the client snapshot reads the stored choice.
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => 'necessary' as Consent);
  const titleId = useId();

  const choose = (c: Consent) => setConsent(c);

  if (consent) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby={titleId}>
      <div className="cookie-inner">
        <div className="cookie-text">
          <h2 id={titleId} className="cookie-title it">
            {t.title}
          </h2>
          <p>
            {t.body}{' '}
            <Link href={t.href} className="ul">
              <span className="ul-t">{t.link}</span>
            </Link>
          </p>
        </div>
        <div className="cookie-actions">
          <button type="button" className="btn" onClick={() => choose('necessary')}>
            <span>{t.necessary}</span>
          </button>
          <button type="button" className="btn solid" onClick={() => choose('all')}>
            <span>{t.all}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
