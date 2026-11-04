'use client';

import { usePathname } from 'next/navigation';

const COPY = {
  de: {
    eyebrow: 'Ein Fehler ist aufgetreten',
    title: 'Etwas ist',
    accent: 'schiefgelaufen.',
    retry: 'Erneut versuchen',
  },
  en: {
    eyebrow: 'Something went wrong',
    title: 'An error',
    accent: 'occurred.',
    retry: 'Try again',
  },
};

export default function ErrorContent({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname();
  const t = pathname === '/en' || pathname.startsWith('/en/') ? COPY.en : COPY.de;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 text-center">
      <p className="cap mb-6">{t.eyebrow}</p>
      <h1 className="h2 mb-8">
        {t.title} <em className="it text-gold">{t.accent}</em>
      </h1>
      <button type="button" onClick={reset} className="btn">
        <span>{t.retry}</span>
      </button>
    </div>
  );
}
