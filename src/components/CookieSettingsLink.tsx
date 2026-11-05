'use client';

import { clearConsent } from '@/utils/consent';
import type { Locale } from '@/utils';

const LABEL: Record<Locale, string> = {
  de: 'Cookie-Einstellungen',
  en: 'Cookie settings',
};

/**
 * Footer control that reopens the cookie-consent banner so a visitor can
 * change or withdraw their choice at any time (GDPR Art. 7(3)). Styled to
 * match the adjacent legal links; rendered as a button for accessibility.
 */
export default function CookieSettingsLink({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      onClick={clearConsent}
      className="cap ul"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
        fontFamily: 'inherit',
        cursor: 'pointer',
      }}
    >
      {LABEL[locale] ?? LABEL.de}
    </button>
  );
}
