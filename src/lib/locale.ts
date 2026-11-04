import { cache } from 'react';
import { DEFAULT_LOCALE, type Locale } from '@/utils/i18n';

/**
 * Request-scoped locale store. React's `cache()` gives one instance per server
 * render, so the root layout can set the locale of its route group and nested
 * Server Components (e.g. Storyblok blocks, which only receive `blok`) can read
 * it without dynamic APIs like `headers()`.
 */
const store = cache((): { locale: Locale } => ({ locale: DEFAULT_LOCALE }));

export function setRequestLocale(locale: Locale): void {
  store().locale = locale;
}

export function getRequestLocale(): Locale {
  return store().locale;
}
