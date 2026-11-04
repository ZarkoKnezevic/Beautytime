import Link from 'next/link';
import { setRequestLocale } from '@/lib/locale';
import { localizeHref, type Locale } from '@/utils';

const COPY: Record<Locale, { eyebrow: string; title: string; accent: string; home: string }> = {
  de: { eyebrow: 'Fehler 404', title: 'Seite nicht', accent: 'gefunden.', home: 'Zur Startseite' },
  en: { eyebrow: 'Error 404', title: 'Page not', accent: 'found.', home: 'Back to home' },
};

export default function NotFoundContent({ locale }: { locale: Locale }) {
  setRequestLocale(locale);
  const t = COPY[locale];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 text-center">
      <p className="cap mb-6">{t.eyebrow}</p>
      <h1 className="disp mb-8">
        {t.title} <em className="it text-gold">{t.accent}</em>
      </h1>
      <Link href={localizeHref('/', locale)} className="ul text-sm">
        <span className="ul-t">{t.home}</span>
      </Link>
    </div>
  );
}
