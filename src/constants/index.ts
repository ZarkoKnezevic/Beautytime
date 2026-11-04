/**
 * Application constants.
 */

import type { Locale } from '@/utils/i18n';

export const APP_CONFIG = {
  name: 'Beautytime',
  description: 'Beautytime Traun — Beauty Studio',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  domain: process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000',
} as const;

/** Site-wide metadata defaults per locale (used when a story has no SEO fields). */
export const SITE_META: Record<
  Locale,
  { siteName: string; title: string; description: string; ogLocale: string }
> = {
  de: {
    siteName: 'Beautytime Traun',
    title: 'Beautytime Traun — Beauty Studio',
    description:
      'Dein Beauty Studio in Traun – Kosmetik, Nägel, Haare, Laser, Waxing, Fußpflege und Wimpern unter einem Dach.',
    ogLocale: 'de_AT',
  },
  en: {
    siteName: 'Beautytime Traun',
    title: 'Beautytime Traun — Beauty Studio',
    description:
      'Your beauty studio in Traun – skincare, nails, hair, laser, waxing, foot care and lashes under one roof.',
    ogLocale: 'en_GB',
  },
};

export const STORYBLOK_CONFIG = {
  defaultVersion: 'draft' as const,
  defaultSlug: 'home',
  cacheTags: {
    stories: 'storyblok-stories',
    links: 'storyblok-links',
  },
} as const;

export const ROUTES = {
  home: '/',
} as const;
