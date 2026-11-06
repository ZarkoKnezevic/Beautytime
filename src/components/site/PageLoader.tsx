import BrandSeal from '@/components/site/BrandSeal';
import type { Locale } from '@/utils';

const RING_TEXT: Record<Locale, string> = {
  de: 'Die beste Zeit ist BeautyTime.',
  en: 'The best time is BeautyTime.',
};

const LABEL: Record<Locale, string> = {
  de: 'Seite wird geladen',
  en: 'Loading page',
};

/**
 * Route loading screen (`loading.tsx`): the brand seal turning in the content
 * area while the next page streams in. The logo is a static copy of the
 * Storyblok asset so the fallback never has to wait for the CMS.
 */
export default function PageLoader({ locale }: { locale: Locale }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <BrandSeal
        ringText={RING_TEXT[locale]}
        logoSrc="/logo.png"
        pathId="ringpath-loader"
        spinClass="spin spin-fast"
        decorative
      />
      <span className="sr-only">{LABEL[locale]}</span>
    </div>
  );
}
