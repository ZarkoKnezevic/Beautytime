/**
 * Internationalization helpers.
 * German is the default locale (served at the root, no prefix).
 * English is served under the `/en` prefix.
 */

export const DEFAULT_LOCALE = 'de';
export const LOCALES = ['de', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Split a catch-all slug into its locale + the remaining content slug.
 * `['en', 'leistungen']` → `{ locale: 'en', rest: ['leistungen'] }`
 * `['leistungen']`       → `{ locale: 'de', rest: ['leistungen'] }`
 */
export function parseLocaleFromSlug(slug: string[]): { locale: Locale; rest: string[] } {
  if (slug[0] === 'en') {
    return { locale: 'en', rest: slug.slice(1) };
  }
  return { locale: DEFAULT_LOCALE, rest: slug };
}

/**
 * Prefix an internal href with the locale segment. External links
 * (tel:, mailto:, http, #) and the default locale are returned unchanged.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return href;
  if (!href.startsWith('/')) return href;
  if (href === '/en' || href.startsWith('/en/')) return href;
  if (href === '/') return '/en';
  return `/en${href}`;
}

/** The other locale (toggle target). */
export function otherLocale(l: Locale): Locale {
  return l === 'de' ? 'en' : 'de';
}

/** The current path rendered in the other locale (for a language switch link). */
export function switchLocaleHref(pathname: string, current: Locale): string {
  if (current === 'de') return localizeHref(pathname, 'en');
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/** The `hreflang` code used for each locale. */
export const HREFLANG: Record<Locale, string> = { de: 'de-AT', en: 'en' };

/**
 * Site path (no locale prefix) for a Storyblok `full_slug`.
 * `en/leistungen` → `/leistungen`, `home` → `/`.
 */
export function storyPath(fullSlug: string): string {
  const slug = fullSlug.replace(/^en\//, '').replace(/^\/+|\/+$/g, '');
  return slug === '' || slug === 'home' ? '/' : `/${slug}`;
}

/** Absolute URL of a site path in the given locale. */
export function absoluteUrl(domain: string, path: string, locale: Locale): string {
  const base = domain.replace(/\/$/, '');
  return `${base}${localizeHref(path, locale)}`;
}

/** Canonical + bidirectional hreflang alternates for a site path. */
export function localeAlternates(domain: string, path: string, locale: Locale) {
  const de = absoluteUrl(domain, path, 'de');
  const en = absoluteUrl(domain, path, 'en');
  return {
    canonical: locale === 'en' ? en : de,
    languages: { [HREFLANG.de]: de, [HREFLANG.en]: en, 'x-default': de },
  };
}
